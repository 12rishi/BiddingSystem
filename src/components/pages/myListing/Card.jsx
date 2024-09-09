import React from "react";
import { Link } from "react-router-dom";
const Card = ({ data }) => {
  const role = localStorage.getItem("role");
  let itemImages = [];
  try {
    if (data.itemImages ? data.itemImages : data.sellerItem.itemImages) {
      itemImages = JSON.parse(
        data.itemImages ? data.itemImages : data.sellerItem.itemImages
      );
    }
  } catch (error) {
    console.log(error);
  }
  return (
    <Link
      to={
        role === "seller"
          ? `/item/${data.id} `
          : `/bidderListing/${data.sellerItem.id}`
      }
    >
      <div className="max-w-28 mx-auto  bg-white shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl sm:max-w-48 md:max-w-md lg:max-w-lg ">
        <div className="relative p-4">
          <span className="absolute left-0 top-[50%] bg-white text-black font-bold text-lg py-1 px-3 rounded-br-lg transform -translate-y-1/2 -translate-x-2 animate-none md:text-xl lg:text-2xl">
            {`Rs.${
              data.startingPrice
                ? data.startingPrice
                : data.sellerItem.startingPrice
            }`}
          </span>
          <img
            src={itemImages[0]}
            alt="image"
            loading="lazy"
            className="w-full h-48 object-cover rounded-lg md:h-56 lg:h-64 "
          />
        </div>
        <div className="p-4 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 md:text-2xl lg:text-3xl">
            {data.itemName ? data.itemName : data.sellerItem.itemName}
          </h2>
          <p className="text-gray-600 md:text-lg lg:text-xl">
            {data.category ? data.category : data.sellerItem.category}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
