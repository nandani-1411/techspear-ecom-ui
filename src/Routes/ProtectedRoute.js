import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticate, user } = useSelector((state) => state.auth);
  console.log("Protected user",user)
  const cartItems = useSelector((state) => state.cart);

  if (!isAuthenticate) {
    toast.error("Please login to access this page.");
    return <Navigate to="/login" replace />;
  }

  // 👮‍♂️ Role check
  if (allowedRoles && !allowedRoles.includes(user?.data?.user?.role)) {
    toast.error("Access denied. You are not authorized.");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
