"use client";
import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Slider, Input, Card } from "@nextui-org/react";

const initialQuestions = [
    "What is your favorite color?",
    "How do you spend your free time?",
    "What is your dream job?",
    "What is the most important thing you've learned in your life?",
    "What motivates you?",
    "What are your strengths and weaknesses?",
    "Describe a challenging situation you faced and how you overcame it.",
    "What are your career goals?",
    "How do you handle stress and pressure?",
    "What is your favorite book or movie and why?",
    "How do you approach problem-solving?",
    "What do you enjoy most about your current or previous job?",
    "What skills would you like to develop further?",
    "How do you prioritize your tasks?",
    "What type of work environment do you thrive in?",
    "What is the best piece of advice you've ever received?",
    "How do you stay updated with industry trends?",
    "Describe a time when you worked as part of a team.",
    "What do you think makes a good leader?",
    "What do you enjoy doing outside of work?",
];

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

export default function App() {
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [endInterview, setEndInterview] = useState(false);
    const [customQuestion, setCustomQuestion] = useState("");

    const generateQuestion = () => {
        if (questionIndex < initialQuestions.length) {
            const newQuestion = {
                key: questions.length + 1,
                question: initialQuestions[questionIndex],
                rating: 3
            };
            setQuestions([...questions, newQuestion]);
            setQuestionIndex(questionIndex + 1);
        } else {
            console.log("No more questions available.");
        }
    };

    const handleRatingChange = (key, newRating) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.key === key ? { ...q, rating: newRating } : q
            )
        );
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

    const totalScore = questions.reduce((sum, q) => sum + q.rating, 0);
    const maxScore = questions.length * 5;

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
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
                                <TableCell>{item.question}</TableCell>
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
                        <Button onClick={generateQuestion} color="primary" auto>
                            Generate a Question
                        </Button>
                        <Button
                            onClick={() => setEndInterview(true)}
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
                <div style={{ marginTop: "20px", textAlign: "center", fontWeight: "bold" }}>
                    Total Score: {totalScore} / {maxScore}
                </div>
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
