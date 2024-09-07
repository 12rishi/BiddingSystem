import React, { useState, useEffect } from "react";
import Navbar from "../../navbar/Navbar";
import { Footer } from "../../footer/Footer";
import { Link, useParams } from "react-router-dom";
import API from "../../../http/axiosInstance";
import { useSocket } from "../../../../Socket/SocketContext";

const SingleBidderItem = () => {
  const socket = useSocket();
  const [data, setData] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [timeDiff, setTimeDiff] = useState("");
  const [dbTime, setDbTime] = useState("");
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBidButton, setShowBidButton] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const { id } = useParams();

  const fetchSingleItem = async () => {
    try {
      const response = await API.get(
        `/item/${localStorage.getItem("role")}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        }
      );

      if (response?.data?.data) {
        setData(response.data.data);
        const itemImage = JSON.parse(response.data.data.itemImages);
        setImages(itemImage);

        const createdAt = new Date(response.data.data.createdAt);

        const dbHours = createdAt.getHours();
        setDbTime(dbHours);

        const currentHours = new Date().getHours();
        setCurrentTime(currentHours);

        const diff = currentHours - dbHours;
        setTimeDiff(diff);
      }
    } catch (error) {
      console.error("Error fetching the item:", error);
    }
  };

  const timingfunction = () => {
    if (currentTime >= 9 && currentTime < 21) {
      setShowBidButton(true);
    }
  };

  useEffect(() => {
    fetchSingleItem();
  }, []);

  useEffect(() => {
    timingfunction();
  }, [currentTime]);

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

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const obj = {
      data: data,
      biddingAmount: bidAmount,
    };
    socket.emit("biddingAmount", obj);
    setShowInput(false);
  };

  const handleBidAmountChange = (e) => {
    e.preventDefault();
    setBidAmount(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#f0f8ff] p-5">
        {data && (
          <div className="max-w-7xl mx-auto bg-white shadow-md h-max rounded-sm p-7 mt-11 mb-10">
            {/* Image Container */}
            <div className="w-full bg-white p-3 flex justify-center mb-10">
              {images.length > 0 && (
                <div className="relative w-3/5">
                  <img
                    src={images[currentImageIndex]}
                    alt={`Item Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-contain"
                  />
                  <button
                    onClick={handlePreviousImage}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 shadow-sm shadow-black bg-white text-black p-2 rounded-full"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 shadow-sm shadow-black bg-white text-black p-2 rounded-full"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Containers */}
            <div className="flex justify-center gap-x-16  space-x-4">
              {/* Item Description Container */}
              <div className="w-1/3 bg-[#f0f8ff] p-5 rounded-md shadow-sm hover:shadow-lg">
                <h2 className="text-3xl font-semibold mb-2">
                  {data.itemName || "Item Name"}
                </h2>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Starting Price</span>:{" "}
                  {`Rs.${data.startingPrice}` || "200"}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Description</span>:{" "}
                  {data.description}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Shipping Date</span>:{" "}
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Bidding Status</span>:{" "}
                  {data.availableForBidding ? "Available" : "Not Available"}
                </p>
              </div>

              {/* Bidding Option Container */}
              <div className="w-1/3 bg-[#f0f8ff] p-5 rounded-md shadow-sm hover:shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">
                  {data.itemName || "Item Name"}
                </h2>

                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Current Bid</span>:{" "}
                  {data.currentBid || "No bids yet"}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Ending Soon</span>:{" "}
                  {data.endingSoon ? "Yes" : "No"}
                </p>

                {showInput === false ? (
                  <button
                    onClick={() => setShowInput(true)}
                    className="bg-[#ff8749] text-white py-2 px-4 rounded w-full mb-4"
                  >
                    Place Bid
                  </button>
                ) : (
                  <form onSubmit={handleBidSubmit} className="space-y-4">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={handleBidAmountChange}
                      placeholder="Enter your bid amount"
                      className="border p-2 rounded w-full"
                      required
                    />
                    <div className="flex justify-between space-x-4">
                      <button
                        type="submit"
                        className="bg-[#ff8749] hover:bg-orange-500 text-white py-2 px-4 rounded"
                      >
                        Place Bid
                      </button>
                      <button
                        type="button"
                        className="bg-[#66b2b2] hover:bg-[#52bfbf] text-white py-2 px-4 rounded"
                      >
                        Send Message
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInput(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded w-full"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SingleBidderItem;
