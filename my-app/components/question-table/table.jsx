"use client";
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Slider, Input, Card, Checkbox } from "@nextui-org/react";


const columns = [
    {
        key: "question",
        label: "Questions",
    },
    {
        key: "rating",
        label: "Rating",
    },
];

export default function App({ interview }) {
    console.log('Interview:', interview)
    const role = interview.jobPosition;
    const qualifications = interview.skillSets ? interview.skillSets : "DRDO specific skills";
    const [difficulty, setDifficulty] = useState(1)
    const [feedbackScore, setFeedbackScore] = useState(undefined)
    const [score, setScore] = useState(interview.status === "pending" ? 0 : interview.totalScore);

    const [questions, setQuestions] = useState(interview.questions || []);
    const [endInterview, setEndInterview] = useState(interview.status === "pending" ? false : true);
    const [customQuestion, setCustomQuestion] = useState("");
    console.log('Role:', role)
    console.log('Qualifications:', qualifications)


    const generateQue = async () => {
        try {
            console.log("Sending request to backend...");
            const res = await fetch("/api/generateQuestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    qualifications,
                    difficulty,
                    feedback_score: feedbackScore,
                }),
            });

            // Check if the fetch response is OK
            if (!res.ok) {
                console.error("Failed to fetch question:", res.statusText);
                return;
            }

            const data = await res.json();
            console.log("Response data:", data);

            const questionText = data.output.split('\n\n')[1] || data.output;

            // Create a new question object with a unique key
            const newQuestion = {
                key: questions.length + 1, // Ensure a unique key
                question: questionText.trim(), // Trim any extra spaces
                rating: 3, // Default rating
            };

            // Set response content
            setQuestions([...questions, newQuestion]);


            // Update total score based on feedback
            if (feedbackScore !== undefined && feedbackScore !== null) {
                setScore(score + feedbackScore * difficulty);
            }
        } catch (error) {
            console.error("Error generating question:", error);
        }
    };


    const handleRatingChange = (key, newRating) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.key === key ? { ...q, rating: newRating } : q
            )
        );
        setFeedbackScore(questions[questions.length - 1].rating);
    };

    const addCustomQuestion = () => {
        if (customQuestion.trim() === "") {
            alert("Please enter a question.");
            return;
        }
        const newQuestion = {
            key: questions.length + 1,
            question: customQuestion,
            rating: 3
        };
        setQuestions([...questions, newQuestion]);
        setCustomQuestion("");
    };

    const totalscore = questions.reduce((sum, q) => sum + q.rating, 0);
    const maxScore = questions.length * 5;

    const updateInterviewData = async () => {
        try {
            console.log("Updating interview data...");
            const res = await fetch("/api/interviews/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    interviewId: interview._id, // Assuming you have the interview ID available
                    questions: questions.map(q => ({
                        key: q.key,           // Include the key
                        question: q.question, // Include the question text
                        rating: q.rating      // Include the rating
                    })),
                    totalScore: totalscore,
                    maxScore: maxScore,
                    status: "completed",
                }),
            });

            if (!res.ok) {
                console.error("Failed to update interview:", res.statusText);
                return;
            }

            console.log("Interview updated successfully.");
        } catch (error) {
            console.error("Error updating interview data:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1600px", margin: "auto" }}>
            <Card css={{ padding: "20px", backgroundColor: "$accents2", maxWidth: "800px", margin: "auto" }}>
                <Table aria-label="Questions">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn
                                key={column.key}
                                css={{ fontSize: "1.25rem", fontWeight: "bold" }} // Adjusted font size and weight
                            >
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={questions}>
                        {(item) => (
                            <TableRow key={item.key}>
                                <TableCell className=" w-3/4"><span className=" line-clamp-3">{item.question}</span></TableCell>
                                <TableCell>
                                    <Slider
                                        size="lg"
                                        step={1}
                                        showSteps
                                        maxValue={5}
                                        minValue={1}
                                        value={item.rating}
                                        onChange={(value) => handleRatingChange(item.key, value)}
                                        css={{ maxWidth: "300px", margin: "0 auto" }}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                {!endInterview && (
                    <>
                        <Button onClick={generateQue} color="primary" auto>
                            Generate a Question
                        </Button>
                        <Button
                            onClick={() => {
                                updateInterviewData(); // Call the function to update the database
                                setEndInterview(true);
                            }}
                            color="secondary"
                            auto
                            style={{ marginLeft: "10px", backgroundColor: "#2dd4bf" }}
                        >
                            End Interview
                        </Button>
                    </>
                )}
            </div>
            {endInterview && (
                <>
                    <div style={{ marginTop: "20px", textAlign: "center", fontWeight: "bold" }}>
                        Total Score: {totalscore} / {maxScore}
                    </div>
                </>
            )}
            {!endInterview && (
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
                    <Input
                        aria-label="Custom Question"
                        placeholder="Enter your question"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        css={{ maxWidth: "300px" }}
                    />
                    <Button
                        onClick={addCustomQuestion}
                        color="primary"
                        auto
                        style={{ marginLeft: "10px" }}
                    >
                        Add Custom Question
                    </Button>
                </div>
            )}
        </div>
    );
}
