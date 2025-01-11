import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionYears, deleteSessionYear } from "../../redux/features/sessionYear/sessionYearSlice";
import { toast } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

const SessionYearsList = () => {
  const dispatch = useDispatch();
  const { sessionYears, loading, error } = useSelector((state) => state.sessionYears);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchSessionYears());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this session year?")) {
      dispatch(deleteSessionYear(id))
        .unwrap()
        .then(() => toast.success("Session year deleted successfully"))
        .catch((err) => toast.error(err.message || "Failed to delete session year"));
    }
  };

  const columns = [
    {
      name: "Year Name",
      selector: (row) => row.yearName,
      sortable: true,
    },
    {
      name: "Default Year",
      selector: (row) => (row.defaultYear ? "Yes" : "No"),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="text-blue-500"
            onClick={() => console.log("Edit functionality")} // Add edit functionality
          >
            Edit
          </button>
          <button
            className="text-red-500"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (

    <>
      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Session Years List</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/session-year/add" className="dark-btn">
            Add Session Year
          </Link>
        </div>
      </div>

      <div className="p-4">
        {loading && <p>Loading...</p>}
        {error && <h4 className="text-red-600">{error?.message || "An error occurred"}</h4>
        }

        <input
          type="text"
          className="border p-2 mb-4"
          placeholder="Search session year"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={sessionYears.filter((year) => year.yearName.toLowerCase().includes(searchText.toLowerCase()))}
          pagination
          highlightOnHover
        />
      </div>

    </>


  );
};

export default SessionYearsList;
