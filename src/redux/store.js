import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice.js";
import addressReducer from "../features/addressSlice.js"
import orderReducer from "../features/orderSlice.js"
import paymentReducer from "../features/paymentSlice.js"
import reviewReducer from "../features/reviewSlice.js"
import serviceReducer from "../features/serviceSlice.js"
import bannerReducer from "../features/bannerSlice.js"
import dashboardReducer from "../features/dashboardSlice.js"
// Separate persist configs for each reducer
const userPersistConfig = {
  key: "auth",
  storage,
};

const productPersistConfig = {
  key: "product",
  storage,
};

// const cartPersistConfig = {
//   key: "cart",
//   storage,
// };

const persistedAuthReducer = persistReducer(userPersistConfig, userReducer);
const persistedProductReducer = persistReducer(productPersistConfig, productReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    product: persistedProductReducer,
    cart: cartReducer,
    address:addressReducer,
    order:orderReducer,
    payment:paymentReducer,
    review:reviewReducer,
    service:serviceReducer,
    banner:bannerReducer,
    dashboard:dashboardReducer
  },
});

export const persistor = persistStore(store);
