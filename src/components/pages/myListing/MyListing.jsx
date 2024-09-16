import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  renderItem,
  setErrorMessage,
  setStatus,
  setSuccessMessage,
} from "../../../../store/itemSlice";
import Navbar from "../../navbar/Navbar";
import Card from "./Card";
import { toast } from "react-toastify";
import STATUS from "../../../../status/status";
import { Footer } from "../../footer/Footer";
import NoItem from "./NoItem";

const MyListing = () => {
  const [listData, setListData] = useState([]);
  const { errorMessage, successMessage, itemData, status } = useSelector(
    (store) => store.itemslice
  );
  const [visibleItems, setVisibleItems] = useState(9); // Initially show 9 items
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(renderItem());
  }, [dispatch]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && successMessage) {
      if (itemData && itemData.length > 0) {
        setListData(itemData);
      }
      dispatch(setStatus(null));
      dispatch(setSuccessMessage(null));
    } else if (status === STATUS.ERROR && errorMessage) {
      dispatch(setStatus(null));
      dispatch(setErrorMessage(null));
    }
  }, [status, successMessage, errorMessage, dispatch, itemData]);

  const handleSeeMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 6);
  };

  return (
    <div>
      {listData.length === 0 ? (
        <NoItem />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 p-8">
            {listData.slice(0, visibleItems).map((data) => (
              <Card key={data.id} data={data} />
            ))}
          </div>

          {visibleItems < listData.length && (
            <div className="text-center mt-4 p-11">
              <button
                onClick={handleSeeMore}
                className="bg-[#ff8749] text-white px-4 py-2 rounded hover:bg-[#e26526]"
              >
                See More
              </button>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyListing;
