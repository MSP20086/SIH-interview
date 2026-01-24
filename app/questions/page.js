"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function Questions() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");

  // State for questions
  const [questions, setQuestions] = useState([]);
  // State for new question input
  const [newQuestion, setNewQuestion] = useState("");
  // State for AI button loading
  const [isAILoading, setIsAILoading] = useState(false);

  // Add a manual question
  const addQuestion = () => {
    if (newQuestion.trim() === "") return;
    const newId =
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setQuestions([
      ...questions,
      { id: newId, question: newQuestion, response: "", rating: 0 },
    ]);
    setNewQuestion("");
    // persist
    saveQuestions([
      ...questions,
      { id: newId, question: newQuestion, response: "", rating: 0 },
    ]);
  };

  // Persist questions to server for this interviewId
  const saveQuestions = async (updatedQuestions) => {
    if (!interviewId) return;
    try {
      // sanitize before sending: only keep question, response, rating
      const payload = updatedQuestions.map((q) => ({
        question: q.question ?? "",
        response: q.response ?? "",
        rating: Number(q.rating ?? 0),
      }));
      await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, questions: payload }),
      });
    } catch (err) {
      console.error("Failed to save questions", err);
    }
  };

  // Generate questions from uploaded resume using server-side route
  const fetchAIQuestion = async () => {
    if (!interviewId) {
      alert("Missing interviewId — open this page with ?interviewId=...");
      return;
    }

    setIsAILoading(true);
    try {
      // 1) Check resume metadata to ensure a resume is uploaded (avoid downloading binary)
      const metaRes = await fetch(
        `/api/resume?interviewId=${encodeURIComponent(interviewId)}&meta=true`
      );
      if (!metaRes.ok) {
        throw new Error("Failed to check resume status");
      }
      const meta = await metaRes.json();
      if (!meta || !meta.exists) {
        alert("Resume not uploaded for this interview. Upload a resume first.");
        return;
      }

      // 2) Ask server to generate questions from the stored resume (server calls Gemini)
      const genRes = await fetch("/api/resumeQuestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId }),
      });

      if (!genRes.ok) {
        let errBody = null;
        try {
          errBody = await genRes.json();
        } catch {}
        throw new Error(errBody?.error || "Generation failed on server");
      }

      const data = await genRes.json();

      // Server returns either { ok: true, questions: [...] } or { raw: '...' }
      const generated = Array.isArray(data.questions) ? data.questions : [];

      if (generated.length > 0) {
        const startId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) : 0;
        const newItems = generated.map((q, idx) => ({
          id: startId + idx + 1,
          question: typeof q === "string" ? q : q.question ?? "",
          response: q.response ?? "",
          rating: Number(q.rating ?? 0),
        }));

        const updated = [...questions, ...newItems];
        setQuestions(updated);
        saveQuestions(updated);
      } else if (data.raw) {
        // Attempt to parse the raw string as JSON. Models often wrap JSON inside
        // markdown fences or add a language tag like ```json. Clean common wrappers
        // then try JSON.parse. If parsing yields an array, append each item.
        const cleanModelRaw = (raw) => {
          if (!raw) return null;
          let s = String(raw).trim();
          // Remove triple backtick fences with optional language tag
          s = s.replace(/^```[a-zA-Z0-9_-]*\s*/i, "").replace(/\s*```$/i, "").trim();
          // Remove single backticks
          s = s.replace(/^`+/, "").replace(/`+$/, "").trim();
          // Remove a leading 'json' token if present (e.g. "json[..." or "json\n[..." )
          s = s.replace(/^json\s*/i, "").trim();

          // Try direct parse
          try {
            return JSON.parse(s);
          } catch (e) {
            // Attempt to extract first JSON array or object inside the string
            const firstArr = s.indexOf("[");
            const lastArr = s.lastIndexOf("]");
            if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
              const candidate = s.slice(firstArr, lastArr + 1);
              try {
                return JSON.parse(candidate);
              } catch (e2) {
                // fallthrough
              }
            }
            const firstObj = s.indexOf("{");
            const lastObj = s.lastIndexOf("}");
            if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
              const candidate = s.slice(firstObj, lastObj + 1);
              try {
                return JSON.parse(candidate);
              } catch (e3) {
                // fallthrough
              }
            }
          }
          return null;
        };

        let handled = false;
        try {
          const parsed = cleanModelRaw(data.raw);
          const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.questions) ? parsed.questions : null;
          if (Array.isArray(arr) && arr.length > 0) {
            const startId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) : 0;
            const newItems = arr.map((q, idx) => ({
              id: startId + idx + 1,
              question: typeof q === "string" ? q : q.question ?? String(q) ?? "",
              response: "",
              rating: Number(q.rating ?? 0),
            }));

            const updated = [...questions, ...newItems];
            setQuestions(updated);
            saveQuestions(updated);
            handled = true;
          }
        } catch (parseErr) {
          console.warn("Failed to parse cleaned model output:", parseErr);
        }

        if (!handled) {
          const rawText = String(data.raw).trim();
          const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
          const updated = [...questions, { id: newId, question: rawText, response: "", rating: 0 }];
          setQuestions(updated);
          saveQuestions(updated);
        }
      } else {
        alert("No questions were generated.");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      alert(error?.message || "Failed to generate questions");
    } finally {
      setIsAILoading(false);
    }
  };

  // Delete a question
  const deleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveQuestions(updated);
  };

  // Update question, response, or rating
  const updateQuestion = (id, field, value) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, [field]: field === "rating" ? parseInt(value) : value } : q
    );
    setQuestions(updated);
    // Save updates (debounce would be nicer; immediate save for simplicity)
    saveQuestions(updated);
  };

  // Load questions for the interviewId on mount
  useEffect(() => {
    const load = async () => {
      if (!interviewId) return;
      try {
        const res = await fetch(`/api/questions?interviewId=${encodeURIComponent(interviewId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          // assign ids if missing
          const loaded = data.questions.map((q, idx) => ({ id: q.id ?? idx + 1, ...q }));
          setQuestions(loaded);
        }
      } catch (err) {
        console.error("Failed to load questions", err);
      }
    };
    load();
  }, [interviewId]);

  // Summary statistics for ratings (ignore unrated = 0)
  const stats = useMemo(() => {
    const total = questions.length;
    const rated = questions.map((q) => Number(q.rating ?? 0)).filter((r) => r > 0);
    if (rated.length === 0) {
      return { total, min: "N/A", max: "N/A", median: "N/A", avg: "N/A" };
    }
    rated.sort((a, b) => a - b);
    const min = rated[0];
    const max = rated[rated.length - 1];
    const sum = rated.reduce((s, v) => s + v, 0);
    const avg = +(sum / rated.length).toFixed(2);
    const mid = Math.floor(rated.length / 2);
    const median = rated.length % 2 === 0 ? +(((rated[mid - 1] + rated[mid]) / 2).toFixed(2)) : rated[mid];
    return { total, min, max, median, avg };
  }, [questions]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="flex-1 p-6 pt-24">
        {/* Centered heading */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-center text-gray-900">
            Questions for the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              Candidate
            </span>
          </h1>
        </div>

        {/* Question Input Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter a new question"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={addQuestion}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Add Question
            </button>
            <button
              onClick={fetchAIQuestion}
              disabled={isAILoading}
              className={`px-5 py-3 bg-teal-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 ${
                isAILoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-teal-700"
              }`}
            >
              {isAILoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <span className="text-lg">✨</span>
              )}
              {isAILoading ? "Generating..." : "Get AI Question"}
            </button>
          </div>
        </div>

        {/* Questions Table */}
        <div className="w-[80vw] mx-auto bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-teal-50">
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Question
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Response
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Rating
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr
                  key={q.id}
                  className={`border-b border-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="p-4">
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(q.id, "question", e.target.value)
                      }
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 text-gray-800 bg-transparent"
                      placeholder="Enter question"
                    />
                  </td>
                  <td className="p-4">
                    <textarea
                      value={q.response}
                      onChange={(e) =>
                        updateQuestion(q.id, "response", e.target.value)
                      }
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 text-gray-800 bg-transparent resize-y"
                      rows="3"
                      placeholder="Enter response"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          onClick={() => updateQuestion(q.id, "rating", i + 1)}
                          className={`cursor-pointer text-2xl transition-transform duration-200 transform hover:scale-125 ${
                            i < q.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="text-xl text-gray-500 hover:text-red-500 transition-transform duration-200 transform hover:scale-110 focus:outline-none"
                      aria-label="Delete question"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Card */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-center">
            <h3 className="text-lg font-semibold mb-2">Questions Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="font-medium">Total</div>
              <div>{stats.total}</div>

              <div className="font-medium">Min Rating</div>
              <div>{stats.min}</div>

              <div className="font-medium">Max Rating</div>
              <div>{stats.max}</div>

              <div className="font-medium">Median</div>
              <div>{stats.median}</div>

              <div className="font-medium">Average</div>
              <div>{stats.avg}</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
