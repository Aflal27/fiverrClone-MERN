import React, { useEffect, useRef, useState } from "react";
import { BiCategoryAlt } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Alert, Button, Modal, Table, TextInput } from "flowbite-react";
import { CiTimer } from "react-icons/ci";
import { BiRevision } from "react-icons/bi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { FaFileImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { IoIosDocument } from "react-icons/io";
import { useSelector } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";

export default function SingleGig() {
  const { currentUser } = useSelector((state) => state.userState);

  const { gigId } = useParams();
  const fileRef = useRef();
  const imageRef = useRef();
  const [gigData, setgigData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [uploadFileProgress, setUploadFileProgress] = useState(null);
  const [fileError, setFileError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [handleBtn, setHandleBtn] = useState({
    base: true,
    silver: false,
    platinum: false,
  });
  const [read1, setRead1] = useState(false);
  const [read2, setRead2] = useState(false);
  const [msgState, setMsgState] = useState("text");
  const [txtMsg, setTxtMsg] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);
  const [converModal, setConverModal] = useState(false);
  const [converData, setConverData] = useState(null);

  useEffect(() => {
    setImageUrl(null);
    if (file) {
      if (file.size > 5000000) {
        setFileError("Could not upload image (file must be less then 5mb");
        return;
      }
      uploadFile();
    }
  }, [file]);

  useEffect(() => {
    setDocUrl(null);
    if (imageFile) {
      if (file?.size > 2000000) {
        setFileError("Could not upload image (file must be less then 2mb");
        return;
      }
      uploadImage();
    }
  }, [imageFile]);

  const handleBtnFun = (prop) => {
    if (prop === "base") {
      setHandleBtn({
        base: true,
        silver: false,
        platinum: false,
      });
    }
    if (prop === "silver") {
      setHandleBtn({
        base: false,
        silver: true,
        platinum: false,
      });
    }
    if (prop === "platinum") {
      setHandleBtn({
        base: false,
        silver: false,
        platinum: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/gig/getsinglegig/${gigId}`);
        setgigData(data);
        setLoading(false);
      } catch (error) {
        console.log("getSingleGigError", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [gigId]);

  useEffect(() => {
    const fetchData = async () => {
      let senderId = currentUser._id;
      let reciverId = gigData.userId._id;
      const { data } = await axios.get(
        `/api/conver/get/${senderId}/${reciverId}`
      );
      setConverData(data);
    };
    fetchData();
  }, []);
  console.log(converData);

  SwiperCore.use([Navigation]);

  if (loading) {
    return (
      <div className=" flex items-center justify-center min-h-screen w-screen">
        {loading && <Spinner />}
      </div>
    );
  }

  const uploadFile = () => {
    // setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadFileProgress(progress.toFixed(0));
      },
      (error) => {
        console.log(error);
        // reject(error);
        // setImageUploadError(
        //   "Could not upload image (file must be less then 2mb)"
        // );
        setFile(null);
        // setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          // setImageFileUrl(downloadUrl);
          console.log(downloadUrl);
          setDocUrl(downloadUrl);
          setImageUrl(null);
          setMsgState("doc");
        });
      }
    );
  };
  const uploadImage = () => {
    // setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadFileProgress(progress.toFixed(0));
      },
      (error) => {
        console.log(error);
        // reject(error);
        // setImageUploadError(
        //   "Could not upload image (file must be less then 2mb)"
        // );
        setImageFile(null);
        // setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          // setImageFileUrl(downloadUrl);
          console.log(downloadUrl);
          setImageUrl(downloadUrl);
          setDocUrl(null);
          setMsgState("image");
        });
      }
    );
  };
  const handleFile = (e) => {
    setFileError("");

    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };
  const handleImage = (e) => {
    setFileError("");
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleCoverstion = async () => {
    try {
      setConverModal(false);
      setMsgLoading(true);
      const { data } = await axios.post("/api/conver/create", {
        senderId: currentUser._id,
        reciverId: gigData?.userId._id,
      });
      console.log(data);
      setMsgLoading(false);
    } catch (error) {
      console.log("coverstionError", error);
      setMsgLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      setMsgLoading(true);

      if (txtMsg || imageUrl || docUrl) {
        const { data } = await axios.post("/api/msg/create", {
          senderId: currentUser._id,
          recepientId: gigData?.userId._id,
          messageType: msgState,
          converstionID: converData?._id,
          message: txtMsg,
          imageUrl,
          docUrl,
        });
        console.log(data);
        setMsgLoading(false);
      } else {
        setFileError("please fill message!");
        setMsgLoading(false);
      }
    } catch (error) {
      console.log("sendMsError", error);
      setMsgLoading(false);
    }
  };

  const handleTxt = (e) => {
    setTxtMsg(e.target.value);
  };

  return (
    <>
      <div className=" max-w-6xl mx-auto p-4 lg:flex gap-5">
        {/* section 1 */}
        <div className=" flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2">
            <BiCategoryAlt />
            <span className=" text-xs">{gigData?.category}</span>
          </div>
          <div className="">
            <h2 className=" text-xl sm:text-2xl font-semibold">
              {gigData?.title}
            </h2>
          </div>

          <div className=" flex items-center gap-3">
            <img
              className=" w-12 h-12 rounded-full "
              src={gigData?.userId.image}
              alt="profile"
            />
            <div className="">
              <div className=" flex items-center gap-3">
                <span className=" font-bold">{gigData?.userId.username}</span>
                <span className=" border h-3"></span>
                <span>{gigData?.userId.level}</span>
              </div>

              <div className=" flex items-center gap-1">
                <FaStar />
                <span>4.8</span>
              </div>
              <div className="">
                <span>{gigData?.userId.country}</span>
              </div>
            </div>
          </div>

          <div className="">
            <div className="">
              <div className="">
                <p className={` ${read1 ? " line-clamp-0" : "line-clamp-2"} `}>
                  {gigData?.userId.description}
                </p>
                <span
                  className="hover:cursor-pointer text-sm text-blue-500"
                  onClick={() => setRead1(!read1)}>
                  Readmore...
                </span>
              </div>
              <p className=" flex  items-center gap-3 mt-3">
                {gigData?.userId.skills.map((s) => (
                  <span className=" bg-slate-300 p-2 rounded-lg dark:bg-slate-500">
                    {s}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className=" flex flex-col gap-3">
            <h3 className=" text-lg font-bold ">About this Gig</h3>
            <span>{gigData?.title}</span>
            <div className="">
              <span className={` ${read2 ? " line-clamp-0" : "line-clamp-2"} `}>
                {gigData?.descriptiion}
              </span>
              <span
                className=" hover:cursor-pointer text-sm text-blue-500"
                onClick={() => setRead2(!read2)}>
                Readmore...
              </span>
            </div>
            {/* swiper */}
            <div className="w-full md:max-w-xl mt-4">
              <Swiper navigation>
                {gigData?.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      className=" w-[600px] h-[250px] object-cover hover:scale-110 transition-all duration-300"
                      alt="img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="">
            <h3 className=" font-bold text-lg">Reviews</h3>
            <span>ratiing</span>
          </div>

          <div className="">
            <h3 className=" text-lg font-bold">Commands</h3>
          </div>
        </div>
        {/* section 2 */}
        <div className=" flex-1 border-t mt-6 sm:border-none ">
          <Table className=" mt-2">
            <Table.Head className="">
              <Table.HeadCell className="  flex items-center justify-between">
                <Button
                  className=" "
                  gradientDuoTone="purpleToBlue"
                  onClick={() => {
                    // setBasic(true);
                    // setStand(false);
                    // setPlatinum(false);
                    handleBtnFun("base");
                  }}>
                  Basic
                </Button>

                <span className=" border border-r h-10"></span>

                <Button
                  gradientDuoTone="purpleToBlue"
                  onClick={() => {
                    // setBasic(false);
                    // setStand(true);
                    // setPlatinum(false);
                    handleBtnFun("silver");
                  }}>
                  Standard
                </Button>
                <span className=" border border-r h-10"></span>

                <Button
                  gradientDuoTone="purpleToBlue"
                  onClick={() => {
                    // setBasic(false);
                    // setStand(false);
                    // setPlatinum(true);
                    handleBtnFun("platinum");
                  }}>
                  Primium
                </Button>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className=" border border-gray-200 dark:border-gray-700 ">
              <Table.Row>
                <Table.Cell className=" w-full flex justify-between">
                  <span className=" text-lg  font-semibold uppercase">
                    {handleBtn.base && gigData?.base.baseTitle}
                    {handleBtn.silver && gigData?.silver.silverTitle}
                    {handleBtn.platinum && gigData?.platinum.platinumTitle}
                  </span>
                  <span className=" text-lg font-semibold">
                    {handleBtn.base && (
                      <span>${handleBtn.base && gigData?.base.basePrice}</span>
                    )}
                    {handleBtn.silver && (
                      <span>
                        ${handleBtn.silver && gigData?.silver.silverPrice}
                      </span>
                    )}
                    {handleBtn.platinum && (
                      <span>
                        ${handleBtn.platinum && gigData?.platinum.platinumPrice}
                      </span>
                    )}
                  </span>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <p className="">
                    {handleBtn.base && gigData?.base.baseDescription}

                    {handleBtn.silver && gigData?.silver.silverDescription}

                    {handleBtn.platinum &&
                      gigData?.platinum.platinumDescription}
                  </p>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className=" flex items-center gap-3">
                  <div className=" flex items-center gap-1">
                    <CiTimer />
                    {handleBtn.base && (
                      <span>
                        {handleBtn.base && gigData?.base.baseDays} Day Delivery
                      </span>
                    )}
                    {handleBtn.silver && (
                      <span>
                        {handleBtn.silver && gigData?.silver.silverDays} Day
                        Delivery
                      </span>
                    )}
                    {handleBtn.platinum && (
                      <span>
                        {handleBtn.platinum && gigData?.platinum.platinumDays}{" "}
                        Day Delivery
                      </span>
                    )}
                  </div>
                  <div className=" flex items-center gap-1">
                    <BiRevision />
                    {handleBtn.base && (
                      <span>
                        {handleBtn.base && gigData?.base.baseRevision} Revision
                      </span>
                    )}
                    {handleBtn.silver && (
                      <span>
                        {handleBtn.silver && gigData?.silver.silverRevision}{" "}
                        Revision
                      </span>
                    )}
                    {handleBtn.platinum && (
                      <span>
                        {handleBtn.platinum &&
                          gigData?.platinum.platinumRevision}{" "}
                        Revision
                      </span>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Button className=" bg-gray-800 w-full dark:bg-gray-700">
                    Continue
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
            {currentUser._id !== gigData?.userId._id && (
              <Table.Head className="">
                <Table.HeadCell>
                  <Button
                    onClick={() => {
                      setshowModal(!showModal),
                        setFileError(""),
                        setConverModal(true);
                    }}
                    gradientDuoTone="purpleToBlue"
                    className=" w-full"
                    outline>
                    Contact me
                  </Button>
                </Table.HeadCell>
              </Table.Head>
            )}
          </Table>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => {
          setshowModal(false), setFile(null);
          setImageFile(null);
          setDocUrl(null);
          setImageUrl(null);
        }}
        popup
        size="md">
        <Modal.Header>
          <div className=" flex items-center gap-2">
            <img
              className=" w-12 h-12 rounded-full"
              src={gigData?.userId.image}
              alt="userProfile"
            />
            <div className=" flex flex-col">
              <h4 className=" text-sm">{gigData?.userId.username}</h4>
              <span className=" text-xs">{gigData?.userId.level}</span>
            </div>
          </div>
        </Modal.Header>
        {!converData ? (
          <Button
            onClick={handleCoverstion}
            gradientDuoTone="purpleToBlue"
            className=" w-full ">
            Start Converstion
          </Button>
        ) : (
          <>
            {msgLoading ? (
              <Spinner />
            ) : (
              <>
                <Modal.Body className=" w-full">
                  <>
                    {msgLoading ? (
                      <Spinner className=" text-center" />
                    ) : (
                      <>
                        <div className=" flex items-center justify-center">
                          {uploadFileProgress && (
                            <div
                              className={` ${
                                uploadFileProgress == 100 && " hidden"
                              } relative w-[200px] h-[500px] bg-gray-700`}>
                              <span
                                className=" absolute top-[-55px] flex items-center justify-center h-full w-full"
                                gradientDuoTone="purpleToBlue"
                                outline
                                onClick={handleImage}>
                                {uploadFileProgress && (
                                  <div className=" w-16 h-16">
                                    <CircularProgressbar
                                      value={uploadFileProgress}
                                      text={`${uploadFileProgress || 0}%`}
                                    />
                                  </div>
                                )}
                              </span>
                            </div>
                          )}

                          <>
                            {imageUrl && (
                              <div className=" bg-gray-700">
                                <img src={imageUrl} alt="image" />
                              </div>
                            )}

                            {docUrl && (
                              <div className=" relative w-[200px] h-[500px] bg-gray-700">
                                <span className=" text-white absolute top-[-55px] flex items-center justify-center h-full w-full">
                                  Doc
                                </span>
                              </div>
                            )}
                          </>

                          {fileError && (
                            <Alert color="failure">{fileError}</Alert>
                          )}
                        </div>
                      </>
                    )}
                  </>
                </Modal.Body>
                <form onSubmit={handleSend}>
                  <Modal.Footer>
                    <TextInput
                      onChange={handleFile}
                      ref={fileRef}
                      className=" hidden"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                    />

                    <TextInput
                      onChange={handleImage}
                      ref={imageRef}
                      className=" hidden"
                      type="file"
                      accept="image/*"
                    />
                    <IoIosDocument
                      onClick={() => {
                        fileRef.current.click(), setImageFile(null);
                      }}
                      size={22}
                    />
                    <FaFileImage
                      onClick={() => {
                        imageRef.current.click(), setFile(null);
                      }}
                    />
                    <TextInput
                      value={imageFile?.name || file?.name}
                      type="text"
                      placeholder=" Enter your message"
                      className=" w-full"
                      onChange={handleTxt}
                    />
                    <button disabled={msgLoading} type="submit">
                      <IoMdSend size={22} color="blue" />
                    </button>
                  </Modal.Footer>
                </form>
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
