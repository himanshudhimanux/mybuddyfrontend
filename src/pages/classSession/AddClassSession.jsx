import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createClassSession } from "../../redux/features/classSession/classSessionSlice"; // Update the path as necessary
import toast from "react-hot-toast";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const AddClassSession = () => {
  const dispatch = useDispatch();

  // State for form fields
  const [batches, setBatches] = useState([]); // List of batches
  const [formValues, setFormValues] = useState({
    batchId: "",
    batchDate: "",
    status: "active",
    sessionType: "Regular",
    sessionMode: "online",
    batchStartTiming: "",
    batchEndTiming: "",
    absenteesNotification: "no",
    presentNotification: "no",
  });

  // Fetch batches from API
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/batches"); // Replace with your API endpoint
        const data = await response.json();
        setBatches(data);
        console.log("Fetched batches:", data); // Debugging log
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast.error("Failed to fetch batches");
      }
    };

    fetchBatches();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValues.batchId) {
      toast.error("Please select a batch.");
      return;
    }
    console.log("Form values:", formValues); // Debugging log
    dispatch(createClassSession(formValues))
      .unwrap()
      .then(() => toast.success("Class session created successfully!"))
      .catch((error) => toast.error(`Error: ${error.message}`));
  };

  return (

<>
<div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-5">Add Class Session</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/class-sessions/list" className="dark-btn">
          Class Sessions List
          </Link>
        </div>
      </div>

      <div className="max-w-full mx-auto p-20 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit}>
        {/* Row 1: Batch ID, Batch Date, Status */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium mb-1">Batch</label>
            <select
              name="batchId"
              value={formValues.batchId}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            >
              <option value="">Select a batch</option>
              {batches?.length > 0 ? (
                batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading batches...</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batch Date</label>
            <input
              type="date"
              name="batchDate"
              value={formValues.batchDate}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formValues.status}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            >
              <option value="active">Active</option>
              <option value="holiday">Holiday</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Row 2: Session Type, Session Mode, Start Time */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium mb-1">Session Type</label>
            <select
              name="sessionType"
              value={formValues.sessionType}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            >
              <option value="Regular">Regular</option>
              <option value="Exam">Exam</option>
              <option value="Revision">Revision</option>
              <option value="Guest Lecture">Guest Lecture</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Session Mode</label>
            <select
              name="sessionMode"
              value={formValues.sessionMode}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batch Start Time</label>
            <input
              type="time"
              name="batchStartTiming"
              value={formValues.batchStartTiming}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Row 3: End Time, Absentees Notification, Present Notification */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium mb-1">Batch End Time</label>
            <input
              type="time"
              name="batchEndTiming"
              value={formValues.batchEndTiming}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Absentees Notification</label>
            <select
              name="absenteesNotification"
              value={formValues.absenteesNotification}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Present Notification</label>
            <select
              name="presentNotification"
              value={formValues.presentNotification}
              onChange={handleChange}
              className="w-full border-gray-300 addinput rounded-md shadow-sm"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Session
        </button>
      </form>
    </div>

</>


  );
};

export default AddClassSession;
