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

export default function Header() {
  const { theme } = useSelector((state) => state.themeState);
  const dispatch = useDispatch();
  const [searchToggle, setSearchToggle] = useState(false);

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
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="user avatar"
              img="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png"
              rounded
            />
          }>
          <Dropdown.Header>
            <span className=" block text-sm">@Name</span>
            <span className=" block text-sm">@Email</span>
          </Dropdown.Header>
          <Link to="/dashbord?tab=profile">
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Link to="/dashbord?tab=dashboard">
            <Dropdown.Item>Dashboard</Dropdown.Item>
          </Link>
          <Link>
            <Dropdown.Item>Message</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item>Sign Out</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}
