// app/questions/page.js
import { questions } from "@/data/questions";
import ListItem from "@/components/ListItem";
import Table from "@/components/question-table/table";

export default function Questions() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <main className="flex-1 p-6 pt-24">
        {/* Centered heading container */}
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-center">
            Questions for the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Candidate</span>
          </h1>
        </div>
        <Table />
      </main>
    </div>
  );
}
