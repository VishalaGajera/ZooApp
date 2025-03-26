import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiSearch } from 'react-icons/fi';
import CompPagination from './CompPagination';
import DeleteModal from '../modal/DeleteModal';
import ViewAdoptionDataModal from '../modal/ViewAdoptionDataModal';
import { useQuery } from '@tanstack/react-query';

const AdoptionList = () => {
    const currency=import.meta.env.VITE_CURRENCY
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isView, setIsView] = useState(false);
    const [adoptionData, setAdoptionData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const url = import.meta.env.VITE_API_URL;

    const { data, isFetching, error, refetch } = useQuery({
        queryKey: ['fetchAdoption'],
        queryFn: async () => {
            const response = await fetch(`${url}/adoption/get`);
            if (!response.ok) {
                console.log('Failed to fetch adoption data');
                return { data: [] };
            }
            return response.json();
        }
    });

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = data?.data ? Math.ceil(data?.data.length / itemsPerPage) : 0;

    const getCurrentAdoptions = () => {
        if (!data?.data || data?.data.length === 0) return [];

        const filteredAdoptions = data?.data.filter((adoption) => {
            return (
                adoption?.userId?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                adoption?.userId?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                adoption?.animal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                adoption?.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
                adoption?.cost.toString().includes(searchQuery) ||
                adoption?.period.toString().includes(searchQuery)
            )
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAdoptions.slice(startIndex, endIndex);
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
    };

    const handleViewModalClose = () => {
        setIsView(false);
        setAdoptionData({});
    };

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error : {error.message}</div>;
    }

    return (
        <div className='flex flex-col p-5 gap-5'>
            <section className='flex justify-between gap-2 items-center sm:flex-row flex-col'>
                <h1 className='text-2xl font-bold'>Adoptions</h1>
                <ul className='flex text-sm gap-3 items-center'>
                    <li><Link to={'/'} className='hover:text-blue smoothly-transaction'>Dashboard</Link></li>
                    <li><span><FaAngleRight /></span></li>
                    <li className='text-secondary_2'>Adoptions</li>
                </ul>
            </section>
            <section>
                <div className='flex flex-col bg-white h-full p-5 rounded-xl shadow-custom w-full gap-5 overflow-x-auto scrollbar-hide'>
                    {!data?.data ? (
                        <div className="text-center">
                            <p>No adoption data available</p>
                        </div>
                    ) : (
                        <>
                            <div className='flex justify-between gap-5 items-center'>
                                <div className='border rounded-lg w-full gap-3 items-center flex max-w-[500px] px-5 py-3'>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        placeholder="Search here..."
                                        className='bg-transparent w-full outline-none'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <span><FiSearch className='text-xl' /></span>
                                </div>
                            </div>
                            <table className='h-full rounded-xl w-full min-w-max overflow-hidden' style={{ borderSpacing: '10px 10px' }}>
                                <thead>
                                    <tr className="table-row bg-rowColor text-left">
                                        <th className='rounded-bl-2xl overflow-hidden px-2 py-3'>Index</th>
                                        <th className='px-2 py-3'>Donor Name</th>
                                        <th className='px-2 py-3'>Animal Name</th>
                                        <th className='px-2 py-3'>Period</th>
                                        <th className='px-2 py-3'>Frequency</th>
                                        <th className='px-2 py-3'>Cost</th>
                                        <th className='rounded-br-2xl overflow-hidden px-2 py-3'>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='border-t-[10px] border-white'>
                                    {getCurrentAdoptions().map((adoption, index) => (
                                        <tr key={index} className={`overflow-hidden ${index % 2 === 0 ? 'bg-rowColor rounded-xl' : ''}`}>
                                            <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="p-3">{adoption.userId.first_name}&nbsp;&nbsp;{adoption.userId.last_name}</td>
                                            <td className="p-3">{adoption.animal_name}</td>
                                            <td className="p-3">{adoption.period}</td>
                                            <td className="p-3">{adoption.frequency}</td>
                                            <td className="p-3">{currency}{adoption.cost}</td>
                                            <td className='p-3'>
                                                <div className="flex text-xl gap-5 items-center">
                                                    <Link className='text-blue' onClick={() => { setIsView(true); setAdoptionData(adoption); }}><FaRegEye /></Link>
                                                    <Link className='text-red-600' onClick={() => { setIsDelete(true); setDeleteId(adoption._id); }}><RiDeleteBin6Line /></Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='bg-rowColor h-0.5 w-full mt-4'></div>
                            <div className='flex justify-between p-2 gap-3 items-center md:flex-row flex-col'>
                                <h1 className='text-secondary_2 text-sm'>Showing {Math.min(itemsPerPage, data?.data.length - (currentPage - 1) * itemsPerPage)} entries</h1>
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
            {isDelete && <DeleteModal onClose={handleDeleteModalClose} tableName="adoption" id={deleteId} />}
            {isView && <ViewAdoptionDataModal onClose={handleViewModalClose} data={adoptionData} />}
        </div>
    );
};

export default AdoptionList;
