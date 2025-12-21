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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-80 space-y-4"
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

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="text-gray-500">
            Cancel
          </button>

          <button type="submit" className="text-blue-600 font-medium">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
