"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/user';
import Link from 'next/link';
import animationDataload from '@/components/lottie/loading.json'
import Lottie from 'lottie-react'
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';

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
        setTimeout(() => {
            setLoadingUser(false)
          }, 3000)
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!interviewID || !user?.email) {
            setError('Interview ID, authentication token, and user email are required');
            toast.error('Interview ID, authentication token, and user email are required');
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
                toast.success('Interview ID validated successfully');
                router.push(`/can/?id=${interviewID}`);
            } else {
                setError(data.error || 'Failed to validate Interview ID or user');
                toast.error(data.error || 'Failed to validate Interview ID or user');
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
                <div className="flex flex-col items-center justify-center space-y-4">
                <Lottie
                    animationData={animationDataload}
                    style={{ height: '150px', width: '150px' }}
                />
                <p className="text-gray-800">Loading...</p>
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
                            <div className="flex flex-wrap -mx-3 mt-6">
                                <div className="w-full px-3">
                                    <Button
                                        type="submit"
                                        className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                                        disabled={loading}
                                    >
                                        {loading ? 'Checking...' : 'Submit'}
                                    </Button>
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
