import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

const Signup = () => {
    const [isPassword, setIsPassword] = useState(false);
    const [isConfirmPassword, setIsConfirmPassword] = useState(false);
    const [confirmPwd, setConfirmPwd] = useState('');
    const url = import.meta.env.VITE_API_URL;
    const [data, setData] = useState({});

    const handleChangeValue = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(prev => ({ ...prev, [name]: value }));
    }

    const addUserMutation = useMutation({
        mutationFn: (signpData) => axios.post(`${url}/admin/register`, signpData),
        onSuccess: (data) => {
            console.log(data?.data?.message)
            toast.success(data?.data?.message);
            setData({});
            setConfirmPwd('');
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.password !== confirmPwd) {
            toast.error('Password do not match');
        } else {
            addUserMutation.mutate(data);
        }
    };

    return (
        <div className='flex justify-center items-center w-full h-full bg-lightBlue'>
            <div className='bg-white rounded-xl flex flex-col gap-10 md:p-10 p-5 max-w-[550px] w-full m-5'>
                <div>
                    <h1 className='font-bold text-2xl'>Create your account</h1>
                    <p>Enter your personal detail to create account</p>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-semibold flex items-center gap-0.5'>Your username <span className='text-primary'>*</span></label>
                            <div className='grid sm:grid-cols-2 grid-cols-1 sm:gap-5 gap-2'>
                                <input type="text" name="first_name" id="first_name" value={data?.first_name || ""} onChange={handleChangeValue} placeholder='First Name' className='outline-none border rounded-xl py-3 sm:px-6 px-3' />
                                <input type="text" name="last_name" id="last_name" value={data?.last_name || ""} onChange={handleChangeValue} placeholder='Last Name' className='outline-none border rounded-xl py-3 sm:px-6 px-3' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-semibold flex items-center gap-0.5'>Email address <span className='text-primary'>*</span></label>
                            <input type="email" name="email_id" id="email_id" value={data?.email_id || ""} onChange={handleChangeValue} placeholder='Enter your email address' className='outline-none border rounded-xl py-3 sm:px-6 px-3' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-semibold flex items-center gap-0.5'>Password <span className='text-primary'>*</span></label>
                            <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none sm:px-6 px-3 py-3'>
                                <input type={isPassword ? "text" : "password"} name="password" id="password" value={data?.password || ""} onChange={handleChangeValue} placeholder='Enter your password' className='bg-transparent w-full outline-none' />
                                <span className='cursor-pointer text-xl text-secondary_2' onClick={() => setIsPassword(!isPassword)}>{isPassword ? <FaEye /> : <FaEyeSlash />}</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-semibold flex items-center gap-0.5'>Confirm Password <span className='text-primary'>*</span></label>
                            <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none sm:px-6 px-3 py-3'>
                                <input type={isConfirmPassword ? "text" : "password"} name="cpassword" id="cpassword" value={confirmPwd || ""} onChange={(e)=>setConfirmPwd(e.target.value)} placeholder='Enter your password' className='bg-transparent w-full outline-none' />
                                <span className='cursor-pointer text-xl text-secondary_2' onClick={() => setIsConfirmPassword(!isConfirmPassword)}>{isConfirmPassword ? <FaEye /> : <FaEyeSlash />}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" name="agree" id="agree" className='w-5 h-5' />
                            <label htmlFor="agree">Agree with Privacy Policy</label>
                        </div>
                        <div>
                            <button className='w-full rounded-xl bg-blue text-white border border-blue hover:text-blue p-3 hover:bg-transparent smoothly-transaction font-semibold tracking-wider'>Register</button>
                        </div>
                    </div>
                </form>
                <div className=''>
                    <span className='flex items-center justify-center gap-0.5'>You have an account? <Link to={'/login'} className='text-blue'>Login Now</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Signup
