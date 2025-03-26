import React, { useState, useEffect } from 'react';
import { LuPencilLine } from 'react-icons/lu';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from 'react-icons/fa6';
import EditAdminModal from '../modal/EditAdminModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
    const [isOldPwd, setIsOldPwd] = useState(false);
    const [isNewPwd, setIsNewPwd] = useState(false);
    const [isConfirmPwd, setIsConfirmPwd] = useState(false);
    const [isAddEdit, setIsAddEdit] = useState(false);
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const url = import.meta.env.VITE_API_URL;

    const { data, isFetching, error, refetch } = useQuery({
        queryKey: ['fetchFeedback'],
        queryFn: async () => {
            const response = await fetch(`${url}/admin/get`);
            if (!response.ok) {
                console.log('Failed to fetch admin data');
                return { data: [] };
            }
            return response.json();
        }
    });

    const handleAddEditModalClose = () => {
        setIsAddEdit(false);
        refetch();
    };

    const editAdminMutation = useMutation({
        mutationFn: () => axios.put(`${url}/admin/change-password/${data?.data[0]?._id}`, { oldPwd, newPwd }),
        onSuccess: (data) => {
            toast.success(data.data.message);
            setOldPwd('');
            setNewPwd('');
            setConfirmPwd('');
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const handleChangePassword = () => {
        if (newPwd !== confirmPwd) {
            toast.error('Passwords do not match');
        } else {
            editAdminMutation.mutate();
        }
    }

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='flex flex-col h-full p-5 w-full gap-5 items-center'>
            <div className='flex w-full gap-5 items-center'>
                <h1 className='text-xl font-semibold min-w-max'>My Profile</h1>
                <div className='bg-white h-0.5 w-full'></div>
            </div>
            <div className='flex bg-white p-5 rounded-xl w-full gap-5 items-center'>
                <div className='h-20 rounded-full w-20 overflow-hidden'>
                    <img src="https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png" alt="" className='h-full w-full object-cover' />
                </div>
                <div>
                    <h1 className='text-2xl text-blue font-semibold'>{data?.data[0]?.first_name}</h1>
                    <span className='text-secondary'>admin</span>
                </div>
            </div>
            <div className='flex flex-col bg-white p-5 rounded-xl w-full gap-3'>
                <div className='flex justify-between w-full gap-5 items-center'>
                    <h2 className='text-blue text-lg font-semibold sm:text-2xl'>Personal Information</h2>
                    <div className='hidden sm:flex'>
                        <button className='flex bg-blue border border-blue justify-center rounded-xl text-white w-fit font-semibold gap-3 hover:bg-transparent hover:text-blue px-5 py-2 sm:w-32 smoothly-transaction tems-center' onClick={() => setIsAddEdit(true)}>
                            <span><LuPencilLine className='text-xl' /></span>Edit
                        </button>
                    </div>
                </div>
                <div className='bg-lightBlue h-0.5 w-full'></div>
                <div className='grid grid-cols-1 gap-5 items-center lg:grid-cols-4 sm:gap-10 sm:grid-cols-3'>
                    <div className='flex flex-col justify-center gap-1'>
                        <label htmlFor="" className='text-secondary_2 font-semibold'>First Name : </label>
                        <span className='text-lg font-semibold'>{data?.data[0]?.first_name}</span>
                    </div>
                    <div className='flex flex-col justify-center gap-1'>
                        <label htmlFor="" className='text-secondary_2 font-semibold'>Last Name : </label>
                        <span className='text-lg font-semibold'>{data?.data[0]?.last_name}</span>
                    </div>
                    <div className='flex flex-col justify-center gap-1'>
                        <label htmlFor="" className='text-secondary_2 font-semibold'>Email_ID : </label>
                        <span className='text-lg font-semibold'>{data?.data[0]?.email_id}</span>
                    </div>
                    <div className='flex justify-end sm:hidden'>
                        <button className='flex bg-blue border border-blue justify-center rounded-xl text-white w-32 font-semibold gap-3 hover:bg-transparent hover:text-blue px-5 py-2 smoothly-transaction tems-center' onClick={() => setIsAddEdit(true)}>
                            <span><LuPencilLine className='text-xl' /></span>Edit
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col bg-white p-5 rounded-xl w-full gap-3'>
                <div className='flex justify-between w-full gap-5 items-center'>
                    <h2 className='text-blue text-lg font-semibold sm:text-2xl'>Change Password</h2>
                </div>
                <div className='bg-lightBlue h-0.5 w-full'></div>
                <div className='flex flex-col justify-between w-full gap-5 md:flex-row xl:gap-10 sm:items-end'>
                    <div className='flex flex-col w-full gap-0.5'>
                        <label htmlFor="old_pwd" className='text-sm'>Old Password :</label>
                        <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none px-3 py-2'>
                            <input type={isOldPwd ? "text" : "password"} name="old_pwd" id="old_pwd" placeholder='Old Password' className='bg-transparent w-full outline-none' value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
                            <span className='cursor-pointer' onClick={() => setIsOldPwd(!isOldPwd)}>{isOldPwd ? <FaEye /> : <FaEyeSlash />}</span>
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-0.5'>
                        <label htmlFor="new_pwd" className='text-sm'>New Password :</label>
                        <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none px-3 py-2'>
                            <input type={isNewPwd ? "text" : "password"} name="new_pwd" id="new_pwd" placeholder='New Password' className='bg-transparent w-full outline-none' value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                            <span className='cursor-pointer' onClick={() => setIsNewPwd(!isNewPwd)}>{isNewPwd ? <FaEye /> : <FaEyeSlash />}</span>
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-0.5'>
                        <label htmlFor="confirm_pwd" className='text-sm'>Confirm Password :</label>
                        <div className='flex bg-transparent border rounded-lg w-full gap-3 items-center outline-none px-3 py-2'>
                            <input type={isConfirmPwd ? "text" : "password"} name="confirm_pwd" id="confirm_pwd" placeholder='Confirm Password' className='bg-transparent w-full outline-none' value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                            <span className='cursor-pointer' onClick={() => setIsConfirmPwd(!isConfirmPwd)}>{isConfirmPwd ? <FaEye /> : <FaEyeSlash />}</span>
                        </div>
                    </div>
                    <div className='flex justify-end md:w-fit w-full'>
                        <button
                            className='flex bg-blue border border-blue justify-center rounded-xl text-white w-32 font-semibold gap-3 hover:bg-transparent hover:text-blue px-5 py-2 smoothly-transaction tems-center'
                            onClick={() => handleChangePassword()}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            {isAddEdit && <EditAdminModal onClose={handleAddEditModalClose} data={data?.data[0]} />}
        </div>
    );
}

export default Profile;
