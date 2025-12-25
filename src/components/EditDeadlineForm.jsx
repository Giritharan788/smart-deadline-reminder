import { useState, useEffect } from "react";

export default function EditDeadlineForm({ deadline, onSave, onCancel }) {
  const [title, setTitle] = useState(deadline.title);
  const [description, setDescription] = useState(deadline.description);
  const [dueDate, setDueDate] = useState(deadline.dueDate);
  const [priority, setPriority] = useState(deadline.priority);

  //   useEffect(() => {
  //   setTitle(deadline.title);
  //   setSubject(deadline.subject);
  //   setDueDate(deadline.dueDate);
  //   setPriority(deadline.priority);
  // }, [deadline]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...deadline,
      title,
      description,
      dueDate,
      priority,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center
    transition-opacity duration-300 ease-out"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-80 space-y-4 transform transition-all duration-300 ease-out
  scale-95 opacity-0
  animate-[modalIn_0.3s_ease-out_forwards]
"
      >
        <h2 className="text-lg font-semibold">
          {deadline.id ? "Edit Deadline" : "Add Deadline"}
        </h2>

        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <div className="w-full">
          <input
            type="date"
            className="w-full border p-2 rounded text-gray-700"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {!dueDate && (
            <p className="text-xs text-gray-400 mt-1">Select due date</p>
          )}
        </div>

        <select
          className="w-full border p-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="" disabled>
            Select priority
          </option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="text-gray-500">
            Cancel
          </button>

          <button type="submit" className="text-blue-600 font-medium  transition-transform duration-200
    hover:scale-105 active:scale-95">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
