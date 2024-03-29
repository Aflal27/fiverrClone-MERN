import React, { useEffect, useState } from "react";
import CartGig from "./CartGig";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function MyGig() {
  const [fetchGigError, setFetchGigError] = useState(null);
  const [gigsData, setGigsData] = useState([]);
  const { currentUser } = useSelector((state) => state.userState);
  const [showModal, setshowModal] = useState(false);
  const [gigId, setGigId] = useState(null);
  console.log(showModal);

  // console.log(gigId);

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

  const handleDelete = async () => {
    try {
      setGigsData(gigsData.filter((gig) => gig._id !== gigId));
      const { data } = await axios.delete(
        `/api/gig/deletegig/${currentUser._id}/${gigId}`
      );
      console.log(data);
      setshowModal(false);
    } catch (error) {
      console.log("gigDlt", error);
    }
  };

  return (
    <div className="">
      {gigsData && gigsData.length > 0 ? (
        <>
          <div className=" p-3 h-full flex flex-col gap-3 sm:flex-row  flex-wrap">
            {gigsData.map((gig, index) => (
              <CartGig
                setshowModal={setshowModal}
                setGigId={setGigId}
                key={index}
                gig={gig}
              />
            ))}
          </div>
          <Modal
            show={showModal}
            onClose={() => setshowModal(false)}
            popup
            size="md">
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className=" h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto " />
                <div className=" text-lg text-gray-500 dark:text-gray-400">
                  <h3>Are you sure you want to delete your Gig?</h3>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <Button color="failure" onClick={handleDelete}>
                    Yes.I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setshowModal(!showModal)}>
                    No,cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p className=" text-2xl text-center m-5 "> Gig Not found! </p>
      )}
    </div>
  );
}
