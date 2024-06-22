import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  PaymentPage,
  CheckoutPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
} from "./routes/Routes.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { server } from "./server.js";
import axios from "axios";
import Store from "./redux/store.js";
import { loadSeller, loadUser } from "./redux/actions/user.js";
import { useSelector } from "react-redux";
import { ShopHomePage } from "./ShopRoutes.js";
import {
  ShopDashBoardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCupouns,
  ShopPreviewPage,
} from "./routes/ShopRoutes.js";
import Loader from "./components/layout/Loader.jsx";
import Checkout from "./components/Checkout/Checkout.jsx";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvent, getAlleventsShop } from "./redux/actions/event.js";
function App() {
  const { loading } = useSelector((state) => state.user);

  const { isLoading, isSeller } = useSelector((state) => state.seller);
  // console.log(isSeller);
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvent());
  }, []);
  // console.log(isSeller, seller);

  return (
    <>
      {loading || isLoading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="sign-up" element={<SignupPage />} />
            <Route
              path="/activation/:activation_token"
              element={<ActivationPage />}
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/activation/:activation_token"
              element={<SellerActivationPage />}
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* shop routes */}
            <Route path="/shop-create" element={<ShopCreatePage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route
              path="/shop/:id"
              element={
                <sellerProtectedRoute>
                  <ShopHomePage />
                </sellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <sellerProtectedRoute>
                  <ShopDashBoardPage />
                </sellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-create-product"
              element={
                <sellerProtectedRoute>
                  <ShopCreateProduct />
                </sellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-products"
              element={
                <sellerProtectedRoute>
                  <ShopAllProducts />
                </sellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-create-event"
              element={
                <sellerProtectedRoute>
                  <ShopCreateEvents />
                </sellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-events"
              element={
                <sellerProtectedRoute>
                  <ShopAllEvents />
                </sellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-cupouns"
              element={
                <sellerProtectedRoute>
                  <ShopAllCupouns />
                </sellerProtectedRoute>
              }
            />
            <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
          </Routes>

          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;