import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../Helpers/ThemeContext";
import { useDispatch } from "react-redux";
import { sendOtp,verifyOtp,resetPass } from "../features/userSlice";
// Initialize Toasts

export default function ForgotPassword() {
  const navigate = useNavigate(); // ✅ Initialize navigate function
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const dispatch = useDispatch()

  // Function to simulate OTP sending
  const handleSendOTP = async(e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.error("Please enter a valid email!", { position: "top-center" });
      return;
    }

    // const mockOtp = "123456"; // Replace with backend-generated OTP
    // setGeneratedOtp(mockOtp);
    // console.log("OTP sent to:", email, "OTP:", mockOtp);
    // // toast.success(res?.message, { position: "top-center" });

    try {
      const res = await dispatch(sendOtp({ email })).unwrap(); // 🔥 call your backend here
      console.log(res)
      toast.success(res?.message, { position: "top-center" });
      setStep(2);
      startResendCountdown();
    } catch (error) {
      toast.error(error|| "Failed to send OTP", { position: "top-center" });
    }
  
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (index < 5 && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };
  const handleOTPKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0 && e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };
  // Function to verify OTP
  const handleVerifyOTP =async (e) => {

    e.preventDefault();
    const fullOtp = otp.join("");  // Combine OTP array into a string
  
    if (fullOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", { position: "top-center" });
      return;
    }
  
    const otpData = { email, otp: fullOtp };
  
    try {
      const res = await dispatch(verifyOtp(otpData)).unwrap();
      console.log(res); // Handle response (e.g., OTP verified successfully)
      toast.success(res?.message, { position: "top-center" });
      setStep(3);  // Proceed to password reset step
    } catch (error) {
      toast.error(error || "Invalid OTP. Please try again.", { position: "top-center" });
    }

  };

  // Function to update the password
  const handleResetPassword =async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!", { position: "top-center" });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }
  
    try {
      const res = await dispatch(resetPass({ email, newPassword })).unwrap();
      toast.success(res?.message || "Your password has been reset!", { position: "top-center" });
      navigate("/login"); // Or wherever you want to redirect after reset
    } catch (error) {
      toast.error(error || "Failed to reset password", { position: "top-center" });
    }
  
    // Reset process
    setStep(1);
    setEmail("");
    setOtp(new Array(6).fill(""));
    setNewPassword("");
    setConfirmPassword("");
  };
  
  
  const startResendCountdown = () => {
    setIsResendDisabled(true);
    setTimer(30);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleResendOTP = async() => {
    try {
      const res = await dispatch(sendOtp({ email })).unwrap(); // 🔥 call backend to resend OTP
      toast.info(res?.message || "OTP resent successfully", { position: "top-center" });
      setOtp(new Array(6).fill("")); // Reset OTP inputs
      startResendCountdown(); // Restart timer
    } catch (error) {
      toast.error(error || "Failed to resend OTP", { position: "top-center" });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
    >
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'
          }`}
      >
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Forgot Password
            </h2>
            <p
              className={`text-sm text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Enter your email to receive an OTP.
            </p>
            <label
              className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Email
            </label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-400'
                : 'bg-white text-black border-gray-300 focus:ring-blue-500'
                }`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <h2 className="text-2xl font-semibold mb-4 text-center">Enter OTP</h2>
            <p className={`text-sm text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              An OTP has been sent to your email.
            </p>
            <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              OTP
            </label>
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className={`w-10 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 ${isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-400'
                    : 'bg-white text-black border-gray-300 focus:ring-blue-500'
                    }`}
                  value={digit}
                  onChange={(e) => handleOTPChange(e, index)}
                  onKeyDown={(e) => handleOTPKeyDown(e, index)}
                />
              ))}
            </div>
            <div className="text-end text-sm mb-4">
              {isResendDisabled ? (
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Resend OTP in <strong>{timer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue-500 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Reset Password
            </h2>
            <p
              className={`text-sm text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Enter a new password for your account.
            </p>
            <label
              className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              New Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-400'
                : 'bg-white text-black border-gray-300 focus:ring-blue-500'
                }`}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label
              className={`block text-sm mb-1 mt-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-400'
                : 'bg-white text-black border-gray-300 focus:ring-blue-500'
                }`}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 mt-4 rounded-lg hover:bg-purple-600 transition"
            >
              Update Password
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-blue-500 text-sm hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>

  );
}
