import React, { useState, useEffect } from "react";
import Navbar from "../../navbar/Navbar";
import { Footer } from "../../footer/Footer";
import { Link, useParams } from "react-router-dom";
import API from "../../../http/axiosInstance";

const SinglePageitem = () => {
  const [data, setData] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [timeDiff, setTimeDiff] = useState("");
  const [dbTime, setDbTime] = useState("");
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { id } = useParams();

  const fetchSingleItem = async () => {
    try {
      const response = await API.get(`/item/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
        },
      });

      if (response?.data?.data) {
        setData(response.data.data);
        const itemImage = JSON.parse(response.data.data.itemImages);
        setImages(itemImage);

        const createdAt = new Date(response.data.data.createdAt);

        // Extract hours from createdAt and current time
        const dbHours = createdAt.getHours();
        setDbTime(dbHours);

        const currentHours = new Date().getHours();
        setCurrentTime(currentHours);

        // Calculate the time difference
        const diff = currentHours - dbHours;
        setTimeDiff(diff);

        // Check if the dates are the same
        const currentDate = new Date();
        const sameDate =
          currentDate.getDate() === createdAt.getDate() &&
          currentDate.getMonth() === createdAt.getMonth() &&
          currentDate.getFullYear() === createdAt.getFullYear();

        // Check if the conditions meet to show the Edit button
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

  return (
    <>
      <Navbar />
      <div className="bg-[#f0f8ff] p-5">
        {data && (
          <div className="max-w-7xl mx-auto bg-white   shadow-md h-max rounded-sm overflow-hidden p-7 mt-11 mb-10">
            {/* Image Container */}
            <div className="relative w-full bg-white p-3">
              {images.length > 0 && (
                <img
                  src={images[currentImageIndex]}
                  alt={`Item Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-contain"
                />
              )}
              <button
                onClick={handlePreviousImage}
                className="absolute top-1/2 left-9 transform -translate-y-1/2 shadow-sm shadow-black bg-white text-black p-2 rounded-full"
              >
                &lt;
              </button>
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 right-9 transform -translate-y-1/2 shadow-sm shadow-black bg-white   text-black p-2 rounded-full"
              >
                &gt;
              </button>
            </div>

            {/* Description Container */}
            <div className="p-4 flex w-[100%] justify-between">
              <div className="w-[50%] pl-14 ">
                <h2 className="text-3xl font-semibold mb-2">
                  {data.itemName || "Item Name"}
                </h2>

                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">StartingPrice</span>:
                  {`Rs.${data.startingPrice}` || "200"}
                </p>

                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Description</span> :{" "}
                  {data.description}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Shipping Date</span>:{" "}
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">BiddingStatus</span>:{" "}
                  {data.availableForBidding}
                </p>
                <div className="flex space-y-4 flex-col">
                  {data.showEditButton ? (
                    <Link to={`/edit/${data.id}`}>
                      {" "}
                      <button className="bg-[#ff8749] text-white py-2 px-4 rounded">
                        Edit Listing
                      </button>
                    </Link>
                  ) : null}

                  {data.availableForBidding === "completed" ? (
                    <button className="bg-[#ff8749] text-white py-2 px-4 rounded">
                      Relaunch Auction
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SinglePageitem;
