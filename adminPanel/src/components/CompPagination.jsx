import React from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const CompPagination = ({ currentPage, totalPages, paginate, generatePageNumbers }) => {
    return (
        <div className="pagination-controls flex justify-center gap-2 flex-wrap">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 border rounded-full hover:bg-blue hover:text-white cursor-pointer smoothly-transaction flex items-center justify-center"
            >
                <BsChevronLeft />
            </button>

            {generatePageNumbers().map((number, index) => (
                <button
                    key={index}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 font-semibold rounded-full hover:bg-blue hover:text-white smoothly-transaction flex items-center justify-center ${number === currentPage ? 'bg-blue text-white' : 'bg-transparent'}`}
                    disabled={number === '...'}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 border rounded-full hover:bg-blue hover:text-white cursor-pointer smoothly-transaction flex items-center justify-center"
            >
                <BsChevronRight />
            </button>
        </div>
    );
};

export default CompPagination;
