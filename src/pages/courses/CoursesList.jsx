import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../redux/features/course/courseSlice';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const CoursesList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  const [filterText, setFilterText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses) {
      setFilteredCourses(
        courses.filter((course) =>
          course.name.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
  }, [filterText, courses]);

  const columns = [
    {
      name: 'Course Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Course Type',
      selector: (row) => row.courseType,
      sortable: true,
    },
    {
      name: 'Subjects',
      selector: (row) =>
        row.subjectIds && row.subjectIds.length > 0
          ? row.subjectIds.map((sub) => sub.name).join(', ')
          : 'N/A',
    },
  ];
  

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error.message || 'Something went wrong!'}</p>;


  return (

    <>

<div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
    <div className="self-stretch my-auto text-base font-medium text-neutral-600">
      <h1 className="text-2xl">Courses List</h1>
    </div>
    <div className="flex gap-4 items-end  my-auto text-sm font-semibold ">
      <Link to="/course/add" className="dark-btn">
        Add Course
      </Link>
    </div>
  </div>

    <div className="container mx-auto">

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by course name..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCourses}
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

export default CoursesList;
