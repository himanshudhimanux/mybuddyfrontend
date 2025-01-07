import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { createBatchStudent } from "../../redux/features/batchStudent/batchStudentSlice";
import api from "../../utils/api";

const AddBatchStudent = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentRollNo: "",
    batchId: "",
    status: "Attending",
  });
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  const dispatch = useDispatch();

  // Fetch students and batches
    // Fetch Students
    const fetchStudents = async () => {
      try {
          const response = await api.get("/students");
          setStudents(response.data.students || []);
      } catch (error) {
          console.error("Error fetching students:", error);
          toast.error("Failed to load students");
      }
  };

  // Fetch Batches
  const fetchBatches = async () => {
      try {
          const response = await api.get("/batches");
          setBatches(response.data.data || []);
      } catch (error) {
          console.error("Error fetching batches:", error);
          toast.error("Failed to load batches");
      }
  };

  useEffect(() => {
      fetchStudents();
      fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBatchStudent(formData)).unwrap();
      toast.success("Batch Student added successfully!");
      setFormData({ studentId: "", studentRollNo: "", batchId: "", status: "Attending" });
    } catch (error) {
      toast.error(error.message || "Failed to add Batch Student");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-sm bg-white">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Add Batch Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Student</label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          >
            <option value="">-- Select Student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Roll Number</label>
          <input
            type="text"
            name="studentRollNo"
            value={formData.studentRollNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Select Batch</label>
          <select
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          >
            <option value="">-- Select Batch --</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="Attending">Attending</option>
            <option value="Absconding">Absconding</option>
            <option value="Left">Left</option>
            <option value="Shifted">Shifted</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddBatchStudent;
