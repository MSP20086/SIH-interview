// components/ListItem.jsx
"use client";
import React from "react";
import HoverRating from "./HoverRating"; // Import HoverRating

const ListItem = ({ question, answer }) => {
  const [rating, setRating] = React.useState(2);

  return (
    <div className="p-6 border border-blue-300 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
      <h2 className="text-xl font-bold text-blue-800 mb-2">
        <span className="font-bold">Q{question}</span>
      </h2>
      <p className="text-gray-700">
        <span className="font-semibold">Ans:</span> {answer}
      </p>
      <hr className="my-4 border-t-2 border-blue-200" />
      <div className="mt-4">
        {/* Include HoverRating for each question */}
        <HoverRating rating={rating} onRatingChange={setRating} />
      </div>
    </div>
  );
};

export default ListItem;
