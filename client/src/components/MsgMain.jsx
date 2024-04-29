import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleBtn2 } from "../redux/slices/toggles";
import { IoArrowBackOutline } from "react-icons/io5";
import MsgMainFooter from "./MsgMainFooter";

import MsgMainBody from "./MsgMainBody";

export default function MsgMain({ clickUser, converstionID }) {
  const dispatch = useDispatch();
  const [uploadFileProgress, setUploadFileProgress] = useState(null);
  const [docUrl2, setDocUrl2] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [fileError2, setFileError2] = useState("");

  return (
    <>
      {clickUser ? (
        <div className=" relative h-full w-full flex flex-col z-10">
          {/* header */}
          <div className=" flex items-center gap-3 p-2 bg-slate-200 dark:bg-slate-500 absolute top-0 w-full  ">
            <IoArrowBackOutline
              className=" sm:hidden"
              onClick={() => dispatch(toggleBtn2(false))}
              size={22}
            />
            <img
              src={clickUser?.image}
              alt="profile"
              className=" w-14 h-14 rounded-full object-cover"
            />
            <div className="">
              <p className=" text-sm font-semibold ">{clickUser?.username}</p>
              <p className=" text-xs text-gray-400">{clickUser?.email}</p>
            </div>
          </div>

          {/* body */}
          <MsgMainBody
            docUrl2={docUrl2}
            imageUrl2={imageUrl2}
            fileError2={fileError2}
            uploadFileProgress={uploadFileProgress}
            clickUser={clickUser}
            converstionID={converstionID}
          />

          {/* footer */}
          <div className=" absolute bottom-0 w-full z-10  ">
            <MsgMainFooter
              setDocUrl2={setDocUrl2}
              setFileError2={setFileError2}
              setImageUrl2={setImageUrl2}
              setUploadFileProgress={setUploadFileProgress}
              clickUser={clickUser}
              converstionID={converstionID}
            />
          </div>
        </div>
      ) : (
        <div className=" hidden sm:flex items-center justify-center w-full h-full">
          <div className=" flex flex-col items-center gap-3">
            <img
              src="https://alinhamentodemotos.com.br/wp-content/uploads/2019/05/chat-loading-avatar.png"
              alt="coverstion image"
              className=" w-[500px] h-[400px] object-contain"
            />
            <p className=" text-2xl ">Start the Converstion</p>
          </div>
        </div>
      )}
    </>
  );
}
