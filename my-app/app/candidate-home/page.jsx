"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/user';
import Link from 'next/link';

export default function EnterInterviewID() {
    const [interviewID, setInterviewID] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const { user } = useUser();
    const [hasAccess, setHasAccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            return;
        }

        if (user.role !== 'candidate') {
            router.push('/');
            return;
        }

        setHasAccess(true);
        setLoadingUser(false);
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!interviewID || !user?.email) {
            setError('Interview ID, authentication token, and user email are required');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/checkinterview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ interviewID, token: user.token, userEmail: user.email }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push(`/can/?id=${interviewID}`);
            } else {
                setError(data.error || 'Failed to validate Interview ID or user');
            }
        } catch (error) {
            setError('An error occurred while checking the interview');
        } finally {
            setLoading(false);
        }
    };

    if (loadingUser) {
        return (
            <section className="bg-gradient-to-b from-gray-100 to-white h-screen flex items-center justify-center">
                <div className="flex items-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                    <p className="ml-4 text-gray-800">Loading user data...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gradient-to-b from-gray-100 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h1 className="h1">Enter your Interview ID</h1>
                    </div>
                    <div className="max-w-sm mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3">
                                    <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="interviewID">
                                        Interview ID <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="interviewID"
                                        type="text"
                                        className="form-input w-full text-gray-800"
                                        placeholder="Enter your Interview ID"
                                        value={interviewID}
                                        onChange={(e) => setInterviewID(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                            <div className="flex flex-wrap -mx-3 mt-6">
                                <div className="w-full px-3">
                                    <button
                                        type="submit"
                                        className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                                        disabled={loading}
                                    >
                                        {loading ? 'Checking...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="text-gray-600 text-center mt-6">
                            Go back to <Link href="/" className="text-blue-600 hover:underline transition duration-150 ease-in-out">Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
