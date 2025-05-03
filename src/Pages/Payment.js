import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import displayINRCurrency from "../Helpers/displayCurrency";
import { toast } from "react-toastify";
import { addAddress } from "../features/addressSlice";
import { createOrder } from "../features/orderSlice";
import { createCODPayment, createPayment, verifyPayment } from "../features/paymentSlice";
import loadScript from "../Helpers/loadScript";
import { ThemeContext } from "../Helpers/ThemeContext"; // Adjust path as needed
import { getAddress } from "../features/addressSlice";
export default function Example() {

  const [formData, setFormData] = useState({
    email: "",
    fullAddress: "",
    apartment: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
    phone: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch()
  const { isDarkMode } = useContext(ThemeContext);

  const { cartItems } = useSelector((state) => state.cart)
  console.log(cartItems?.data)
  const { user } = useSelector((state) => state.auth)
  console.log(user)
  const userId = user?.data?.user?._id;
  console.log("USERID ", userId)

  const { address } = useSelector((state) => state.address)
  console.log("user add", address)

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

  }

  const subtotal = cartItems?.data?.cartItem?.items?.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 1),
    0
  ) || 0;

  // Fetch user's address for the first order
  const fetchAddressForFirstOrder = async () => {
    try {
      const response = await dispatch(getAddress({ userId })).unwrap();
      console.log(response?.data);
      setFormData(response?.data)
      toast.success(response?.message)

    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchAddressForFirstOrder()
  }, [])
  // console.log(formData)

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    console.log("Called fun confirm order")

    try {
      const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!isLoaded) {
        console.error("Razorpay SDK failed to load.");
        toast.error("Razorpay SDK failed to load.")
        return;
      }

      if (!userId) {
        toast.error("User not found, please login.");
        navigate("/login");
        return;
      }

      if (!cartItems?.data?.cartItem?._id) {
        toast.error("Your cart is empty.");
        navigate("/user-cart");
        return;
      }
      if (formData.email === "") {
        toast.error("Pls enter all the detail of Shipping.")
      }
      const res = await dispatch(addAddress({ userId, formData })).unwrap()

      console.log(res)
      toast.success(res?.message || res?.payload?.message)
      console.log(res?.data?._id)
      console.log(res?.payload?.data?._id)

      // if (!res?.payload?.data?._id) {
      //   toast.error("Address not found or not store in db. pls again refresh and set address.")
      // }

      try {

        const ordr = await dispatch(createOrder({ userId, addressInfo: res?.data?._id, cartItems: cartItems?.data?.cartItem?._id })).unwrap()

        toast.success(ordr?.message)
        console.log(ordr)

        const orderId = ordr?.data?._id;

        const ordrProductId = ordr?.data?.orderItems.map((itm) => itm.product._id)

        if (!orderId) {
          toast.error("Failed To create Order")
          return;
        }

        const paymentRs = await dispatch(createPayment({ userId, orderId, amount: subtotal })).unwrap()
        console.log(paymentRs)



        const options = {
          key: "rzp_test_pnNFdssTvAiGlD",
          amount: subtotal * 100, // Convert to paisa 
          currency: "INR",
          name: "Tech Speare",
          description: "Test Transaction",
          order_id: paymentRs?.data?.payment?.
            razorpayOrderId,
          handler: async function (response) {
            console.log("Payment Success:", response);
            console.log("Razorpay Payment ID:", response.razorpay_payment_id);
            console.log("Razorpay Order ID:", response.razorpay_order_id);
            console.log("Razorpay Signature:", response.razorpay_signature);

            if (!response.razorpay_order_id || !response.razorpay_signature) {
              console.error("Missing required Razorpay parameters.");
              toast.error("Payment verification failed.");
              return;
            }
            const verifyRes = await dispatch(
              verifyPayment({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderId,
              })
            ).unwrap()
            console.log("Payment Verification Response:", verifyRes);
            toast.success(verifyRes.message);

            navigate("/payment-success/online", {
              state: {
                userId: userId,
                productId: ordrProductId
              }
            });

          },
          prefill: {
            name: user?.data?.user?.name,
            email: user?.data?.user?.email
          },
          theme: {
            color: "dark",
          },
          method: {
            upi: true, // <<== add this line
          },
          upi: {
            flow: "collect", // force UPI ID entry
          },
        };
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      }
      catch (er) {
        toast.error(er)
        console.log(er)
      }

    }
    catch (error) {
      console.log(error)
      toast.error(error)
    }


    // navigate("/payment-success", { state: { paymentStatus: "success" } });
  };

  const handleCashOnDelivery =async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not found, please login.");
      navigate("/login");
      return;
    }

    if (!cartItems?.data?.cartItem?._id) {
      toast.error("Your cart is empty.");
      navigate("/user-cart");
      return;
    }

    try{
      const res = await dispatch(addAddress({ userId, formData })).unwrap()

      console.log(res)
      toast.success(res?.message || res?.payload?.message)
      console.log(res?.data?._id)
      console.log(res?.payload?.data?._id)

      
      try {

        const ordr = await dispatch(createOrder({ userId, addressInfo: res?.data?._id, cartItems: cartItems?.data?.cartItem?._id })).unwrap()

        toast.success(ordr?.message)
        console.log(ordr)

        const orderId = ordr?.data?._id;

        const ordrProductId = ordr?.data?.orderItems.map((itm) => itm.product._id)

        if (!orderId) {
          toast.error("Failed To create Order")
          return;
        }

        const paymentRs = await dispatch(createCODPayment({ userId, orderId, amount: subtotal })).unwrap()
        console.log(paymentRs)
        toast.success(res?.messaage);

        navigate("/payment-success/cod", {
          state: {
            userId: userId,
            productId: ordrProductId
          }
        });
      }
      catch(er){
        console.log(er)
        toast.error(er)
      }

    }catch(er){
      console.log(er)
      toast.error(er)
    }

    


  };
  


  return (
    <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className=" lg:mt-0 lg:sticky lg:top-0 overflow-y-auto h-screen scrollbar-hide mb-32">
            <div>
              <h2 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Contact information
              </h2>

              <div className="mt-4">
                <label
                  htmlFor="email-address"
                  className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-6`}
                >
                  Email address
                </label>

                <div className="mt-2">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleOnChange}
                    className={`block w-full rounded-md px-3 py-2 text-base outline outline-1 -outline-offset-1 sm:text-sm
                         ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 placeholder-gray-400 focus:outline-indigo-400"
                        : "bg-white text-gray-900 outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"}
                        `}
                  />
                </div>

              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Shipping information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {/* Full Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Full Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="fullAddress"
                      type="text"
                      required
                      value={formData.fullAddress}
                      onChange={handleOnChange}
                      autoComplete="street-address"
                      className={`block w-full rounded-md px-3 py-2 text-base outline outline-1 -outline-offset-1 sm:text-sm
            ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 placeholder-gray-400 focus:outline-indigo-400"
                          : "bg-white text-gray-900 outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"}
          `}
                    />
                  </div>
                </div>

                {/* Apartment */}
                <div className="sm:col-span-2">
                  <label htmlFor="apartment" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-2">
                    <input
                      id="apartment"
                      name="apartment"
                      type="text"
                      required
                      value={formData.apartment}
                      onChange={handleOnChange}
                      className={`block w-full rounded-md px-3 py-2 text-base outline outline-1 -outline-offset-1 sm:text-sm
            ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 placeholder-gray-400 focus:outline-indigo-400"
                          : "bg-white text-gray-900 outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"}
          `}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      required
                      onChange={handleOnChange}
                      autoComplete="address-level2"
                      className={`block w-full rounded-md px-3 py-2 text-base outline outline-1 -outline-offset-1 sm:text-sm
            ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 placeholder-gray-400 focus:outline-indigo-400"
                          : "bg-white text-gray-900 outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"}
          `}
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Country
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleOnChange}
                      autoComplete="country-name"
                      className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pl-3 pr-8 text-base outline outline-1 -outline-offset-1 sm:text-sm
            ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 focus:outline-indigo-400"
                          : "bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600"}
          `}
                    >
                      <option>Select Country</option>
                      <option>India</option>
                    </select>
                  </div>
                </div>

                {/* State / Province */}
                <div>
                  <label htmlFor="region" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      id="region"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleOnChange}
                      autoComplete="address-level1"
                      className={`block w-full rounded-md px-3 py-2 text-base outline outline-1 -outline-offset-1 sm:text-sm
            ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 placeholder-gray-400 focus:outline-indigo-400"
                          : "bg-white text-gray-900 outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"}
          `}
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label htmlFor="postal-code" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      id="postal-code"
                      name="pinCode"
                      type="text"
                      required
                      value={formData.pinCode}
                      onChange={handleOnChange}
                      autoComplete="postal-code"
                      className={`block w-full rounded-md px-3 py-2 text-base outline outline-1 -outline-offset-1 sm:text-sm
            ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 placeholder-gray-400 focus:outline-indigo-400"
                          : "bg-white text-gray-900 outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"}
          `}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleOnChange}
                      className={`block w-full rounded-md px-3 py-2 text-base outline outline-1 -outline-offset-1 sm:text-sm
                      ${isDarkMode ? "bg-gray-800 text-white outline-gray-600 placeholder-gray-400 focus:outline-indigo-400"
                          : "bg-white text-gray-900 outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"}
                          `}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              Order summary
            </h2>

            <div
              className={`mt-4 rounded-lg border shadow-sm ${isDarkMode ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-white text-gray-900"
                }`}
            >
              <h3 className="sr-only">Items in your cart</h3>
              <ul className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                {cartItems?.data?.cartItem?.items?.map((product) => (
                  <li key={product?.productId?._id} className="flex px-4 py-6 sm:px-6">
                    <div className="shrink-0">
                      <img
                        alt={product?.productId?.productName}
                        src={product?.productId?.mainProductImg}
                        className="w-20 rounded-md"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a
                              href={product.href}
                              className={`font-medium ${isDarkMode ? "text-gray-200 hover:text-white" : "text-gray-800 hover:text-black"
                                }`}
                            >
                              {product?.productId?.productName}
                            </a>
                          </h4>
                          <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {product?.productId?.category}
                          </p>
                          <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {product?.productId?.description}
                          </p>
                        </div>


                        <div className="ml-4 flow-root shrink-0">
                          <p>Qty : {product?.quantity}</p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className={`mt-1 text-sm font-medium ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                          {displayINRCurrency(product?.productId?.price)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className={`space-y-6 border-t px-4 py-6 sm:px-6 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className={`flex items-center justify-between border-t pt-6 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <dt className="text-base font-medium">Total</dt>
                  <dd className={`text-base font-medium ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {displayINRCurrency(subtotal)}
                  </dd>
                </div>
              </dl>

              <div className={`border-t px-4 py-6 sm:px-6 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <button
                  type="submit"
                  onClick={(e) => handleConfirmOrder(e)}
                  className={`w-full rounded-md border border-transparent px-4 py-3 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-400 focus:ring-offset-gray-800"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 focus:ring-offset-gray-50"
                    }`}
                >
                  Checkout With Razorpay
                </button>
                {/* New Cash on Delivery Button */}
                <button
                  type="button"
                  onClick={(e) => handleCashOnDelivery(e)}
                  className={`mt-4 w-full rounded-md border border-transparent px-4 py-3 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400 focus:ring-offset-gray-800"
                    : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 focus:ring-offset-gray-50"
                    }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
