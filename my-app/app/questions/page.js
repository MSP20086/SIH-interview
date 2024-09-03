'use client'
import { questions } from "@/data/questions";
import ListItem from "@/components/ListItem";
import Table from "@/components/question-table/table";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Questions() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interviewId');
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(`/api/interviews/get?interviewId=${interviewId}`);
    const data = await response.json();
    setDetails(data);
    setLoading(false);
    return data;
  };
  

  useEffect(() => {
    console.log('Interview ID:', interviewId);
    fetchData();
  },[interviewId]);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-100 to-white h-screen flex items-center justify-center">
        <div className="flex items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-800">Loading interview data...</p>
        </div>
      </section>
    )
  }

  console.log('Interview details:', details);
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
        <Table interview={details} />
      </main>
    </div>
  );
}
