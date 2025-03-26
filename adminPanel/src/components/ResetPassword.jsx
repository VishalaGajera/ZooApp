import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { email } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPassword, setIsPassword] = useState(false);
    const [isConfirmPassword, setIsConfirmPassword] = useState(false);
    const url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const Mutation = useMutation({
        mutationFn: (data) => axios.post(`${url}/admin/reset-password`, {
            email_id: data.email,
            password: data.password,
        }),
        onSuccess: (data) => {
            console.log(data?.data?.message)
            toast.success(data?.data?.message);
            setPassword('');
            setConfirmPassword('');
            navigate('/login');
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            Mutation.mutate({ email, password });
        }
    };

    return (
        <div className='flex justify-center items-center w-full h-full bg-lightBlue'>
            <div className='bg-white rounded-xl flex flex-col gap-10 md:p-10 p-5 max-w-[550px] w-full m-5'>
                <div>
                    <h1 className='font-bold text-2xl'>Create a New Password</h1>
                    <p>Choose a strong new password to secure your account</p>
                </div>
                <form action='' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="password" className='font-semibold flex items-center gap-0.5'>
                                New Password <span className='text-primary'>*</span>
                            </label>
                            <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none sm:px-6 px-3 py-3'>
                                <input
                                    type={isPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter your password'
                                    className='bg-transparent w-full outline-none'
                                    required
                                />
                                <span
                                    className='cursor-pointer text-xl text-secondary_2'
                                    onClick={() => setIsPassword(!isPassword)}
                                >
                                    {isPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="confirmPassword" className='font-semibold flex items-center gap-0.5'>
                                Confirm Password <span className='text-primary'>*</span>
                            </label>
                            <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none sm:px-6 px-3 py-3'>
                                <input
                                    type={isConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm your password'
                                    className='bg-transparent w-full outline-none'
                                    required
                                />
                                <span
                                    className='cursor-pointer text-xl text-secondary_2'
                                    onClick={() => setIsConfirmPassword(!isConfirmPassword)}
                                >
                                    {isConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                        <div>
                            <button
                                className='w-full rounded-xl bg-blue text-white border border-blue hover:text-blue p-3 hover:bg-transparent smoothly-transaction font-semibold tracking-wider'
                            >
                                Reset Password
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

export default ResetPassword;
