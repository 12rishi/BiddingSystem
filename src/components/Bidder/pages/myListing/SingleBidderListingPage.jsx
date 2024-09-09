import React, { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import Navbar from "../../../navbar/Navbar";
import API from "../../../../http/axiosInstance";
import { Footer } from "../../../footer/Footer";

const SingleBidderListingPage = () => {
  const [data, setData] = useState({});

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [bidders, setBidders] = useState([]);

  const { id } = useParams();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchSingleItem = async () => {
      try {
        const response = await API.get(`/singleBidderItem/${role}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        });
        console.log(response.data.data);
        if (response?.data?.data) {
          setData(response.data.data);
          const itemImage = JSON.parse(
            response.data.data.sellerItem.itemImages
          );
          setImages(itemImage);
        }
      } catch (error) {
        console.error("Error fetching the item:", error);
      }
    };
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
          <div className="max-w-7xl mx-auto bg-white shadow-md h-max rounded-sm overflow-hidden p-7 mt-11 mb-10">
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
                className="absolute top-1/2 right-9 transform -translate-y-1/2 shadow-sm shadow-black bg-white text-black p-2 rounded-full"
              >
                &gt;
              </button>
            </div>

            <div className="p-4 flex w-[100%] justify-between">
              <div className="w-[50%] pl-14 ">
                <h2 className="text-3xl font-semibold mb-2">
                  {data?.sellerItem?.itemName ? data.sellerItem.itemName : ""}
                </h2>

                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Bidding Amount:</span>:
                  {`Rs.${data.biddingprice}` || "200"}
                </p>

                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Description</span> :{" "}
                  {data?.sellerItem?.description
                    ? data.sellerItem.description
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Bid Date:</span>:{" "}
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="italic font-bold">Starting Price:</span>:{" "}
                  {data?.sellerItem?.startingPrice
                    ? data.sellerItem.startingPrice
                    : ""}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SingleBidderListingPage;
