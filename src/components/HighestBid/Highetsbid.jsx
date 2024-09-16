import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../http/axiosInstance";
import { Footer } from "../footer/Footer";
import Spinner from "../spinner/Spinner";
import { useSocket } from "../../../Socket/SocketContext";

const HighestBid = () => {
  const [data, setData] = useState(null);
  const socket = useSocket();
  const { id } = useParams();
  const role = localStorage.getItem("role");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const handleCall = () => {
    {
      role === "seller"
        ? (window.location.href = `tel:${data.buyerAuth.phoneNumber}`)
        : (window.location.href = `tel:${data?.sellerItem?.sellerAuth?.phoneNumber}`);
    }
  };
  const handleChat = () => {
    if (data) {
      navigate(`/chat`, { state: data });
    }
  };
  const handleCheckout = async () => {
    const productDetails = {
      name: data.sellerItem.itemName,
      amount: data.bidAmount,
      description: data.sellerItem.description,
      sellerId: data.sellerItem.sellerAuth.id,
    };
    const response = await API.post(
      `/checkout/${localStorage.getItem("role")}/${data.id}`,
      productDetails,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
        },
      }
    );
    if (response.status === 200 && response?.data?.data) {
      window.location.href = response.data.data;
    }
  };
  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const response = await API.get(`/singleHighestBid/${role}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        });

        if (response.status === 200 && response.data?.data) {
          const fetchedData = response.data.data;
          setData(fetchedData);

          if (fetchedData.sellerItem?.itemImages) {
            try {
              const parsedImages = JSON.parse(
                fetchedData.sellerItem.itemImages
              );
              setImages(parsedImages);
            } catch (error) {
              console.error("Error parsing images:", error);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchSingleData();
  }, [id, role]);
  useEffect(() => {
    if (socket) {
      socket.emit("sendStatus", id);
      socket.on("receivedStatus", (value) => {
        setPaymentStatus(value);
      });
    }
    return () => {
      if (socket) {
        socket.off("receivedStatus");
      }
    };
  }, [socket]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <>
      <div className="bg-[#f0f8ff] p-5">
        <div className="max-w-7xl mx-auto bg-white shadow-md h-max rounded-sm overflow-hidden p-5 sm:p-7 mt-8 mb-8">
          <div className="relative w-full bg-white p-3">
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex]}
                alt="itemImages"
                className="w-full h-56 sm:h-72 md:h-96 object-contain"
              />
            ) : (
              <div className="w-full h-56 sm:h-72 md:h-96 flex items-center justify-center text-gray-500">
                No Images Available
              </div>
            )}
            <button
              onClick={handlePreviousImage}
              className="absolute top-1/2 left-3 sm:left-5 md:left-9 transform -translate-y-1/2 shadow-sm shadow-black bg-white text-black p-2 rounded-full"
            >
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 sm:right-5 md:right-9 transform -translate-y-1/2 shadow-sm shadow-black bg-white text-black p-2 rounded-full"
            >
              &gt;
            </button>
          </div>

          <div className="p-4 flex flex-col md:flex-row w-full justify-between">
            <div className="w-full md:w-[50%] md:pl-14 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                Highest Bid: Rs{data.bidAmount}
              </h2>

              <p className="text-gray-600 text-sm md:text-base mb-4">
                <span className="italic font-bold">Item Name:</span>{" "}
                {data.sellerItem?.itemName}
              </p>

              <p className="text-gray-600 text-sm md:text-base mb-4">
                <span className="italic font-bold">Seller Name:</span>{" "}
                {data.sellerItem?.sellerAuth?.userName}
              </p>
            </div>

            <div className="w-full md:w-[50%]">
              <p className="text-gray-600 text-sm md:text-base mb-4">
                <span className="italic font-bold">Closing Date:</span>{" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </p>

              <p className="text-gray-600 text-sm md:text-base mb-4">
                <span className="italic font-bold">Description:</span>{" "}
                {data.sellerItem?.description}
              </p>

              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4 md:space-x-8">
                  <button
                    onClick={handleChat}
                    className="px-4 md:px-6 py-2 text-sm font-medium text-white bg-[#ff8749] rounded-md hover:bg-[#f6651a]"
                  >
                    Message
                  </button>
                  <button
                    onClick={handleCall}
                    className="px-4 md:px-6 py-2 text-sm font-medium text-white bg-[#ff8749] rounded-md hover:bg-[#f6651a]"
                  >
                    Call Now
                  </button>
                </div>
                {role === "bidder" ? (
                  paymentStatus === "success" ? (
                    <button
                      className="px-6 py-3 text-sm font-medium text-white bg-[#52b5b5] border border-white rounded-md cursor-not-allowed opacity-50"
                      disabled
                    >
                      Paid
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      className="px-6 py-3 text-sm font-medium text-white bg-[#52b5b5] border border-white rounded-md hover:bg-[#f6651a]"
                    >
                      Pay {(data.bidAmount / 132.27).toFixed(2)}
                    </button>
                  )
                ) : (
                  <h1>Payment Status: {paymentStatus || "pending"}</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HighestBid;
