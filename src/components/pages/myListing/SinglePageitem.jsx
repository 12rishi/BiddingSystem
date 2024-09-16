import React, { useState, useEffect } from "react";
import Navbar from "../../navbar/Navbar";
import { Footer } from "../../footer/Footer";
import { Link, useParams } from "react-router-dom";
import API from "../../../http/axiosInstance";
import { useSocket } from "../../../../Socket/SocketContext";

const SinglePageitem = () => {
  const [data, setData] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [timeDiff, setTimeDiff] = useState("");
  const [dbTime, setDbTime] = useState("");
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBiddingTable, setShowBiddingTable] = useState(false);
  const [bidders, setBidders] = useState([]);

  const { id } = useParams();
  const socket = useSocket();

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

        const currentDate = new Date();
        const sameDate =
          currentDate.getDate() === createdAt.getDate() &&
          currentDate.getMonth() === createdAt.getMonth() &&
          currentDate.getFullYear() === createdAt.getFullYear();

        if (diff <= 1 && sameDate) {
          setData((prevState) => ({
            ...prevState,
            showEditButton: true,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching the item:", error);
    }
  };

  useEffect(() => {
    fetchSingleItem();
  }, []);

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

  const handleViewBidding = () => {
    setShowBiddingTable(true);
  };

  const handleCancelBidding = () => {
    setShowBiddingTable(false);
  };

  useEffect(() => {
    if (socket && id) {
      socket.emit("sendBiddingData", id);
    }
  }, [socket, id]);

  useEffect(() => {
    if (socket) {
      socket.on("fetchBiddingData", (data) => {
        if (data.length > 0) {
          setBidders(data);
          console.log(data, data.length);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("fetchBiddingData");
      }
    };
  }, [socket]);

  return (
    <>
      <div className="bg-[#f0f8ff] p-4 md:p-6 lg:p-8">
        {data && (
          <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-4 md:p-6 lg:p-8 mt-8 mb-8">
            <div className="relative w-full bg-white p-2 md:p-4">
              {images.length > 0 && (
                <img
                  src={images[currentImageIndex]}
                  alt={`Item Image ${currentImageIndex + 1}`}
                  className="w-full h-64 object-contain md:h-80 lg:h-96"
                  loading="lazy"
                />
              )}
              <button
                onClick={handlePreviousImage}
                className="absolute top-1/2 left-4 md:left-6 lg:left-8 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
              >
                &lt;
              </button>
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 right-4 md:right-6 lg:right-8 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
              >
                &gt;
              </button>
            </div>

            <div className="p-4 md:p-6 flex flex-col lg:flex-row justify-between">
              <div className="lg:w-1/2 lg:pl-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
                  {data.itemName || "Item Name"}
                </h2>
                <p className="text-gray-600 mb-4 text-lg md:text-xl">
                  <span className="italic font-bold">Starting Price:</span>{" "}
                  {`Rs.${data.startingPrice}` || "200"}
                </p>
                <p className="text-gray-600 mb-4 text-lg md:text-xl">
                  <span className="italic font-bold">Description:</span>{" "}
                  {data.description}
                </p>
              </div>
              <div className="lg:w-1/2 lg:pl-8">
                <p className="text-gray-600 mb-4 text-lg md:text-xl">
                  <span className="italic font-bold">Shipping Date:</span>{" "}
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-600 mb-4 text-lg md:text-xl">
                  <span className="italic font-bold">Bidding Status:</span>{" "}
                  {data.availableForBidding}
                </p>
                <div className="flex flex-col space-y-4">
                  {data.showEditButton && (
                    <Link to={`/edit/${data.id}`}>
                      <button className="bg-[#ff8749] text-white py-2 px-4 rounded-md text-lg md:text-xl">
                        Edit Listing
                      </button>
                    </Link>
                  )}

                  {data.availableForBidding === "completed" && (
                    <button className="bg-[#ff8749] text-white py-2 px-4 rounded-md text-lg md:text-xl">
                      Relaunch Auction
                    </button>
                  )}

                  {data.availableForBidding === "available" &&
                    !showBiddingTable && (
                      <button
                        onClick={handleViewBidding}
                        className="bg-[#ff8749] text-white py-2 px-4 rounded-md text-lg md:text-xl"
                      >
                        View Bidding
                      </button>
                    )}

                  {showBiddingTable && (
                    <button
                      onClick={handleCancelBidding}
                      className="bg-red-500 text-white py-2 px-4 rounded-md text-lg md:text-xl"
                    >
                      Hide Bidding Details
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showBiddingTable && bidders.length > 0 && (
              <div className="mt-6 border border-black w-full lg:w-3/4 mx-auto">
                <table className="min-w-full bg-[#d2f5f9] text-sm md:text-base">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-r border-black font-bold">
                        Bidder Name
                      </th>
                      <th className="py-2 px-4 font-bold">Bid Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidders.map((bidder, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-t border-r border-black text-black">
                          {bidder.buyerAuth.userName}
                        </td>
                        <td className="py-2 px-4 border-t border-black text-black">
                          Rs.{bidder.biddingprice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SinglePageitem;
