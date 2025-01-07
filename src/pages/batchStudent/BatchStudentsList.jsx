import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchBatchStudents } from "../../redux/features/batchStudent/batchStudentSlice";
import toast, { Toaster } from "react-hot-toast";

const BatchStudentsList = () => {
  const dispatch = useDispatch();
  const { batchStudents, loading, error } = useSelector((state) => state.batchStudent);

  useEffect(() => {
    dispatch(fetchBatchStudents());
    if (error) toast.error(error);
  }, [dispatch, error]);

  const columns = [
    { name: "Student Name", selector: (row) => row.studentId.name, sortable: true },
    { name: "Roll No.", selector: (row) => row.studentRollNo, sortable: true },
    { name: "Batch Name", selector: (row) => row.batchId.name, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Batch Student List</h2>
      <div className="shadow-sm border rounded-lg bg-white">
        <DataTable
          columns={columns}
          data={batchStudents}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default BatchStudentsList;
