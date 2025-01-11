import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { fetchBatches, deleteBatch } from '../../redux/features/batch/batchSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const BatchList = () => {
  const dispatch = useDispatch();
  const { batches, loading, error } = useSelector((state) => state.batches);

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteBatch(id));
    toast.success('Batch deleted successfully');
  };

  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Session Year', selector: (row) => row.sessionYearId?.yearName, sortable: true },
    { name: 'Location', selector: (row) => row.locationId.map((loc) => loc.name).join(', '), sortable: true },
    { name: 'Courses', selector: (row) => row.courseIds.map((course) => course.name).join(', ') },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <>

      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 pl-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-xl font-bold mb-5">Batchs List</h2>
        </div>
        <div className="flex gap-4 items-center self-stretch my-auto text-sm font-semibold w-[235px]">

          <Link to="/batch/add" className="dark-btn">
            Add New Batch
          </Link>
        </div>
      </div>

      <div className="p-5">

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DataTable
            columns={columns}
            data={batches}
            pagination
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search..."
                className="border p-2 rounded w-full max-w-xs"
              />
            }
          />
        )}
      </div>

    </>
  );
};

export default BatchList;
