import React, { useEffect, useRef, useState } from "react";
import API from "../../../../http/axiosInstance";
import Navbar from "../../../navbar/Navbar";
import { Footer } from "../../../footer/Footer";
import Card from "./Card";
import NoItem from "../../../pages/myListing/NoItem";

const BidderHome = () => {
  const [itemData, setItemData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [image, setImage] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const searchResult = itemData.filter((data) =>
      data.itemName.toLowerCase().startsWith(value)
    );
    setFilteredItems(searchResult);
  };

  const handleCategory = (e) => {
    const value = e.target.value;

    if (value === "All Categories") {
      setFilteredItems(itemData);
    } else {
      const sortingValue = itemData.filter((data) => data.category === value);
      setFilteredItems(sortingValue);
    }
  };

  useEffect(() => {
    const renderItem = async () => {
      const response = await API.get(
        `/bidderItems/${localStorage.getItem("role")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setItemData(response.data.data);
        if (response.data.data?.itemImages) {
          const itemImage = JSON.parse(response.data.data.itemImages);
          setImage(itemImage);
        }
        setFilteredItems(response.data.data);
      }
    };

    renderItem();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center m-10">
        <form className="flex w-full max-w-md" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full h-11 rounded-3xl rounded-r-none border border-gray-300 bg-white py-2 pl-10 pr-3 shadow-lg focus:outline-none sm:text-sm"
              placeholder="I'm looking for..."
            />
          </div>
          <select
            className="block w-auto rounded-3xl rounded-l-none border border-gray-300 bg-white py-2 p-3 shadow-lg focus:outline-none sm:text-sm"
            defaultValue="All Categories"
            onChange={handleCategory}
          >
            <option value="All Categories">All Categories</option>
            <option value="clothing">Clothing</option>
            <option value="vehicle">Vehicle</option>
            <option value="collectable">Collectable</option>
            <option value="suite">Suite</option>
          </select>
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border-2 border-white rounded-3xl shadow-lg text-base font-medium text-white bg-[#52b5b5] hover:bg-[#309f9f] focus:outline-none"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-y-10 gap-x-6 p-8">
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((data) => {
            return <Card key={data.id} data={data} />;
          })
        ) : (
          <NoItem />
        )}
      </div>

      <Footer />
    </>
  );
};

export default BidderHome;
