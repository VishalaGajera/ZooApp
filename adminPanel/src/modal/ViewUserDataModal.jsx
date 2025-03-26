import React from 'react'
import { RxCross1 } from 'react-icons/rx'

const ViewUserDataModal = ({ onClose, data }) => {
    return (
        <div className="flex bg-black bg-opacity-50 h-full justify-center fixed inset-0 items-start right-0 top-0 z-50">
            <div className="flex flex-col bg-white m-5 p-5 rounded-lg w-full gap-10 relative sm:mt-10 sm:p-10 sm:w-96">
                <span className='bg-gray-200 p-3 rounded-full text-lg absolute cursor-pointer hover:rotate-90 hover:text-blue right-3 smoothly-transaction top-3' onClick={onClose}><RxCross1 /></span>
                <div className="text-center">
                    <h4 className="text-2xl text-blue font-semibold">User Data</h4>
                </div>
                <div className="flex flex-col gap-5">
                    <div className='grid grid-cols-1 gap-5 sm:gap-10 sm:grid-cols-2'>
                        <div className='flex flex-col justify-center gap-0.5'>
                            <label htmlFor="" className='text-secondary text-sm font-semibold'>First Name : </label>
                            <span>{data.first_name}</span>
                        </div>
                        <div className='flex flex-col justify-center gap-0.5'>
                            <label htmlFor="" className='text-secondary text-sm font-semibold'>Last Name : </label>
                            <span>{data.last_name}</span>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-5 sm:gap-10 sm:grid-cols-2'>
                        <div className='flex flex-col justify-center gap-0.5'>
                            <label htmlFor="" className='text-secondary text-sm font-semibold'>Email_ID : </label>
                            <span>{data.email_id}</span>
                        </div>
                        <div className='flex flex-col justify-center gap-0.5'>
                            <label htmlFor="" className='text-secondary text-sm font-semibold'>Mobile Number : </label>
                            <span>+{data.mobile}</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-5 items-center">
                    <button
                        type="button"
                        className="bg-gray-400 p-3 rounded-md text-white w-32 font-semibold hover:bg-gray-500 smoothly-transaction"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ViewUserDataModal
