import React, { useEffect, useState } from "react";
import Login from "./Login";

function ProteccionRuta({ children, roleRequired }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  if (roleRequired && user.role !== roleRequired) {
    return <div className="text-center mt-5">No tienes permisos.</div>;
  }

  return children;
}

export default ProteccionRuta;
