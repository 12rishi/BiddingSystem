import React, { useState } from "react";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { Transition } from "@headlessui/react";

import { useDispatch, useSelector } from "react-redux";
import {
  handleEdit,
  setErrorMessage,
  setStatus,
  setSuccessMessage,
} from "../../../store/itemSlice";
import { useNavigate, useParams } from "react-router-dom";
import STATUS from "../../../status/status";
import Navbar from "../navbar/Navbar";
import { Footer } from "../footer/Footer";
import API from "../../http/axiosInstance";

const Edit = () => {
  const { id } = useParams();
  const { successMessage, errorMessage, status } = useSelector(
    (store) => store.itemslice
  );
  const { role } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === STATUS.SUCCESS && successMessage) {
      toast.success(successMessage);
      dispatch(setStatus(null));
      dispatch(setSuccessMessage(null));
      window.location.href = "/listItem";
    } else if (status === STATUS.ERROR && errorMessage) {
      toast.error(errorMessage);
      dispatch(setStatus(null));
      dispatch(setErrorMessage(null));
    }
  }, [status, successMessage, errorMessage, navigate, dispatch, role]);
  const [image, setImage] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "vehicle",
    description: "",
    startingPrice: "",
    location: "",
    delivery: "available",
    deliveryRadius: "",
    phoneNumber: "",
  });

  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const initialRender = async () => {
      const response = await API.get(
        `/item/${localStorage.getItem("role")}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jsonWebToken")}`,
          },
        }
      );
      setFormData(response?.data?.data);
    };
    initialRender();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    for (let i = 0; i < image.length; i++) {
      formdata.append("itemImages", image[i]);
    }

    dispatch(handleEdit(formdata, id));

    setSubmitted(true);
  };

  return (
    <>
      <div className="flex items-center justify-center py-3 min-h-screen bg-gray-100">
        <Transition
          show={!submitted}
          enter="transition-opacity duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl p-8 mx-4 bg-[#d2f5f9] rounded-lg shadow-lg md:p-12 space-y-6"
          >
            <h2 className="text-2xl font-bold text-[#008080] text-center">
              Start Listing Item
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder-shown:p-2"
                  placeholder="Item Name"
                  required
                />
              </div>

              <div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder-shown:p-2"
                  required
                >
                  <option value="vehicle">Vehicle</option>
                  <option value="clothing">Clothing</option>
                  <option value="collectable">Collectable</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
            </div>

            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder-shown:p-2"
                rows="4"
                placeholder="Description Here"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder-shown:p-2"
                  placeholder="Best price"
                  required
                  style={{ MozAppearance: "textfield" }} // Firefox specific styling
                />
              </div>

              <div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder-shown:p-2"
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xl font-medium text-[#008080]">
                Delivery
              </label>
              <div className="flex items-center mt-2 space-x-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="delivery"
                    value="available"
                    checked={formData.delivery === "available"}
                    onChange={handleChange}
                    className="border-gray-300 text-[#ff8749]" // Change color to match submit button
                    required
                  />
                  <span className="ml-2">Available</span>
                </label>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="delivery"
                    value="not-available"
                    checked={formData.delivery === "not-available"}
                    onChange={handleChange}
                    className="border-gray-300 text-[#ff8749]" // Change color to match submit button
                    required
                  />
                  <span className="ml-2">Not Available</span>
                </label>
              </div>
            </div>

            {formData.delivery === "available" && (
              <div>
                <label className="block text-xl font-medium text-[#008080]">
                  Delivery Radius (in km)
                </label>
                <input
                  type="number"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm  placeholder-shown:p-2"
                  placeholder="Enter delivery radius"
                  style={{ MozAppearance: "textfield" }} // Firefox specific styling
                />
              </div>
            )}

            <div>
              <label className="block text-xl font-medium text-[#008080]">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder-shown:p-2"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-[#008080]">
                Upload Product Photo
              </label>
              <input
                type="file"
                name="itemImages"
                onChange={handleFileChange}
                multiple
                className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-gray-500"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-[#ff8749] border border-white rounded-md hover:bg-[#f6651a]"
              >
                Update
              </button>
            </div>
          </form>
        </Transition>

        <Transition
          show={submitted}
          enter="transition-opacity duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-3xl font-bold text-gray-900">Thank You!</h3>
            <p className="mt-4 text-lg text-gray-700">
              Your item has been submitted successfully.
            </p>
          </div>
        </Transition>
      </div>

      <Footer />
    </>
  );
};

export default Edit;
