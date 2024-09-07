import React, { useEffect, useState } from "react";
import API from "../../../../http/axiosInstance";
import Navbar from "../../../navbar/Navbar";
import { Footer } from "../../../footer/Footer";
import Card from "./Card";
import NoItem from "../../../pages/myListing/NoItem";

const BidderHome = () => {
  const [itemData, setItemData] = useState([]);
  const [biddingTime, setBiddingTime] = useState(true);
  const [timingSet, setTimingSet] = useState("");
  useEffect(() => {
    const time = new Date().getHours();
    setTimingSet(time);
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
        setItemData(response?.data?.data);
      }
      if (response.status === 404) {
        setBiddingTime(false);
      }
    };
    renderItem();
  }, []);
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-3 gap-y-10 gap-x-6 p-8">
        {itemData && itemData.length > 0 ? (
          itemData.map((data) => {
            return <Card data={data} />;
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
