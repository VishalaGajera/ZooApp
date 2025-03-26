import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { LuPencilLine, LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiSearch } from 'react-icons/fi';
import CompPagination from './CompPagination';
import DeleteModal from '../modal/DeleteModal';
import AddEditUserModal from '../modal/AddEditUserModal';
import ViewUserDataModal from '../modal/ViewUserDataModal';
import { useQuery } from '@tanstack/react-query';

const UserList = () => {
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isView, setIsView] = useState(false);
    const [isAddEdit, setIsAddEdit] = useState(false);
    const [userData, setUserData] = useState({});
    const [action, setAction] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const url = import.meta.env.VITE_API_URL;

    const { data, isFetching, error, refetch } = useQuery({
        queryKey: ['fetchUser'],
        queryFn: async () => {
            const response = await fetch(`${url}/user/get`);
            if (!response.ok) {
                console, log('Failed to fetch user data');
                return { data: [] };
            }
            return response.json();
        }
    })


    const totalPages = data?.data ? Math.ceil(data?.data.length / itemsPerPage) : 0;

    const getCurrentUsers = () => {
        if (!data?.data || data?.data.length === 0) return [];

        const filteredUsers = data?.data.filter(user => {
            return (
                user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm)
            );
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
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
        setUserData({});
    };

    const handleAddEditModalClose = () => {
        setIsAddEdit(false);
        setUserData({});
        setAction('');
        refetch();
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
                <h1 className='text-2xl font-bold'>Users</h1>
                <ul className='flex text-sm gap-3 items-center'>
                    <li><Link to={'/'} className='hover:text-blue smoothly-transaction'>Dashboard</Link></li>
                    <li><span><FaAngleRight /></span></li>
                    <li className='text-secondary_2'>Users</li>
                </ul>
            </section>
            <section>
                <div className='flex flex-col bg-white h-full p-5 rounded-xl shadow-custom w-full gap-5 overflow-x-auto scrollbar-hide'>
                    {!data?.data ? (
                        <div className="text-center">
                            <p>No user data available</p>
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <span><FiSearch className='text-xl' /></span>
                                </div>
                                <div>
                                    <button className='flex border border-blue justify-center p-3 rounded-xl text-blue md:w-48 min-w-max font-semibold gap-2 hover:bg-blue hover:text-white items-center smoothly-transaction' onClick={() => { setIsAddEdit(true); setAction('add'); }}>
                                        <span><LuPlus className='text-xl' /></span>
                                        <span className='md:flex hidden'>Add New</span>
                                    </button>
                                </div>
                            </div>
                            <table className='h-full rounded-xl w-full min-w-max overflow-hidden' style={{ borderSpacing: '10px 10px' }}>
                                <thead>
                                    <tr className="table-row bg-rowColor text-left">
                                        <th className='rounded-bl-2xl overflow-hidden px-2 py-3'>index</th>
                                        <th className='px-2 py-3'>Name</th>
                                        <th className='px-2 py-3'>Email Id</th>
                                        <th className='px-2 py-3'>Phone</th>
                                        <th className='rounded-br-2xl overflow-hidden px-2 py-3'>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='border-t-[10px] border-white'>
                                    {getCurrentUsers().map((user, index) => (
                                        <tr key={index} className={`overflow-hidden ${index % 2 === 0 ? 'bg-rowColor rounded-xl' : ''}`}>
                                            <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="p-3">{user.first_name}&nbsp;&nbsp;{user.last_name}</td>
                                            <td className="p-3">{user.email_id}</td>
                                            <td className="p-3">{user.mobile}</td>
                                            <td className='p-3'>
                                                <div className="flex text-xl gap-5 items-center">
                                                    <Link className='text-blue' onClick={() => { setIsView(true); setUserData(user); }}><FaRegEye /></Link>
                                                    <Link className='text-green-600' onClick={() => { setIsAddEdit(true); setUserData(user); setAction('edit'); }}><LuPencilLine /></Link>
                                                    <Link className='text-red-600' onClick={() => { setIsDelete(true); setDeleteId(user._id); }}><RiDeleteBin6Line /></Link>
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
            {isDelete && <DeleteModal onClose={handleDeleteModalClose} tableName="user" id={deleteId} />}
            {isView && <ViewUserDataModal onClose={handleViewModalClose} data={userData} />}
            {isAddEdit && <AddEditUserModal onClose={handleAddEditModalClose} action={action} data={userData} />}
        </div>
    )
}

export default UserList;
