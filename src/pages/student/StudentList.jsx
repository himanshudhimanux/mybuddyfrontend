import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchStudents } from "../../redux/features/student/studentSlice";
import { saveAs } from "file-saver";
import {Link} from 'react-router-dom'
import { FiSearch } from "react-icons/fi";

const StudentList = () => {
  const dispatch = useDispatch();
  const { data, totalPages, currentPage, status } = useSelector((state) => state.students);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({});

  // Fetch students when page or search changes
  useEffect(() => {
    dispatch(fetchStudents({ page, limit: 10, search, filter }));
  }, [dispatch, page, search, filter]);

  // Export CSV
  const exportCSV = () => {
    const csvData = data.map(({ _id, ...rest }) => rest); // Remove _id for cleaner export
    const csvString = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    saveAs(blob, "students.csv");
  };

  const columns = [
    { name: "Registration No.", selector: (row) => row.registrationNumber, sortable: true },
    {
      name: 'Photo',
      selector: (row) => (
          <img src={row.photo} alt={row.name} width={40} height={40} style={{ borderRadius: '50%' }} />
      ),
  },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Father Name", selector: (row) => row.fatherName, sortable: true },
    { name: "Mother Name", selector: (row) => row.motherName, sortable: true },
    { name: "Date of Birth", selector: (row) => row.dob, sortable: true },
    { name: "Gender", selector: (row) => row.gender, sortable: true },
    { name: "Phone", selector: (row) => row.fatherPhone },
  ];

  return (
    <>
      <div
        className="flex flex-wrap gap-10 justify-between items-center py-3.5 pl-4 text-center bg-white"
      >
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl">Students</h1>
        </div>
        <div
          className="flex gap-4 items-center self-stretch my-auto text-sm font-semibold w-[235px]"
        >
          <button className="btn" onClick={exportCSV}>Export CSV</button>
          <Link to="/students/add"
            className="dark-btn"
          >
           Add Student
          </Link>
        </div>
      </div>
      <div className="input-container">
        <FiSearch />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="studentSearch"
          placeholder="Search for a student by name or email"
          className="input-max"
        />
        
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        pagination
        paginationServer
        paginationTotalRows={totalPages * 10}
        onChangePage={(page) => setPage(page)}
        progressPending={status === "loading"}
      />
    </>
  );
};

export default StudentList;
