import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [isPassword, setIsPassword] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  const [email_id, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const addUserMutation = useMutation({
    mutationFn: () => axios.post(`${url}/admin/login`, { email_id, password }),
    onSuccess: (data) => {
      console.log(data?.data?.message)
      toast.success(data?.data?.message);
      setEmail('');
      setPassword('');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addUserMutation.mutate();
  };


  return (
    <div className='flex justify-center items-center w-full h-full bg-lightBlue'>
      <div className='bg-white rounded-xl flex flex-col gap-10 md:p-10 p-5 max-w-[550px] w-full m-5'>
        <div>
          <h1 className='font-bold text-2xl'>Login to account</h1>
          <p>Enter your email & password to login</p>
        </div>
        <form action="" onSubmit={handleSubmit}>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="" className='font-semibold flex items-center gap-0.5'>Email address <span className='text-primary'>*</span></label>
              <input type="email" name="email_id" id="email_id" value={email_id || ""} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email address' className='outline-none border rounded-xl py-3 sm:px-6 px-3' />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="" className='font-semibold flex items-center gap-0.5'>Password <span className='text-primary'>*</span></label>
              <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none sm:px-6 px-3 py-3'>
                <input type={isPassword ? "text" : "password"} name="password" id="password" value={password || ""} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' className='bg-transparent w-full outline-none' />
                <span className='cursor-pointer text-xl text-secondary_2' onClick={() => setIsPassword(!isPassword)}>{isPassword ? <FaEye /> : <FaEyeSlash />}</span>
              </div>
            </div>
            <div className='flex justify-between items-center gap-5'>
              <div className='flex items-center gap-2'>
                <input type="checkbox" name="keep" id="keep" className='w-5 h-5' />
                <label htmlFor="keep">Keep me signed in</label>
              </div>
              <Link to={'/forgot-password'} className='text-blue'>Forgot Password?</Link>
            </div>
            <div>
              <button className='w-full rounded-xl bg-blue text-white border border-blue hover:text-blue p-3 hover:bg-transparent smoothly-transaction font-semibold tracking-wider'>Login</button>
            </div>
          </div>
        </form>
        <div className=''>
          <span className='flex items-center justify-center gap-0.5'>You don't have an account yet? <Link to={'/signup'} className='text-blue'>Register Now</Link></span>
        </div>
      </div>
    </div>
  )
}

export default Login
