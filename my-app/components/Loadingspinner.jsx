'use client';

import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-white">
            <div className="flex flex-col items-center">
                <svg className="w-12 h-12 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0A8 8 0 014 12z"></path>
                </svg>
                <p className="mt-4 text-gray-700">Loading...</p>
            </div>
        </div>
    );
};

