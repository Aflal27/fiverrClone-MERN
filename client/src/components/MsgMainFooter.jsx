import { TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { IoIosDocument } from "react-icons/io";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { useSelector } from "react-redux";

export default function MsgMainFooter({
  setUploadFileProgress,
  setDocUrl2,
  setImageUrl2,
  setFileError2,
  clickUser,
  converstionID,
}) {
  const fileRef = useRef();
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [msgState, setMsgState] = useState("text");
  const [txtMsg, setTxtMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.userState);

  useEffect(() => {
    setImageUrl(null);
    setImageUrl2(null);
    if (file) {
      if (file.size > 5000000) {
        setFileError2("Could not upload image (file must be less then 5mb");
        return;
      }
      uploadFile();
    }
  }, [file]);

  useEffect(() => {
    setDocUrl(null);
    setDocUrl2(null);
    if (imageFile) {
      if (file?.size > 2000000) {
        setFileError2("Could not upload image (file must be less then 2mb");
        return;
      }
      uploadImage();
    }
  }, [imageFile]);

  const handleFile = (e) => {
    setFileError2("");

    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };
  const handleImage = (e) => {
    setFileError2("");
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();
    try {
      setMsgLoading(true);

      if (txtMsg || imageUrl || docUrl) {
        const { data } = await axios.post("/api/msg/create", {
          senderId: currentUser?._id,
          recepientId: clickUser?._id,
          messageType: msgState,
          converstionID,
          message: txtMsg,
          imageUrl,
          docUrl,
        });
        console.log(data);
        setDocUrl("");
        setDocUrl2("");
        setImageUrl("");
        setImageUrl2("");
        setTxtMsg("");
        setImageFile(null);
        setFile(null);
        setMsgLoading(false);
      } else {
        setFileError2("please fill message!");
        setMsgLoading(false);
      }
    } catch (error) {
      console.log("sendMsError", error);
      setMsgLoading(false);
    }
  };

  const uploadFile = () => {
    // setImageUploadError(null);
    setLoading(true);
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
          setDocUrl2(downloadUrl);
          setImageUrl(null);
          setImageUrl2(null);
          setMsgState("doc");
          setLoading(false);
        });
      }
    );
  };
  const uploadImage = () => {
    // setImageUploadError(null);
    setLoading(true);
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
          setImageUrl2(downloadUrl);
          setDocUrl(null);
          setDocUrl2(null);
          setMsgState("image");
          setLoading(false);
        });
      }
    );
  };
  return (
    <div>
      <form className=" flex items-center " onSubmit={handleSend}>
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
          value={imageFile?.name || file?.name || txtMsg}
          type="text"
          placeholder=" Enter your message"
          className=" w-full"
          onChange={(e) => setTxtMsg(e.target.value)}
        />

        <button
          className=" hover:cursor-pointer"
          disabled={msgLoading || loading}
          type="submit">
          <IoMdSend size={22} color="blue" />
        </button>
      </form>
    </div>
  );
}
