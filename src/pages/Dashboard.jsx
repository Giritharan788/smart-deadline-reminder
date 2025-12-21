import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth } from "../firebase/firebase.js";
import { db } from "../firebase/firebase.js";
import { useEffect } from "react";
import { useState } from "react";
import DeadlineCard from "../components/DeadlineCard.jsx";
import EditDeadlineForm from "../components/EditDeadlineForm.jsx";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const priorityOrder = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export default function Dashboard({ onLogout }) {
  // ================= STATES =================

  const user = auth.currentUser;

  const [deadlines, setDeadlines] = useState([]);

  const [editingDeadline, setEditingDeadline] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingDeadlines, setLoadingDeadlines] = useState(true);

  // ================= HANDLERS =================
  const sortDeadlines = (deadlines) => {
    return [...deadlines].sort((a, b) => {
      // Convert dates to Date objects
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      // Remove time for accurate comparison
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);

      // 1️⃣ Sort by nearest due date
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // 2️⃣ If same due date → sort by priority
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "deadlines", id));

      setDeadlines((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting deadline:", error);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await updateDoc(doc(db, "users", user.uid, "deadlines", id), {
        completed: true,
      });

      setDeadlines((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: true } : item
        )
      );
    } catch (error) {
      console.error("Error marking done:", error);
    }
  };

  const handleEdit = (deadline) => {
    setEditingDeadline(deadline);
    setIsAdding(false);
  };

  const handleSaveEdit = async (updatedDeadline) => {
    try {
      const deadlineRef = doc(
        db,
        "users",
        user.uid,
        "deadlines",
        updatedDeadline.id
      );

      await updateDoc(deadlineRef, {
        title: updatedDeadline.title,
        description: updatedDeadline.description,
        dueDate: updatedDeadline.dueDate,
        priority: updatedDeadline.priority,
      });

      setDeadlines((prev) =>
        prev.map((item) =>
          item.id === updatedDeadline.id ? updatedDeadline : item
        )
      );

      setEditingDeadline(null);
    } catch (error) {
      console.error("Error updating deadline:", error);
    }
  };

  const handleCreateDeadline = async (newDeadline) => {
    try {
      const docRef = await addDoc(
        collection(db, "users", user.uid, "deadlines"),
        {
          ...newDeadline,
          completed: false,
          createdAt: new Date(),
          reminderSent: false,
        }
      );

      setDeadlines((prev) => [
        ...prev,
        {
          ...newDeadline,
          id: docRef.id,
          completed: false,
        },
      ]);

      setIsAdding(false);
    } catch (error) {
      console.error("Error adding deadline:", error);
    }
  };

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", user.uid, "deadlines")
        );

        const fetchedDeadlines = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDeadlines(fetchedDeadlines);
      } catch (error) {
        console.error("Error fetching deadlines:", error);
      } finally {
        setLoadingDeadlines(false);
      }
    };

    fetchDeadlines();
  }, []);

  // ================= UI =================

  if (loadingDeadlines) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading deadlines...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        {/* Header wrapper */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold">Deadline Reminder</h1>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingDeadline(null);
              }}
              className="
          bg-blue-600 text-white
          text-xs px-3 py-1.5
          sm:text-sm sm:px-4 sm:py-2
          rounded-lg hover:bg-blue-700
        "
            >
              + Add Deadline
            </button>

            <button
              onClick={onLogout}
              className="
          bg-red-500 text-white
          text-xs px-3 py-1.5
          sm:text-sm sm:px-4 sm:py-2
          rounded-lg hover:bg-red-600
        "
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Deadline Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortDeadlines(deadlines).map((item) => (
          <DeadlineCard
            key={item.id}
            {...item}
            onDelete={() => handleDelete(item.id)}
            onMarkDone={() => handleMarkDone(item.id)}
            onEdit={() => handleEdit(item)}
          />
        ))}
      </div>

      {/* Add / Edit Form */}
      {(editingDeadline || isAdding) && (
        <EditDeadlineForm
          deadline={
            editingDeadline || {
              title: "",
              description: "",
              dueDate: "",
              priority: "Medium",
            }
          }
          onSave={isAdding ? handleCreateDeadline : handleSaveEdit}
          onCancel={() => {
            setEditingDeadline(null);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
}
