import React, { useEffect, useState } from "react";
import CartGig from "./CartGig";
import axios from "axios";
import { useSelector } from "react-redux";

export default function MyGig() {
  const [fetchGigError, setFetchGigError] = useState(null);
  const [gigsData, setGigsData] = useState([]);
  const { currentUser } = useSelector((state) => state.userState);

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const { data } = await axios.get(`/api/gig/getgig/${currentUser._id}`);
        setGigsData(data);
      } catch (error) {
        console.log(error);
        setFetchGigError(error.response.data);
      }
    };
    fetchGigData();
  }, [currentUser._id]);
  return (
    <div className=" p-3 h-full flex flex-col gap-3 sm:flex-row  flex-wrap">
      {gigsData.map((gig, index) => (
        <CartGig key={index} gig={gig} />
      ))}
    </div>
  );
}
