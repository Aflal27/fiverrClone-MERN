import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/signUp";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import CreategGig from "./pages/CreategGig";
import UpdategGig from "./pages/UpdateGig";

export default function App() {
  const { currentUser } = useSelector((state) => state.userState);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {currentUser && <Route path="/dashboard" element={<Dashboard />} />}
        <Route path="/create-gig" element={<CreategGig />} />
        <Route path="/update-gig/:gigId" element={<UpdategGig />} />
      </Routes>
    </BrowserRouter>
  );
}
