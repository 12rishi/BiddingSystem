import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineNotifications } from "react-icons/md";
import TH from "./TH.png";
import { useDispatch } from "react-redux";
import { setRole } from "../../../store/authSlice";
import { useSocket } from "../../../Socket/SocketContext";
import API from "../../http/axiosInstance";

const Navbar = () => {
  const [messageCount, setMessageCount] = useState(() => {
    const savedNotificatioNumber = localStorage.getItem("notificationCount");
    return savedNotificatioNumber ? parseInt(savedNotificatioNumber, 10) : 0;
  });
  const [notificationData, setNotificationData] = useState([]);
  const [userData, setUserData] = useState();
  const [showNotifications, setShowNotifications] = useState(false); // New state for showing notifications
  const socket = useSocket();
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNotification = () => {
    setMessageCount(0);
    localStorage.setItem("notificationCount", 0);

    setShowNotifications(!showNotifications);
    let id;
    if (role === "seller") {
      id = notificationData[0]?.sellerItem?.sellerAuth?.id;

      if (id) {
        console.log("id is", id);
        socket.emit("sellerClicked", id);
      }
    } else if (role === "bidder") {
      id = notificationData[0].buyerAuth.id;
      socket.emit("bidderClicked", id);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("jsonWebToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    dispatch(setRole(localStorage.getItem("role")));
    if (socket) {
      socket.emit("hello", role);
      socket.on("hi", (message) => {
        console.log(message);
      });
      socket.on("newMessage", (message) => {
        setMessageCount((prevState) => {
          const newCount = prevState + 1;
          localStorage.setItem("notificationCount", newCount);
          return newCount;
        });
        console.log(message);
      });
    }
    return () => {
      if (socket) {
        socket.off("hello");
        socket.off("hi");
        socket.off("newMessage");
      }
    };
  }, [role, socket]);

  useEffect(() => {
    const fetchHighestBids = async () => {
      const response = await API.get(
        `/notification/${localStorage.getItem("role")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data) {
          setNotificationData(response.data.data);
          const newCount = response.data.length;
          setMessageCount((prevState) => {
            const updatedCount = prevState + newCount;
            localStorage.setItem("notificationCount", updatedCount);
            return newCount;
          });
        }
      }
    };

    const getProfile = async () => {
      const response = await API.get(
        `/singleProfile/${localStorage.getItem("role")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setUserData(response.data.data);
      }
    };

    getProfile();
    fetchHighestBids();
  }, []);

  return (
    <>
      <nav className="bg-[#52B5B5] p-4 shadow-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="text-white text-lg font-bold ">
            <Link to="/">
              <img src={TH} alt="" className="h-8 w-8 sm:h-12 sm:w-12" />
            </Link>
          </div>

          <div className="space-x-5 sm:space-x-10 flex items-center relative text-sm sm:text-base">
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
              {role === "bidder" ? "My Bidding" : "My Listing"}
            </Link>
            {role === "seller" ? (
              <Link to="/addItem" className="text-white hover:text-gray-200">
                Add Item
              </Link>
            ) : (
              <Link to="/faq" className="text-white hover:text-gray-200">
                FAQ
              </Link>
            )}

            <button
              className="relative text-white hover:text-gray-200"
              onClick={handleNotification}
            >
              <MdOutlineNotifications className="text-xl sm:text-2xl" />
              {messageCount > 0 && (
                <span className="absolute top-0 right-0 -mt-2 -mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {messageCount}
                </span>
              )}
            </button>

            {showNotifications && notificationData.length > 0 && (
              <div className="absolute right-0 top-10 w-64 text-gray-100 bg-[#52b5b5] shadow-md rounded-lg overflow-hidden z-10">
                {notificationData.map((notification) => (
                  <Link
                    to={`/singleHighestBid/${notification.id}`}
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <div
                      key={notification.id}
                      className="p-4 border-b border-gray-200"
                    >
                      <p>
                        {role === "seller"
                          ? `${notification.sellerItem.itemName} has received a bid
                        from ${notification.buyerAuth.userName} for the amount of
                        ${notification.bidAmount}`
                          : `congratulation you are the one with highest bid for the item ${notification.sellerItem.itemName}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {userData?.profilePicture ? (
              <Link to="/profile" className="text-white hover:text-gray-200">
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-white"
                />
              </Link>
            ) : (
              <Link to="/profile" className="text-white hover:text-gray-200">
                <button className="bg-[#ff8749] p-1 px-2 border border-white rounded-full hover:bg-[#f6651a]">
                  Profile
                </button>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-[#ff8749] p-1 px-2 border border-white rounded-full hover:bg-[#f6651a] text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
