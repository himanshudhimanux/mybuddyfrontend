import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSessionYear } from "../../redux/features/sessionYear/sessionYearSlice";
import { toast } from "react-hot-toast";

const AddSessionYear = () => {
  const dispatch = useDispatch();
  const [yearName, setYearName] = useState("");
  const [defaultYear, setDefaultYear] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!yearName) {
      toast.error("Year name is required");
      return;
    }

    const newSessionYear = {
      yearName,
      defaultYear,
    };

    dispatch(createSessionYear(newSessionYear))
      .unwrap()
      .then(() => {
        toast.success("Session year created successfully");
        setYearName("");
        setDefaultYear(false);
      })
      .catch((err) => toast.error(err.message || "Failed to create session year"));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Session Year</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Year Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Enter year name"
            value={yearName}
            onChange={(e) => setYearName(e.target.value)}
          />
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={defaultYear}
              onChange={() => setDefaultYear(!defaultYear)}
              className="mr-2"
            />
            Default Year
          </label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddSessionYear;
