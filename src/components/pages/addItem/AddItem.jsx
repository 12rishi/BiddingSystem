import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleItemPost,
  setErrorMessage,
  setStatus,
  setSuccessMessage,
} from "../../../../store/itemSlice";
import Form from "./Form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import STATUS from "../../../../status/status";
import Navbar from "../../navbar/Navbar";
import { Footer } from "../../footer/Footer";

const AddItem = () => {
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

  const onSubmit = (data) => {
    dispatch(handleItemPost(data));
  };

  return (
    <>
      <Navbar />
      <Form onSubmit={onSubmit} />
      <Footer />
    </>
  );
};

export default AddItem;
