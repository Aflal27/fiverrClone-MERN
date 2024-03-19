import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { CiBellOn } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import Switch from "react-switch";
import { toggleBtn } from "../redux/slices/toggles";

export default function Header() {
  const { theme } = useSelector((state) => state.themeState);
  const dispatch = useDispatch();
  const [searchToggle, setSearchToggle] = useState(false);
  const { currentUser } = useSelector((state) => state.userState);
  const { toggle } = useSelector((state) => state.toggleState);

  console.log(toggle);

  // toggle
  const handleToggle = () => {
    console.log("toggle click");
    dispatch(toggleBtn());
  };

  return (
    <Navbar>
      <Link
        to={"/"}
        className="text-sm sm:text-xl whitespace-nowrap font-semibold dark:text-white">
        <span
          className=" bg-gradient-to-r from-indigo-500 via-purple-500
         to-pink-500 rounded-lg text-white px-2 py-1">
          LOGO
        </span>
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={IoSearchOutline}
          className=" hidden lg:inline"
        />
      </form>
      {searchToggle && (
        <form className=" ">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={IoSearchOutline}
            className=" block sm:hidden "
          />
        </form>
      )}

      <div className=" flex items-center gap-2">
        <CiBellOn
          size={22}
          className=" hidden sm:inline hover:cursor-pointer"
        />
        <AiOutlineMail
          size={22}
          className=" hidden sm:inline hover:cursor-pointer"
        />
        <CiHeart size={22} className=" hidden sm:inline hover:cursor-pointer" />
      </div>
      <div className=" flex items-center gap-5">
        <Button
          onClick={() => setSearchToggle(!searchToggle)}
          className={`  w-12 h-10 lg:hidden `}
          color="gray"
          pill>
          <IoSearchOutline />
        </Button>
        <Button
          onClick={() => dispatch(toggleTheme())}
          className="w-12 h-10  "
          color="gray"
          pill>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser && currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user avatar" img={currentUser.image} rounded />
            }>
            <Dropdown.Header>
              <span className=" block text-sm">@{currentUser.username}</span>
              <span className=" block text-sm">@{currentUser.email}</span>
              <span className=" block text-sm">@{currentUser.level}</span>
            </Dropdown.Header>
            <span className="flex items-center ">
              <Dropdown.Item>Switch seller</Dropdown.Item>

              {/* <label
                  onClick={handleToggle}
                  class="inline-flex items-center cursor-pointer">
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                </label> */}
              <Switch checked={toggle} onChange={handleToggle} />
            </span>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Link to="/dashboard?tab=dashboard">
              <Dropdown.Item>Dashboard</Dropdown.Item>
            </Link>
            <Link>
              <Dropdown.Item>Message</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}
