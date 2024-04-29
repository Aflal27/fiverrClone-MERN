import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoIosMore } from "react-icons/io";
import { Dropdown } from "flowbite-react";
import { BsDownload } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import pusherJs from "pusher-js";

export default function MsgMainBody({
  docUrl2,
  imageUrl2,
  fileError2,
  uploadFileProgress,
  converstionID,
}) {
  const [msgData, setMsgData] = useState([]);
  const { currentUser } = useSelector((state) => state.userState);
  const scrollEndRef = useRef();

  const scrollEnd = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //pusher
  useEffect(() => {
    const pusher = new pusherJs("3cbe62482136f91d71ee", {
      cluster: "ap2",
    });
    var channel = pusher.subscribe("msg");
    channel.bind("inserted", function (data) {
      if (data.converstionID == converstionID) {
        setMsgData((msgData) => [...msgData, data]);
      }
    });
  }, []);

  useEffect(() => {
    const fetchMsg = async () => {
      try {
        const { data } = await axios.get(`/api/msg/get/${converstionID}`);
        setMsgData(data);
      } catch (error) {
        console.log("msgMainBodyGetMsgError", error);
      }
    };
    fetchMsg();
  }, [converstionID]);

  const formetTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  //download
  const downloadMedia = async (originalFile) => {
    try {
      // Use axios.get() to fetch the file
      const res = await axios.get(originalFile, { responseType: "blob" });

      // Create a blob from the response data
      const file = new Blob([res.data]);

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(file);

      // Create a link element and set its attributes
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", new Date().getTime().toString());

      // Append the link to the document body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDlt = async (dltId) => {
    try {
      setMsgData(msgData.filter((msg) => msg._id !== dltId));
      const { data } = await axios.delete("/api/msg/delete", { dltId });
      console.log(data);
    } catch (error) {
      console.log("dltMsgError", error);
    }
  };

  return (
    <div
      ref={scrollEndRef}
      className=" absolute top-24 w-full h-[450px] overflow-y-scroll no-scrollbar   ">
      {docUrl2 || imageUrl2 ? (
        <div>
          <div className=" flex items-center justify-center">
            {uploadFileProgress && (
              <div
                className={` ${
                  uploadFileProgress == 100 && " hidden"
                } relative w-[200px] h-[500px] bg-gray-700`}>
                <span
                  className=" absolute top-[-55px] flex items-center justify-center h-full w-full"
                  gradientDuoTone="purpleToBlue"
                  outline>
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
              {imageUrl2 && (
                <div className=" bg-gray-700 p-4">
                  <img src={imageUrl2} alt="image" />
                </div>
              )}

              {docUrl2 && (
                <div className=" relative w-[200px] h-[500px] bg-gray-700">
                  <span className=" text-white absolute top-[-55px] flex items-center justify-center h-full w-full">
                    Doc
                  </span>
                </div>
              )}
            </>

            {fileError2 && <Alert color="failure">{fileError2}</Alert>}
          </div>
        </div>
      ) : (
        <div
          className={` absolute p-2 top-24 w-full h-[800px] overflow-y-scroll no-scrollbar flex flex-col gap-8     `}>
          {msgData.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg?.senderId == currentUser._id && " flex flex-col items-end "
              }`}>
              {msg?.messageType == "text" && (
                <div>
                  <p>{msg?.message}</p>
                  <div className=" flex items-center gap-4">
                    <Dropdown
                      inline
                      arrowIcon={false}
                      label={
                        <IoIosMore
                          size={22}
                          className=" hover:cursor-pointer"
                        />
                      }>
                      <Dropdown.Item
                        onClick={() => handleDlt(msg._id)}
                        className=" flex items-center gap-1">
                        <MdDeleteOutline />
                        <span>Delete</span>
                      </Dropdown.Item>
                    </Dropdown>
                    <p className=" text-sm text-gray-400">
                      {formetTime(msg?.timeStamp)}
                    </p>
                  </div>
                </div>
              )}
              {msg?.messageType == "image" && (
                <div className=" bg-slate-500 w-[200px] h-[100px]">
                  <img
                    src={msg?.imageUrl}
                    alt="msg image"
                    className=" dark:  w-[200px] h-[100px]"
                  />
                  <div className=" flex items-center justify-between w-[200px]">
                    <Dropdown
                      inline
                      arrowIcon={false}
                      label={
                        <IoIosMore
                          size={22}
                          className=" hover:cursor-pointer"
                        />
                      }>
                      <Dropdown.Item
                        onClick={() => downloadMedia(msg?.imageUrl)}
                        className=" flex items-center gap-1">
                        <BsDownload />
                        <span>Download</span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleDlt(msg._id)}
                        className=" flex items-center gap-1">
                        <MdDeleteOutline />
                        <span>Delete</span>
                      </Dropdown.Item>
                    </Dropdown>
                    <p className=" text-sm text-gray-400">
                      {formetTime(msg?.timeStamp)}
                    </p>
                  </div>
                </div>
              )}

              {msg?.messageType == "doc" && (
                <div className=" bg-slate-500 w-[200px] h-[100px]">
                  <div
                    className=" w-[200px] h-[100px] bg-slate-200 dark:bg-slate-500
                  ">
                    <p className=" flex items-center justify-center h-full">
                      Doc
                    </p>
                  </div>
                  <div className=" flex items-center justify-between w-[200px]">
                    <Dropdown
                      inline
                      arrowIcon={false}
                      label={
                        <IoIosMore
                          size={22}
                          className=" hover:cursor-pointer"
                        />
                      }>
                      <Dropdown.Item
                        onClick={() => downloadMedia(msg.docUrl)}
                        className=" flex items-center gap-1">
                        <BsDownload />
                        <span>Download</span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleDlt(msg._id)}
                        className=" flex items-center gap-1">
                        <MdDeleteOutline />
                        <span>Delete</span>
                      </Dropdown.Item>
                    </Dropdown>
                    <p className=" text-sm text-gray-400">
                      {formetTime(msg?.timeStamp)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
