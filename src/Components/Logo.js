import React, { useContext } from 'react';
import logo from './logo.png'; // for light mode
import logolight from './logolight.png'; // for dark mode
import { ThemeContext } from '../Helpers/ThemeContext';

const Logo = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <img
      src={isDarkMode ? logolight : logo}
      alt="Logo"
      height={isDarkMode ? 240 : 280} // Adjust height for light mode
      width={230}
      className="transition-all duration-300"
    />
  );
};

export default Logo;
