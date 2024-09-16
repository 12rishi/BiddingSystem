import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { Footer } from "../footer/Footer";
import API from "../../http/axiosInstance";
import Spinner from "../spinner/Spinner";

const SellerCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [profilePicture, setProfilePicture] = useState();

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setProfilePicture(file);

    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const response = await API.post(
          `/profilePicture/${localStorage.getItem("role")}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
            },
          }
        );

        console.log(response);

        if (response.status === 200) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error("Error uploading profile picture", error);
      }
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      const response = await API.get(
        `/singleProfile/${localStorage.getItem("role")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setProfileData(response.data.data);
      }
    };
    getProfile();
  }, []);

  return (
    <>
      {profileData ? (
        <div className="flex items-center justify-center bg-[#f0f8ff] h-screen">
          <div className="bg-[#d2f5f9] p-8 h-auto rounded-lg shadow-lg w-96 ">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-32 h-32 border-2 border-[#ff8749] bg-gray-200 rounded-full  flex items-center justify-center relative">
                    {profileData?.profilePicture ? (
                      <img
                        src={profileData?.profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-3xl">+</span>
                    )}
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              <div className="space-y-10 text-xl flex flex-col items-center">
                <h2 className="text-2xl font-semibold  mt-6  mb-2">
                  Name:{profileData.userName}
                </h2>
                <p className="text-gray-600 mb-2">
                  Phone: {profileData?.phoneNumber}
                </p>
                <p className="text-gray-600 mb-2">
                  Email: {profileData?.email}
                </p>

                <button className="bg-[#ff8749] text-white px-4 py-2  rounded hover:bg-orange-600">
                  Edit profile
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}

      <Footer />
    </>
  );
};

export default SellerCard;
