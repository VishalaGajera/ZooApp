import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa6';
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify';

const AddEditFeedbackModal = ({ onClose, data }) => {
    const url = import.meta.env.VITE_API_URL;
    const [approved, setApproved] = useState();

    useEffect(() => {
        setApproved(data.approved);
    }, []);

    const handleChangeApprovedValue = (e) => {
        setApproved(Number(e.target.value));
    }

    const editUserMutation = useMutation({
        mutationFn: () => axios.put(`${url}/feedback/update/${data._id}/${approved}`),
        onSuccess: (data) => {
            toast.success(data.data.message);
            onClose();
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const handleSubmit = () => {
        editUserMutation.mutate();
    };

    return (
        <div className="flex bg-black bg-opacity-50 h-full justify-center fixed inset-0 items-start right-0 top-0 z-50">
            <form className="flex flex-col bg-white m-5 p-5 rounded-lg w-full gap-5 relative sm:mt-10 sm:w-[450px]">
                <span className='bg-gray-200 p-3 rounded-full text-lg absolute cursor-pointer hover:rotate-90 hover:text-blue right-3 smoothly-transaction top-3' onClick={onClose}><RxCross1 /></span>
                <div className="text-center">
                    <h4 className="text-2xl text-blue font-semibold">Edit Feedback</h4>
                </div>
                <div className="flex flex-col justify-center w-full gap-3">
                    <div className='flex flex-col gap-0.5'>
                        <label htmlFor="animal_name" className='text-sm'>Rating :</label>
                        <span className='flex text-2xl gap-1 items-center'>
                            {[...Array(5)].map((_, index) =>
                                index < data.rating ? <FaStar key={index} className='text-primary' /> : <FaStar key={index} className='text-gray-300' />
                            )}
                        </span>
                    </div>
                    <div className='flex flex-col gap-0.5'>
                        <label htmlFor="period" className='text-sm'>Comment :</label>
                        <span className='bg-transparent border rounded-lg outline-none px-3 py-2' >{data.comment}</span>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <label htmlFor="frequency" className='text-sm'>Approved :</label>
                        <div className='flex gap-4 items-center'>
                            <span className='flex gap-2 items-center'><input type="radio" name="approved" id="1" value='1' checked={approved === 1} onChange={handleChangeApprovedValue} /><label htmlFor="1">Yes</label></span>
                            <span className='flex gap-2 items-center'><input type="radio" name="approved" id="0" value='0' checked={approved === 0} onChange={handleChangeApprovedValue} /><label htmlFor="0">No</label></span>
                        </div>
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

export default AddEditFeedbackModal
