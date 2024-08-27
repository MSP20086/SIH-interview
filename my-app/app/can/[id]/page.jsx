'use client'
import React from 'react';
import { useState, useEffect } from 'react';


export default function Page(){
  
  return (
    <div className="flex flex-col md:flex-row h-screen pt-16 md:pt-20 desktop-only">
    
      <div className="md:w-1/2 p-20 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <p className="mb-4">Please fill in the form below with your details to proceed:</p>
        <ul className="list-disc list-inside">
          <li>Enter your full name</li>
          <li>Provide a valid email address</li>
          <li>Include any other required details</li>
        </ul>
      </div>
      
      <div className="md:w-1/2 p-8 bg-white">
        <h2 className="text-2xl font-bold mb-4">User Details Form</h2>
      </div>
    </div>
  );
};
