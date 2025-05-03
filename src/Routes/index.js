import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ForgetPassword from "../Pages/ForgetPassword";
import SignUp from "../Pages/Signup";
import AboutUs from "../Pages/AboutUs";
import Services from "../Pages/Services";
import ContactUs from "../Pages/ContactUs";
import AdminPanel from "../Pages/AdminPages/AdminPanel";
import AllUser from "../Pages/AdminPages/AllUser";
import AllProduct from "../Pages/AdminPages/AllProduct";
import CategoryProduct from "../Pages/CategoryProduct";
import AdminDeshboard from "../Pages/AdminPages/AdminDeshboard";
import OrderManagement from "../Pages/AdminPages/OrderManagement";
import PaymentManagement from "../Pages/AdminPages/PaymentManagement";
import ServiceManagement from "../Pages/AdminPages/ServiceManagement";
import UserProfile from "../Pages/UserPage/UserProfile";
import UserPanel from "../Pages/UserPage/UserPanel";
import OrderManage from "../Pages/UserPage/OrderManage";
import AppoitmentHistory from "../Pages/UserPage/AppointmentHistory";
import PaymentHistory from "../Pages/UserPage/PaymentHistory"
import UserSetting from "../Pages/UserPage/UserSetting"
import ProductDisplay from "../Pages/ProductDetails.js"
import UserCart from "../Pages/UserCart.js";
import Payment from "../Pages/Payment.js"
import PaymentSuccess from "../Components/PaymentSuccess.js"
import WriteReview from "../Pages/WriteReview.js"
import ProtectedRoute from "./ProtectedRoute.js";
import BannerManager from "../Pages/AdminPages/BannerManager.js";
import PaymentSuccessCod from "../Components/PaymentSuccessCod.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "user-cart",
        element: <ProtectedRoute />, // 🔒 Protect User Cart
        children: [{ path: "", element: <UserCart /> }],
      },
      {
        path: "payment-integration",
        element: <ProtectedRoute />, // Wrap with ProtectedRoute
        children: [
          {
            path: "",
            element: <Payment />,
          },
        ],
      },
      {
        path: "product/:id",
        element: <ProductDisplay />,
      },
      {
        path: "payment-success",
        element: <ProtectedRoute />, // 🔒 Protect Payment Success Page
        children: [
          {
            path: "online",
            element: <PaymentSuccess />, // ✅ Online Payment Success Page
          },
          {
            path: "cod",
            element: <PaymentSuccessCod />, // ✅ COD Payment Success Page
          },
          {
            path: "write-review",
            element: <WriteReview />,
          },
        ],
      },      
      {
        path: "user-panel",
        element: <ProtectedRoute />,  // 🔒 Protect user panel
        children: [
          {
            path: "",
            element: <UserPanel />,
            children: [
              { path: "", element: <UserProfile /> },
              { path: "order-manage", element: <OrderManage /> },
              { path: "Appointment-history", element: <AppoitmentHistory /> },
              { path: "Payment-history", element: <PaymentHistory /> },
              { path: "User-Setting", element: <UserSetting /> },
            ],
          },
        ],
      },
      {
        path: "admin-panel",
        element: <ProtectedRoute allowedRoles={["Admin"]} />, // 🔒 Protect admin panel
        children: [
          {
            path: "",
            element: <AdminPanel />,
            children: [
              { path: "", element: <AdminDeshboard /> },
              { path: "all-user", element: <AllUser /> },
              { path: "all-product", element: <AllProduct /> },
              { path: "order-management", element: <OrderManagement /> },
              { path: "payment-management", element: <PaymentManagement /> },
              { path: "service-management", element: <ServiceManagement /> },
              { path: "banner-management", element:<BannerManager/>}
            ],
          },
        ],
      },
      {
        path: "product-category",
        element: <CategoryProduct />,
      },
      {
        path: "unauthorized",
        element: (
          <div className="text-center text-red-600 mt-10 text-xl font-bold">
            🚫 Access Denied — You do not have permission to view this page.
          </div>
        ),
      }
      
    ],
  },
]);

export default router;