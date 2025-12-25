import { FiEdit, FiCheck, FiTrash2 } from "react-icons/fi";

function getPriorityStyles(priority) {
  if (priority === "High") {
    return "bg-red-100 text-red-600";
  }
  if (priority === "Medium") {
    return "bg-yellow-100 text-yellow-700";
  }
  return "bg-green-100 text-green-600";
}

function getReminderStyles(status) {
  if (status === "overdue") {
    return "border-red-500 bg-red-50";
  }
  if (status === "dueSoon") {
    return "border-yellow-500 bg-yellow-50";
  }
  return "border-green-500 bg-green-50";
}

function getDeadlineStatus(dueDate) {
  const today = new Date();
  const deadlineDate = new Date(dueDate);

  // Remove time part for accurate comparison
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffInTime = deadlineDate - today;
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

  if (diffInDays <= 0) {
    return { label: "Overdue", color: "text-red-600 bg-red-100" };
  }

  if (diffInDays <= 3) {
    return { label: "Due Soon", color: "text-yellow-700 bg-yellow-100" };
  }

  return { label: "Upcoming", color: "text-green-600 bg-green-100" };
}

function getReminderStatus(dueDate, completed) {
  if (completed) return "completed";

  const today = new Date();
  const deadlineDate = new Date(dueDate);

  // Remove time part for accurate comparison
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffInDays = (deadlineDate - today) / (1000 * 60 * 60 * 24);

  if (diffInDays <= 0) return "overdue";
  if (diffInDays <= 2) return "dueSoon";
  return "upcoming";
}

export default function DeadlineCard({
  title,
  description,
  dueDate,
  priority,
  completed,
  onDelete,
  onMarkDone,
  onEdit,
}) {
  const reminderStatus = getReminderStatus(dueDate, completed);

  const status = getDeadlineStatus(dueDate);

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-5 ${getReminderStyles(
        reminderStatus
      )} flex flex-col justify-between
    ${completed ? "opacity-60" : ""}
    transition-all duration-300 ease-in-out
    hover:scale-[1.02]
  `}
    >
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm pt-2 text-gray-500">{description}</p>
          </div>

          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${getPriorityStyles(
              priority
            )}`}
          >
            {priority}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-600">📅 Due: {dueDate}</div>
        <div className="mt-2.5">
          {reminderStatus === "completed" && (
            <p className="text-sm text-gray-500 font-medium mt-2">
              ✔ Completed
            </p>
          )}
          {reminderStatus === "overdue" && (
            <p className="text-sm text-red-600 font-medium mt-2">❗ Overdue</p>
          )}

          {reminderStatus === "dueSoon" && (
            <p className="text-sm text-yellow-700 font-medium mt-2">
              ⚠️ Due Soon
            </p>
          )}

          {reminderStatus === "upcoming" && (
            <p className="text-sm text-green-600 font-medium mt-2">
              ✅ Upcoming
            </p>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onEdit}
          disabled={completed}
          className={`transition-transform duration-200
          ${
            completed
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800 hover:scale-110"
          }`}
        >
          <FiEdit size={18} />
        </button>

        {!completed && (
          <button
            onClick={onMarkDone}
            className="text-green-600 hover:text-green-800 transition-transform duration-200 hover:scale-110"
          >
            <FiCheck size={18} />
          </button>
        )}

        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 transition-transform duration-200 hover:scale-110"
          title="Delete"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}
