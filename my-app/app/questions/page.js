'use client'
import { questions } from "@/data/questions";
import ListItem from "@/components/ListItem";
import Table from "@/components/question-table/table";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import animationDataload from '@/components/lottie/loading.json'
import Lottie from 'lottie-react'

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
    setTimeout(() => {
      setLoading(false)
    }, 3000)
    return data;
  };


  useEffect(() => {
    console.log('Interview ID:', interviewId);
    fetchData();
  }, [interviewId]);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-100 to-white h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Lottie
            animationData={animationDataload}
            style={{ height: '150px', width: '150px' }}
          />
          <p className="text-gray-800">Loading Interview data...</p>
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
