import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebase.js";
import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  // ================= AUTH STATES =================
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);


  // ================= AUTH LISTENER =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // cleanup listener when app unmounts
    return () => unsubscribe();
  }, []);




 const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  // ================= LOADING SCREEN =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

//   if (!user) {
//   return <Signup />; // or Login component if you have one
// }


  // ================= APP GATE =================
  // logged in  -> Dashboard
  // logged out -> Login
 if (!user) {
  return showSignup ? (
    <Signup onSwitch={() => setShowSignup(false)} />
  ) : (
    <Login onSwitch={() => setShowSignup(true)} />
  );
}

return <Dashboard onLogout={handleLogout} />;

}

export default App;
