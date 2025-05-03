import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user role from local storage, API, or authentication
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || { role: "customer" };
    setUser(loggedInUser);
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
