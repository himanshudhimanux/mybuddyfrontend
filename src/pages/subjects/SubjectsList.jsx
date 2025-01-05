import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubjects } from '../../redux/features/subject/subjectSlice';
import DataTable from 'react-data-table-component';
import {Link} from 'react-router-dom'

const SubjectsList = () => {
  const dispatch = useDispatch();
  const { subjects, loading, error } = useSelector((state) => state.subjects);

  const [filterText, setFilterText] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (subjects) {
      setFilteredSubjects(
        subjects.filter((subject) =>
          subject.name.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
  }, [filterText, subjects]);

  const columns = [
    {
      name: 'Subject Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Subject Type',
      selector: (row) => row.subjecttype,
      sortable: true,
    },
    {
      name: 'Faculty/Teachers',
      selector: (row) =>
        row.FacultyId.map((faculty) => faculty.name).join(', ') || 'N/A',
    },
  ];

  if (loading) return <h1 className="text-center">Loading...</h1>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
<>
    <div
    className="flex flex-wrap mb-3 gap-10 justify-between items-center py-3.5 pl-4 text-center bg-white"
  >
    <div className="self-stretch my-auto text-base font-medium text-neutral-600">
      <h1 className="text-2xl">Subjects</h1>
    </div>
    <div
      className="flex gap-4 items-end self-stretch text-sm font-semibold w-[235px]"
    >
      
      <Link to="/subject/add"
        className="dark-btn"
      >
       Add Subject
      </Link>
    </div>
  </div>

    <div className="container mx-auto">

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredSubjects}
        pagination
        highlightOnHover
        responsive
        defaultSortField="name"
        className="border rounded"
      />
    </div>

    </>
  );
};

export default SubjectsList;
