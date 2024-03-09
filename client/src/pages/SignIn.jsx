import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/slices/userSlice";
import Oauth from "../components/Oauth";
export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    if (!formData.email || !formData.password) {
      return setErrorMessage("please fill out all fields.");
    }

    try {
      const { data } = await axios.post("/api/auth/signin", formData);
      console.log(data);
      setLoading(false);
      dispatch(signInSuccess(data));
      if (data) {
        navigation("/");
      }
      if (data.success === false) {
        setErrorMessage(data);
      }
    } catch (error) {
      console.log("sign in submit error", error);
      setErrorMessage(error);
    }
  };
  console.log(formData);
  return (
    <div className=" min-h-screen mt-20 md:flex p-10 ">
      {/*left  */}
      <div className="  p-3 max-w-3xl mx-auto flex-1 ">
        <Link
          to={"/"}
          className=" whitespace-nowrap font-semibold dark:text-white text-4xl">
          <span
            className=" bg-gradient-to-r from-indigo-500 via-purple-500
         to-pink-500 rounded-lg text-white px-2 py-1">
            Fiverr
          </span>
          Clone
        </Link>
        <p className=" text-sm mt-5">
          This is a demo projects, you can sign in with your email and password
          or with Google{" "}
        </p>
      </div>
      {/* right */}
      <div className="flex-1 p-3">
        <form onSubmit={handleSubmit}>
          <div>
            <Label value="Your emaiil" />
            <TextInput
              type="email"
              placeholder="name@gmail.com"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Your password" />
            <TextInput
              type="password"
              placeholder="********"
              id="password"
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            className=" mx-auto w-full mt-3"
            gradientDuoTone="purpleToPink"
            disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> <span> Loading... </span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <Oauth />
        <div className=" flex items-center gap-3 mt-3">
          <p>Don't Have an account?</p>
          <Link className=" text-blue-500" to={"/sign-up"}>
            Sign Up
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
