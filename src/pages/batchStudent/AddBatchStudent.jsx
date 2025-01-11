import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createBatchStudent } from "../../redux/features/batchStudent/batchStudentSlice";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const AddBatchStudent = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentRollNo: "",
    batchId: "",
    status: "Attending",
    joiningDate: "",
    payableFees: "",
    discountComment: "",
    installmentType: "",
  });
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [batches, setBatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch();

  // Fetch Batches
  const fetchBatches = async () => {
    try {
      const response = await api.get("/batches");
  
      // Debugging: Log response to ensure correct structure
      console.log("Batches API Response:", response);
  
      // Update batches state with the response data array
      if (Array.isArray(response.data)) {
        setBatches(response.data);
      } else {
        console.error("Unexpected API response format:", response);
        toast.error("Failed to load batches: Unexpected API response.");
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to load batches");
    }
  };
  
  

  // Fetch Students by Search Query
  const fetchStudentsByName = async (query) => {
    if (!query) {
      setStudents([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await api.get(`/students?name=${query}`); // Adjust API to support searching
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error searching students:", error);
      toast.error("Failed to search students");
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedFetchStudentsByName = debounce(fetchStudentsByName, 300);

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchStudentsByName(query);
  };

  const handleStudentSelect = (student) => {
    setFormData({ ...formData, studentId: student._id });
    setSearchQuery(student.name); // Show selected student name in the input
    setStudents([]); // Clear dropdown after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitting Payload:", formData); // Debugging the form data
  
    try {
      await dispatch(createBatchStudent(formData)).unwrap();
      toast.success("Batch Student added successfully!");
      setFormData({
        studentId: "",
        studentRollNo: "",
        batchId: "",
        status: "Attending",
        joiningDate: "",
        payableFees: "",
        discountComment: "",
        installmentType: "",
      });
    } catch (error) {
      console.error("Error creating batch student:", error); // Log error details
      toast.error(error.message || "Failed to add Batch Student");
    }
  };
  

  return (
    <>
      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Add Student Batch</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/batch-students/list" className="dark-btn">
            Batch Students List
          </Link>
        </div>
      </div>

      <div className="max-w-full mx-auto p-4 border rounded-lg shadow-sm bg-white">
        <form onSubmit={handleSubmit} className="space-y-4 p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Search and Select Student */}
            <div>
              <label className="block text-sm font-medium">Search Student</label>
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
              {isSearching && <p>Loading...</p>}
              {students.length > 0 && (
                <ul className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                  {students.map((student) => (
                    <li
                      key={student._id}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleStudentSelect(student)}
                    >
                      {student.name} ({student.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Select Batch */}
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

            {/* Status */}
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

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Payable Fees */}
            <div>
              <label className="block text-sm font-medium">Payable Fees</label>
              <input
                type="number"
                name="payableFees"
                value={formData.payableFees}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Discount Comment */}
            <div>
              <label className="block text-sm font-medium">Discount Comment</label>
              <input
                type="text"
                name="discountComment"
                value={formData.discountComment}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            {/* Installment Type */}
            <div>
              <label className="block text-sm font-medium">Installment Type</label>
              <select
                name="installmentType"
                value={formData.installmentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option value="">-- Select Plan --</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="One-Time">One-Time</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBatchStudent;

// Helper function: Debounce
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
