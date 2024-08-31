// app/questions/page.js
import { questions } from "@/data/questions";
import ListItem from "@/components/ListItem";

export default function Questions() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Main content area */}
      <main className="flex-1 p-6 pt-24 bg-blue-100">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          Questions For Candidate
        </h1>
        <div className="space-y-6 mt-6">
          {questions.map(({ id, question, answer }) => (
            <ListItem key={id} question={question} answer={answer} />
          ))}
        </div>
      </main>
    </div>
  );
}
