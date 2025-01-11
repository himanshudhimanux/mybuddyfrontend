import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { fetchClassSessions, deleteClassSession } from "../../redux/features/classSession/classSessionSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ClassSessionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessions, loading, error } = useSelector((state) => state.classSession);

  // Fetch sessions on component mount
  useEffect(() => {
    dispatch(fetchClassSessions({ page: 1, limit: 10 }))
      .unwrap()
      .catch(() => {
        toast.error("Failed to fetch class sessions.");
      });
  }, [dispatch]);

  // Edit handler
  const handleEdit = (id) => {
    navigate(`/class-session/update/${id}`);
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      dispatch(deleteClassSession(id))
        .unwrap()
        .then(() => toast.success("Session deleted successfully!"))
        .catch(() => toast.error("Failed to delete session."));
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      name: "Batch Name",
      selector: (row) => row.batchName, // Ensure batchName is part of the data from the API
      sortable: true,
    },
    {
      name: "Batch Date",
      selector: (row) => row.batchDate,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Session Type",
      selector: (row) => row.sessionType,
      sortable: true,
    },
    {
      name: "Session Mode",
      selector: (row) => row.sessionMode,
      sortable: true,
    },
    {
      name: "Start Time",
      selector: (row) => row.batchStartTime,
      sortable: true,
    },
    {
      name: "End Time",
      selector: (row) => row.batchEndTime,
      sortable: true,
    },
    {
      name: "Absent Notification",
      selector: (row) => (row.absenteesNotification ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Present Notification",
      selector: (row) => (row.presentNotification ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(row._id)}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Class Sessions List</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/class-session/add" className="dark-btn">
            Add Class Session
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6">
        <DataTable
          columns={columns}
          data={sessions || []} // Handle empty sessions gracefully
          progressPending={loading}
          pagination
          noDataComponent="No class sessions found"
          highlightOnHover
          striped
        />
      </div>
    </>
  );
};

export default ClassSessionList;
