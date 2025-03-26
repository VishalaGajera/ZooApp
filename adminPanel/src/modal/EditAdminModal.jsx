import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify';

const EditAdminModal = ({ onClose, data }) => {
    const url = import.meta.env.VITE_API_URL;
    const [admin, setAdmin] = useState({
        first_name: '',
        last_name: '',
        email_id: ''
    });

    useEffect(() => {
        setAdmin({
            first_name: data.first_name,
            last_name: data.last_name,
            email_id: data.email_id
        });
    }, []);

    const handleChangeValue = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setAdmin(prev => ({ ...prev, [name]: value }));
    }

    const editAdminMutation = useMutation({
        mutationFn: (adminData) => axios.put(`${url}/admin/update/${data._id}`, adminData),
        onSuccess: (data) => {
            toast.success(data.data.message);
            onClose();
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const handleSubmit = () => {
        editAdminMutation.mutate(admin);
    };

    return (
        <div className="flex bg-black bg-opacity-50 h-full justify-center fixed inset-0 items-start right-0 top-0 z-50">
            <form className="flex flex-col bg-white m-5 p-5 rounded-lg w-full gap-5 relative sm:mt-10 sm:w-[450px]">
                <span className='bg-gray-200 p-3 rounded-full text-lg absolute cursor-pointer hover:rotate-90 hover:text-blue right-3 smoothly-transaction top-3' onClick={onClose}><RxCross1 /></span>
                <div className="text-center">
                    <h4 className="text-2xl text-blue font-semibold">Edit Information</h4>
                </div>
                <div className="flex flex-col justify-center w-full gap-3">
                    <div className='flex flex-col gap-0.5'>
                        <label htmlFor="first_name" className='text-sm'>Fisrt Name :</label>
                        <input type="text" name="first_name" id="first_name" value={admin.first_name || ""} onChange={handleChangeValue} placeholder='First Name' className='bg-transparent border rounded-lg outline-none px-3 py-2' />
                    </div>
                    <div className='flex flex-col gap-0.5'>
                        <label htmlFor="last_name" className='text-sm'>Last Name :</label>
                        <input type="text" name="last_name" id="last_name" value={admin.last_name || ""} onChange={handleChangeValue} placeholder='Last Name' className='bg-transparent border rounded-lg outline-none px-3 py-2' />
                    </div>
                    <div className='flex flex-col gap-0.5'>
                        <label htmlFor="email_id" className='text-sm'>Email ID :</label>
                        <input type="text" name="email_id" id="email_id" value={admin.email_id || ""} onChange={handleChangeValue} placeholder='Email ID' className='bg-transparent border rounded-lg outline-none px-3 py-2' />
                    </div>
                </div>
                <div className="flex justify-end gap-3 items-center">
                    <button
                        type="button"
                        className="bg-gray-400 rounded-md text-white w-fit font-semibold hover:bg-gray-500 px-10 py-3 smoothly-transaction"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-blue rounded-md text-white w-fit font-semibold px-10 py-3 smoothly-transaction"
                        onClick={() => handleSubmit()}
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditAdminModal
