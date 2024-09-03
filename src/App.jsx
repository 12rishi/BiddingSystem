import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelector from "./components/roleSelector/RoleSelector";
import Login from "./components/authComponent/Login";
import Register from "./components/authComponent/Register";
import { SendOtp } from "./components/authComponent/SendOtp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useSelector } from "react-redux";
import store from "../store/store";
import { Home } from "./components/pages/home/Home";
import AddItem from "./components/pages/addItem/AddItem";
import MyListing from "./components/pages/myListing/MyListing";
import SinglePageitem from "./components/pages/myListing/SinglePageitem";
import "tailwindcss/tailwind.css"; // Ensure this is imported in your main entry file
import "daisyui";
import STATUS from "../status/status";
import AddItemForm from "./components/pages/addItem/Form";
import Edit from "./components/edit/Edit";
import BidderHome from "./components/Bidder/pages/home/Home";
import { useEffect, useState } from "react";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition:Bounce
          />
          <Routes>
            <Route path="/" element={<RoleSelector />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sendOtp" element={<SendOtp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/bidderHome" element={<BidderHome />} />
            <Route path="/addItem" element={<AddItem />} />
            <Route path="/listItem" element={<MyListing />} />
            <Route path="/item/:id" element={<SinglePageitem />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
