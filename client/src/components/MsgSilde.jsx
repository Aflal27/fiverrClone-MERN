import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MsgCard from "./MsgCard";
import { Spinner } from "flowbite-react";

export default function MsgSilde({ setClickUser, setConverstionID }) {
  const { currentUser } = useSelector((state) => state.userState);
  const [userFrd, setUserFrd] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/msg/getFrd/${currentUser._id}`);
        setUserFrd(data);
        setLoading(false);
      } catch (error) {
        console.log("getFrdError", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className=" flex flex-col gap-2 ">
      {loading && (
        <Spinner className=" flex items-center justify-center mx-auto    " />
      )}
      {userFrd.map((frd, i) => (
        <MsgCard
          loading={loading}
          setClickUser={setClickUser}
          frd={frd}
          index={i}
          setConverstionID={setConverstionID}
        />
      ))}
    </div>
  );
}
