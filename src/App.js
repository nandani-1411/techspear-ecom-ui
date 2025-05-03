import { Outlet, useLocation } from "react-router-dom";
import Header from "./Components/Header";
// import Footer from "./Components/Footer";
import { ThemeProvider } from "./Helpers/ThemeContext" // Import Theme Context
import { ToastContainer } from 'react-toastify';


function App() {
  const location = useLocation();  // To get the current route

  // Check if the current path contains '/Admin-panel' (or any other admin-related route)
  const isAdminPage = location.pathname.startsWith("/admin-panel") || location.pathname.startsWith("/Admin-panel");


  return (
    <>
      <ToastContainer />
      <ThemeProvider>
        {/* Render Header and Footer only if not on an admin page */}
        {!isAdminPage ? (
          <>

            <Header />
            <main>
              <Outlet />
            </main>
            {/* <Footer /> */}
          </>
        ) : (
          <main>
            <Outlet />
          </main>
        )}
      </ThemeProvider>
      </>
  );
}

export default App;






// import { useState, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Header from "./Components/Header";
// import Footer from "./Components/Footer";
// import { ToastContainer } from "react-toastify";
// import video from "./HomeAnimate.mp4";

// function App() {
//   const location = useLocation();
//   const isAdminPage = location.pathname.startsWith("/Admin-panel");

//   const [showVideo, setShowVideo] = useState(true);

//   useEffect(() => {
//     // Hide the video after 5 seconds (or when it ends)
//     const timer = setTimeout(() => {
//       setShowVideo(false);
//     }, 5000);

//     return () => clearTimeout(timer); // Cleanup timer
//   }, []);

//   if (showVideo) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black">
//         <video
//           className="w-full h-full object-cover"
//           autoPlay
//           muted
//           onEnded={() => setShowVideo(false)}
//         >
//           <source src={video} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
//       {!isAdminPage ? (
//         <>
//           <Header />
//           <main>
//             <Outlet />
//           </main>
//           <Footer />
//         </>
//       ) : (
//         <main>
//           <Outlet />
//         </main>
//       )}
//     </>
//   );
// }

// export default App;
