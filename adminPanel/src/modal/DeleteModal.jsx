import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';

const DeleteModal = ({ onClose, tableName, id }) => {
  const url = import.meta.env.VITE_API_URL;
  const deleteRecord = async () => {
    const response = await fetch(`${url}/${tableName}/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.log(`Failed to delete ${tableName} Data`)
    }
    return response.json();
  }

  const mutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: (data) => {
      toast.success(data.message);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  if (mutation.isError) {
    toast.error(mutation.error.message);
  }

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <div
      id="deleteModal"
      className="fixed top-0 right-0 z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-start h-full"
    >
      <div className="relative bg-white p-10 rounded-lg w-96 flex flex-col gap-5 mt-10">
        <span className='absolute top-3 right-3 text-lg bg-gray-200 rounded-full p-3 hover:rotate-90 smoothly-transaction cursor-pointer hover:text-blue' onClick={onClose}><RxCross1 /></span>
        <div className="text-center">
          <h4 className="text-2xl font-semibold text-blue">Delete Record?</h4>
        </div>
        <div className="text-center">
          <p className="text-secondary text-sm">
            Are you sure that you want to permanently delete the selected record?
          </p>
        </div>
        <div className="flex justify-center items-center gap-5">
          <button
            type="button"
            className="rounded-md bg-gray-400 text-white w-full p-3 font-semibold hover:bg-gray-500 smoothly-transaction"
            onClick={onClose}
          >
            No
          </button>
          <button
            type="button"
            className="rounded-md w-full p-3 font-semibold bg-blue text-white smoothly-transaction"
            onClick={handleDelete}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Deleting...' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
