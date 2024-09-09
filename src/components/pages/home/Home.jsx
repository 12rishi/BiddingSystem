import React, { useEffect } from "react";
import Navbar from "../../navbar/Navbar";
import { Footer } from "../../footer/Footer";
import DescriptionCard from "./card/DescriptionCard";
import { Card } from "./card/Card";
import Dollar from "./Dollar.png";
import Flow from "./Flow.png";
import Hammer from "./Hammer.png";
import Linking from "./Linking.png";
import Clock from "./Clock.png";
import { useSocket } from "../../../../Socket/SocketContext";
import API from "../../../http/axiosInstance";

export const Home = () => {
  useEffect(() => {
    const homeFetch = async () => {
      await API.get(`/home/${localStorage.getItem("role")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
        },
      });
    };
    homeFetch();
  }, []);
  return (
    <>
      <Navbar />
      <div className="bg-[#f0f8ff] p-2">
        <DescriptionCard />

        <div className="flex flex-col items-center mt-8 p-4">
          <h2 className="text-3xl font-bold mb-4 text-[#008080]">
            Why Thrift Heaven?
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-screen-lg">
            <Card text={"Wide Audience Reach"} desImage={Linking} />
            <Card text={"Competitive Fees"} desImage={Dollar} />
            <Card text={"Simple Listing Process"} desImage={Hammer} />
            <Card text={"Dedicated Support"} desImage={Clock} />
          </div>

          <h2 className="text-3xl font-bold mb-4 text-[#008080] mt-28">
            How It Works?
          </h2>
          <div className="flex justify-center mt-4">
            <img
              src={Flow}
              alt="Flow diagram"
              className="max-w-[80%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%] xl:max-w-[80%]"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
