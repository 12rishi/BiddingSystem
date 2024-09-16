import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../http/axiosInstance";
import { FaCheckCircle } from "react-icons/fa";
const SuccessPayment = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  console.log(session_id);
  const id = searchParams.get("highestBidId");
  const role = localStorage.getItem("role");
  const handleClick = () => {
    window.location.href = `/bidderHome?role=bidder`;
  };
  useEffect(() => {
    const sendSessionId = async () => {
      const response = await API.get(`/session/${role}/${session_id}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
        },
      });
    };
    sendSessionId();
  }, [session_id, id]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-11/12 max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-green-100 rounded-full p-4 mb-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Payment Successful</h1>
          <button
            onClick={handleClick}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
