import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartProduct } from '../features/cartSlice';

const useAddToCart = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    console.log('my cart', cartItems);
    console.log("cart ka user", user?.data?.user);

    const addToCart = async (e, id) => {
        e?.stopPropagation();
        e?.preventDefault();

        console.log("CART -> Product ID:", id);

        try {
            if (!user?.data?.user?._id) {
                toast.error("Please log in to add products to the cart.");
                return;
            }

            await dispatch(addToCartProduct({ userId: user?.data?.user?._id, productId: id }))
                .unwrap() // Ensures rejection is thrown as an error
                .then((res) => {
                    console.log("Cart Updated Successfully:", res);
                    console.log(res?.message)
                    // toast.success(res?.message || "Product added to cart!");
                    // ✅ Ensure res.message exists before showing toast
                    if (res?.message) {
                        toast.success(res.message, { position: "top-right", autoClose: 3000 });
                    } else {
                        toast.error("Unexpected response format.");
                    }
                })
                .catch((error) => {
                    console.error("Cart Error:", error);
                    toast.error(error || "Failed to add product to cart.");
                });

        } catch (err) {
            console.error("Unexpected Error:", err);
            toast.error("An unexpected error occurred.");
        }
    };

    return addToCart;
};

export default useAddToCart;
