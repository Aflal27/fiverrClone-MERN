import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBtn2 } from "../redux/slices/toggles";
import { Spinner } from "flowbite-react";
import axios from "axios";

export default function MsgCard({
  frd,
  index,
  setClickUser,
  loading,
  setConverstionID,
}) {
  const dispatch = useDispatch();
  const { msgToggle } = useSelector((state) => state.toggleState);
  console.log(msgToggle);
  const { currentUser } = useSelector((state) => state.userState);

  const handleCard = async (frd) => {
    dispatch(toggleBtn2(true));
    setClickUser(frd);

    try {
      const { data } = await axios.get(
        `/api/conver/get/${frd._id}/${currentUser._id}`
      );
      setConverstionID(data._id);
      console.log(data);
    } catch (error) {
      console.log("msgMainBodyConverstionGetError", error);
    }
  };
  if (loading) {
    <Spinner className=" w-full h-full flex items-center justify-center" />;
  }
  return (
    <div
      onClick={() => handleCard(frd)}
      key={index}
      className=" p-2 border-b border-slate-500 hover:shadow-2xl cursor-pointer">
      <div className=" flex items-center gap-2">
        <img
          src={frd?.image}
          alt="image"
          className=" w-10 h-10 rounded-full object-cover"
        />
        <div className="">
          <h4 className=" text-sm font-semibold">{frd?.username}</h4>
          <span className=" text-xs text-gray-400  ">{frd?.email}</span>
        </div>
      </div>
    </div>
  );
}
