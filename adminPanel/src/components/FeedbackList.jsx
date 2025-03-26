import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { LuPencilLine, LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiSearch } from 'react-icons/fi';
import CompPagination from './CompPagination';
import { TbStar, TbStarFilled } from 'react-icons/tb';
import DeleteModal from '../modal/DeleteModal';
import AddEditFeedbackModal from '../modal/AddEditFeedback';
import ViewFeedbackDataModal from '../modal/ViewFeedbackDataModal';
import { useQuery } from '@tanstack/react-query';

const FeedbackList = () => {
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isView, setIsView] = useState(false);
    const [isAddEdit, setIsAddEdit] = useState(false);
    const [feedbackData, setFeedbackData] = useState({});
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const url = import.meta.env.VITE_API_URL;

    const { data, isFetching, error, refetch } = useQuery({
        queryKey: ['fetchFeedback'],
        queryFn: async () => {
            const response = await fetch(`${url}/feedback/get`);
            if (!response.ok) {
                console.log('Failed to fetch feedback data');
                return { data: [] };
            }
            return response.json();
        }
    });
    
    
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPages = data?.data ? Math.ceil(data?.data.length / itemsPerPage) : 0;
    
    const getCurrentFeedback = () => {
        if (!data?.data || data?.data.length === 0) return [];
        
        console.log(data)
        const filteredFeedbacks = data?.data
            .filter(feedback =>
                filter === '' || feedback.approved.toString() === filter
            )
            .filter(feedback =>
                feedback.userId.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.userId.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredFeedbacks.slice(startIndex, endIndex);
    };

    const generatePageNumbers = () => {
        const pageRange = 1;
        let pageNumbers = [];

        if (currentPage - pageRange > 1) pageNumbers.push(1);
        if (currentPage - pageRange > 2) pageNumbers.push('...');

        for (let i = currentPage - pageRange; i <= currentPage + pageRange; i++) {
            if (i > 0 && i <= totalPages) {
                pageNumbers.push(i);
            }
        }

        if (currentPage + pageRange < totalPages - 1) pageNumbers.push('...');

        if (currentPage + pageRange < totalPages) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    const paginate = (pageNumber) => {
        if (pageNumber === '...') return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteModalClose = () => {
        setIsDelete(false);
        refetch();
    }

    const handleViewModalClose = () => {
        setIsView(false);
        setFeedbackData({});
    }

    const handleAddEditModalClose = () => {
        setIsAddEdit(false);
        setFeedbackData({});
        refetch();
    }

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col p-5 gap-5">
            <section className="flex justify-between gap-2 items-center sm:flex-row flex-col">
                <h1 className="text-2xl font-bold">Feedbacks</h1>
                <ul className="flex text-sm gap-3 items-center">
                    <li><Link to={'/'} className="hover:text-blue smoothly-transaction">Dashboard</Link></li>
                    <li><span><FaAngleRight /></span></li>
                    <li className="text-secondary_2">Feedbacks</li>
                </ul>
            </section>
            <section>
                <div className="flex flex-col bg-white justify-center p-5 rounded-xl shadow-custom gap-5 items-center">
                    {!data?.data ? (
                        <div className="text-center">
                            <p>No feedback data available</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between w-full gap-5 items-center">
                                <div className="flex w-full gap-5 md:items-center sm:flex-row flex-col">
                                    <div className="border rounded-lg w-full gap-3 items-center flex max-w-[500px] px-5 py-3">
                                        <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            placeholder="Search here..."
                                            className="bg-transparent w-full outline-none"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <span><FiSearch className="text-xl" /></span>
                                    </div>
                                    <div className="border h-12 rounded-lg px-3 w-fit">
                                        <select
                                            name="approvedFilter"
                                            id="approvedFilter"
                                            className="bg-transparent h-full w-32 outline-none"
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                        >
                                            <option value="">All</option>
                                            <option value="1">Approved</option>
                                            <option value="0">Unapproved</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full overflow-x-auto scrollbar-hide'>
                                <table className="table-auto rounded-xl w-full min-w-[600px]">
                                    <thead>
                                        <tr className="table-row bg-rowColor text-left">
                                            <th className="rounded-bl-2xl overflow-hidden px-2 py-3">Index</th>
                                            <th className="px-2 py-3 whitespace-nowrap">Donor Name</th>
                                            <th className="px-2 py-3">Rating</th>
                                            <th className="px-2 py-3">Comments</th>
                                            <th className="px-2 py-3">Approved</th>
                                            <th className="rounded-br-2xl overflow-hidden px-2 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-t-[10px] border-white">
                                        {getCurrentFeedback().map((feedback, index) => (
                                            <tr key={index} className={`overflow-hidden ${index % 2 === 0 ? 'bg-rowColor rounded-xl' : ''}`}>
                                                <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="p-3 whitespace-nowrap">{feedback.userId.first_name} {feedback.userId.last_name}</td>
                                                <td className="p-3">
                                                    <span className="flex text-primary gap-1 items-center">
                                                        {[...Array(5)].map((_, index) =>
                                                            index < feedback.rating ? <TbStarFilled key={index} /> : <TbStar key={index} />
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-3">{feedback.comment && feedback.comment.length > 50 ? feedback.comment.slice(0, 40) + '...' : feedback.comment}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`border text-xs py-0.5 px-2 rounded-md ${feedback.approved === 0
                                                            ? 'border-red-600 text-red-600 bg-red-100'
                                                            : 'border-success text-success bg-green-100'
                                                            }`}
                                                    >
                                                        {feedback.approved === 0 ? "Unapproved" : "Approved"}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex text-xl gap-5 items-center">
                                                        <Link className="text-blue" onClick={() => { setIsView(true); setFeedbackData(feedback); }}><FaRegEye /></Link>
                                                        <Link className="text-success" onClick={() => { setIsAddEdit(true); setFeedbackData(feedback); }}><LuPencilLine /></Link>
                                                        <Link className="text-red-600" onClick={() => { setIsDelete(true); setDeleteId(feedback._id); }}><RiDeleteBin6Line /></Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-rowColor h-0.5 w-full mt-4"></div>
                            <div className="flex justify-between p-2 w-full gap-3 items-center md:flex-row flex-col">
                                <h1 className="text-secondary_2 text-sm">
                                    Showing {Math.min(itemsPerPage, data?.data.length - (currentPage - 1) * itemsPerPage)} entries
                                </h1>
                                <CompPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    paginate={paginate}
                                    generatePageNumbers={generatePageNumbers}
                                />
                            </div>
                        </>
                    )}
                </div>
            </section>
            {isDelete && <DeleteModal onClose={handleDeleteModalClose} tableName="feedback" id={deleteId} />}
            {isView && <ViewFeedbackDataModal onClose={handleViewModalClose} data={feedbackData} />}
            {isAddEdit && <AddEditFeedbackModal onClose={handleAddEditModalClose} data={feedbackData} />}
        </div>
    );
};

export default FeedbackList;
