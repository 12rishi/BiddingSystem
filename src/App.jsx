import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RoleSelector from "./components/roleSelector/RoleSelector";
import Login from "./components/authComponent/Login";
import Register from "./components/authComponent/Register";
import { SendOtp } from "./components/authComponent/SendOtp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "../store/store";
import { Home } from "./components/pages/home/Home";
import AddItem from "./components/pages/addItem/AddItem";
import MyListing from "./components/pages/myListing/MyListing";
import SinglePageitem from "./components/pages/myListing/SinglePageitem";
import "tailwindcss/tailwind.css";
import "daisyui";
import Edit from "./components/edit/Edit";
import BidderHome from "./components/Bidder/pages/home/Home";
import SellerCard from "./components/profile/Profile";
import SingleBidderItem from "./components/Bidder/pages/SingleBidderItem";
import { SocketProvider } from "../Socket/SocketContext";
import SingleBidderListingPage from "./components/Bidder/pages/myListing/SingleBidderListingPage";
import Navbar from "./components/navbar/Navbar";
import HighestBid from "./components/HighestBid/Highetsbid";
import SuccessPayment from "./components/Payment/SuccessPayment";
import Chat from "./components/chat/Chat";

function AppContent() {
  const location = useLocation();

  const noNavbarRoutes = ["/", "/login", "/register", "/sendOtp"];

  return (
    <>
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
      />

      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

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
        <Route path="/profile" element={<SellerCard />} />
        <Route path="/bidderItem/:id" element={<SingleBidderItem />} />

        <Route
          path="/bidderListing/:id"
          element={<SingleBidderListingPage />}
        />
        <Route path="/singleHighestBid/:id" element={<HighestBid />} />
        <Route path="/successPayment" element={<SuccessPayment />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <Provider store={store}>
        <SocketProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SocketProvider>
      </Provider>
    </>
  );
}

export default App;
