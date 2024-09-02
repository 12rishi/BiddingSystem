import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import { Footer } from "../../footer/Footer";

const NoItem = () => {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen ">
        <div className="hero-content text-center max-w- p-6 bg-white shadow-lg rounded-lg flex flex-col">
          <h1 className="text-3xl font-bold mb-4">
            Haven't Added Your First Item Yet? Let's Get Started!
          </h1>
          <p className="py-4 text-lg w-[50%]">
            You're just a few clicks away from showcasing your items to a wider
            audience! Adding your first item is quick and easy, and it's the
            perfect way to unlock new opportunities. Whether you're selling,
            trading, or simply sharing, your items deserve to be seen. Don't
            miss out—start now and let the world discover what you have to
            offer!
          </p>
          <Link to={"/addItem"}>
            <button className="btn bg-[#ff8749]">Start Selling</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NoItem;
