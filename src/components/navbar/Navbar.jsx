import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineNotifications } from "react-icons/md";
import TH from "./TH.png";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../../store/authSlice";

const Navbar = () => {
  const { role } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem("jsonWebToken");
    localStorage.removeItem("role");
    navigate("/");
  };
  useEffect(() => {
    dispatch(setRole(localStorage.getItem("role")));
  }, [role]);
  return (
    <nav className="bg-[#52B5B5] p-4 shadow-xl">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-lg font-bold">
          <Link to="/">
            <img src={TH} alt="" className="h-12 w-12" />
          </Link>
        </div>

        {/* Menu Items */}
        <div className="space-x-10 flex  items-center">
          {role === "seller" && (
            <Link
              to={`/home?role=${role}`}
              className="text-white hover:text-gray-200"
            >
              Home
            </Link>
          )}
          {role === "bidder" && (
            <Link
              to={`/bidderHome?role=${role}`}
              className="text-white hover:text-gray-200"
            >
              Home
            </Link>
          )}
          <Link to="/listItem" className="text-white hover:text-gray-200">
            My Listing
          </Link>
          <Link to="/addItem" className="text-white hover:text-gray-200">
            Add Item
          </Link>
          <Link
            to="/notifications"
            className="text-white hover:text-gray-200  "
          >
            <MdOutlineNotifications className=" text-2xl " />
          </Link>
          <Link className="text-white hover:text-gray-200">
            <button
              onClick={handleLogout}
              className="bg-[#ff8749] p-1 px-2 border border-white rounded-full hover:bg-[#f6651a] "
            >
              Logout
            </button>
          </Link>
          <Link to="/profile" className="text-white hover:text-gray-200">
            <button className="bg-[#ff8749] p-1 px-2 border border-white rounded-full hover:bg-[#f6651a]">
              Profile
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
