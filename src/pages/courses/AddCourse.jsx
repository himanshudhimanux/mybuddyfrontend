import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../redux/features/course/courseSlice';
import { fetchSubjects } from '../../redux/features/subject/subjectSlice'; // Add the fetchSubjects import
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AddCourse = () => {
  const dispatch = useDispatch();

  // Fetch subjects from Redux store
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSelector((state) => state.subjects);
  
  // Initialize course form state
  const [formData, setFormData] = useState({
    name: '',
    courseType: 'online',
    subjectIds: [],
  });

  useEffect(() => {
    if (!subjects || subjects.length === 0) {
      dispatch(fetchSubjects()); // Dispatch the fetchSubjects action if subjects are not available
    }
  }, [dispatch, subjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id)
        ? prev.subjectIds.filter((subId) => subId !== id)
        : [...prev.subjectIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createCourse(formData)).unwrap();
      toast.success('Course created successfully!');
      setFormData({ name: '', courseType: 'online', subjectIds: [] });
    } catch (error) {
      toast.error(error?.message || 'Failed to create course. Please try again.');
    }
  };

  // Handle loading or error while fetching subjects
  if (subjectsLoading) {
    return <div>Loading subjects...</div>;
  }

  if (subjectsError) {
    return <div>Error loading subjects: {subjectsError}</div>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl">Add New Course</h1>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/courses/list" className="dark-btn">
            Courses List
          </Link>
        </div>
      </div>

      <hr />

      <form
        onSubmit={handleSubmit}
        className="container mx-auto flex flex-col items-center px-20 py-custom bg-white max-w-full max-md:px-5 max-md:pt-24"
      >
        <div className="mb-4 mb-4 flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Course Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4 mb-4 flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <label className="block text-sm font-bold mb-2">Course Type</label>
          <select
            name="courseType"
            value={formData.courseType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="mb-4 mb-4 flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <label className="block text-sm font-bold mb-2">Subjects</label>
          {subjects && subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject._id}>
                <input
                  type="checkbox"
                  id={subject._id}
                  checked={formData.subjectIds.includes(subject._id)}
                  onChange={() => handleCheckboxChange(subject._id)}
                />
                <label htmlFor={subject._id} className="ml-2">
                  {subject.name}
                </label>
              </div>
            ))
          ) : (
            <p>No subjects available</p>
          )}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Course
        </button>
      </form>
    </>
  );
};

export default AddCourse;
