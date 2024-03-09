import React, { useState } from "react";
import { Alert, Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function Oauth() {
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const navigation = useNavigate();
  const [errorHandle, setErrorHandle] = useState("");
  const handleGoogleClick = async () => {
    setErrorHandle("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const username = result.user.displayName;
      const email = result.user.email;
      const image = result.user.photoURL;

      const { data } = await axios.post("/api/auth/google", {
        username,
        email,
        image,
      });
      console.log(data);
      dispatch(signInSuccess(data));
      navigation("/");
    } catch (error) {
      console.log("oauth", error);
      setErrorHandle("Something wrong please try agine!");
    }
  };
  return (
    <div className="">
      <Button
        onClick={handleGoogleClick}
        className=" mx-auto w-full mt-3"
        type="button"
        gradientDuoTone="pinkToOrange"
        outline>
        <AiFillGoogleCircle size={22} /> Continue with Google
      </Button>
      {errorHandle && (
        <Alert color="failure" className=" mt-5">
          {" "}
          {errorHandle}{" "}
        </Alert>
      )}
    </div>
  );
}
