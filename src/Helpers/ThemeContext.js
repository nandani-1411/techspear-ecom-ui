import React, { createContext, useState, useEffect } from "react";

// Create ThemeContext
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Get initial theme from localStorage or default to false (light mode)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // Toggle Theme Function
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("theme", newMode ? "dark" : "light");
            return newMode;
        });
    };

    // Apply theme class to the body
    useEffect(() => {
        document.body.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
