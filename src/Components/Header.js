import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../Helpers/ThemeContext";
import Logo from "./Logo";
import { SiSearxng } from "react-icons/si";
import { FaBars, FaTimes, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";


import { persistor } from "../redux/store";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { logoutUser } from "../features/userSlice";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [cartCount] = useState(3); // Example cart count
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  // const [user, setUser] = useState(null); // Store user details
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { isAuthenticate, user } = useSelector((state) => state.auth)
  console.log("is auth ", isAuthenticate)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart)

  console.log(cartItems)

  const mycountlen = cartItems?.data?.cartItem?.items?.length || 0;
  console.log(mycountlen)
  // Detect Scroll to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const fetchSearchProduct = async () => {
    try {
      console.log("MY Search Quearry", searchQuery)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/searchProduct?q=${searchQuery}`);
      console.log(response?.data)
      console.log(response?.data?.message)
      // toast.success(response?.data?.message)
      setSearchResults(response?.data?.data);
    } catch (er) {
      toast.error(er)
    }
  }

  useEffect(() => {
    fetchSearchProduct()
  }, [searchQuery])

  const searchBoxRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchSearchProduct();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);



  // Fetch user on page load
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const storedUser = localStorage.getItem("user");
  //       if (storedUser) {
  //         setUser(JSON.parse(storedUser));
  //         setIsLoggedIn(true);
  //         return;
  //       }

  //       const response = await axios.get("http://localhost:5000/api/v1/users/getCurrentUser", {
  //         withCredentials: true,
  //       });

  //       if (response.data?.data?.user) {
  //         localStorage.setItem("user", JSON.stringify(response.data.data.user)); // Save user data
  //         setUser(response.data.data.user);
  //         setIsLoggedIn(true);
  //       } else {
  //         localStorage.removeItem("user");
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error.response?.data?.message || error.message);
  //       localStorage.removeItem("user");
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // Logout function
  const handleLogout = async () => {

    try {
      const rs = await dispatch(logoutUser()).unwrap()

      console.log(rs)
      toast.success(rs?.message)
      persistor.purge()
      window.location.reload();

    } catch (er) {
      console.log(er)
      toast.error(er)
    }

  };
  useEffect(() => {
    console.log("User state : ", user);
    console.log("Is Logged In auth ka state:", isAuthenticate);
  }, [user, isAuthenticate]);


  return (
    <>
      {/* Header */}
      <header
        className={`sticky top-0 left-0 z-[100] w-full h-auto md:h-24 lg:h-28 transition duration-200 ${isDarkMode ? "bg-gray-900 text-white shadow-lg" : "bg-white text-gray-800 shadow-md"
          } ${isScrolled ? "shadow-lg" : ""}`}
      >
        <div className="xl:container mx-auto flex items-center justify-between py-2 px-2 md:px-8 text-lg font-semibold">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <Logo className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-6 xl:space-x-20 xl:text-base 2xl:text-lg">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <Link to="/about-us" className="hover:text-blue-500">About Us</Link>
            <Link to="/services" className="hover:text-blue-500">Services</Link>
            <Link to="/contact-us" className="hover:text-blue-500">Contact Us</Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div ref={searchBoxRef} className="relative hidden sm:flex items-center w-auto lg:w-full max-w-sm border rounded-full focus-within:shadow pl-2">
              <input
                type="search"
                placeholder="Search Here..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full outline-none px-2 py-1 bg-transparent"
              />
              <button
                className="text-lg min-w-[50px] h-8 bg-blue-500 hover:bg-blue-600 flex items-center justify-center rounded-r-full text-white"
                onClick={(e) => {
                  e.preventDefault();
                  fetchSearchProduct();
                }}
              >
                <SiSearxng />
              </button>

              {/* Search Suggestions */}
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full max-h-[300px] overflow-y-auto bg-white text-black shadow-lg z-[999] rounded-md mt-1">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                      onMouseDown={() => {
                        navigate(`/product/${product._id}`);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <div className="font-semibold">{product.productName}</div>
                      <div className="text-sm text-gray-500">₹{product.price}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Shopping Cart */}
            <div className="relative">
              <button className="text-xl hover:text-blue-500" onClick={() => navigate("user-cart")}>
                <FaShoppingCart />
              </button>
              {mycountlen > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {mycountlen}
                </span>
              )}
            </div>

            {/* User Profile & Login/Logout */}
            {isAuthenticate ? (
              <>
                {/* Show User Panel only if logged in */}
                {user && (
                  <Link to="/User-panel" className="text-lg md:text-xl hover:text-blue-500">
                    <FaUserCircle />
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition hidden lg:inline"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Login Button */
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition hidden lg:inline"
              >
                Login
              </Link>
            )}


            {/* Mobile Menu Button */}
            <button className="text-2xl lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar (Mobile Menu) */}
      <div
        className={`fixed left-0 top-28 w-64 h-[calc(100vh-7rem)] z-[90] shadow-md transition-transform duration-300
    ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    lg:hidden`}
      >


        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            className="text-2xl focus:outline-none hover:text-red-500 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 p-4">
          <Link to="/" className="hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/about-us" className="hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link to="/services" className="hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
          <Link to="/contact-us" className="hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>

          {/* Dynamic Login/Logout */}
          {isAuthenticate ? (
            <>
              <button
                onClick={handleLogout}
                className="hover:text-red-500 transition font-medium text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          )}

          <div
            ref={searchBoxRef}
            className="relative flex items-center w-full max-w-full border rounded-full focus-within:shadow pl-2 mt-4"
          >
            <input
              type="search"
              placeholder="Search Here..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full outline-none px-2 py-1 bg-transparent"
            />
            <button
              className="text-lg min-w-[50px] h-8 bg-blue-500 hover:bg-blue-600 flex items-center justify-center rounded-r-full text-white"
              onClick={(e) => {
                e.preventDefault();
                fetchSearchProduct();
              }}
            >
              <SiSearxng />
            </button>

            {/* Search Suggestions */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full max-h-[300px] overflow-y-auto bg-white text-black shadow-lg z-[999] rounded-md mt-1">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setSearchQuery(""); // clear query after navigating
                      setSearchResults([]); // clear results
                    }}
                  >
                    <div className="font-semibold">{product.productName}</div>
                    <div className="text-sm text-gray-500">₹{product.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* Dark Mode Toggle */}
        <div className="absolute bottom-4 left-0 w-full p-4 border-t flex justify-between items-center">
          <span className="text-lg font-medium">Dark Mode</span>
          <button
            onClick={toggleTheme}
            className="text-xl p-2 rounded-full transition hover:bg-gray-700"
          >
            {isDarkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </div>

    </>
  );
};

export default Header;