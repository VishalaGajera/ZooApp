import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL
    const [email_id, setEmail] = useState('');

    const Mutation = useMutation({
        mutationFn: () => axios.post(`${url}/admin/forgot-password`, { email_id }),
        onSuccess: (data) => {
            console.log(data?.data?.message)
            toast.success(data?.data?.message);
            setEmail('');
            navigate(`/verify-otp/${email_id}`);
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Mutation.mutate();
    };

    return (
        <div className='flex justify-center items-center w-full h-full bg-lightBlue'>
            <div className='bg-white rounded-xl flex flex-col gap-10 md:p-10 p-5 max-w-[550px] w-full m-5'>
                <div>
                    <h1 className='font-bold text-2xl'>Forgot Your Password?</h1>
                    <p>Enter your email address to receive a password reset link</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="email" className='font-semibold flex items-center gap-0.5'>
                                Email <span className='text-primary'>*</span>
                            </label>
                            <input
                                type="email"
                                name="email_id"
                                id="email_id"
                                value={email_id}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your Email Address"
                                className='outline-none border rounded-xl py-3 sm:px-6 px-3'
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className='w-full rounded-xl bg-blue text-white border border-blue hover:text-blue p-3 hover:bg-transparent smoothly-transaction font-semibold tracking-wider'
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </div>
                </form>
                <div className='text-center'>
                    <Link to="/login" className="text-blue-600 hover:underline text-blue">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
