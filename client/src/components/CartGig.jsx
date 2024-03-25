import { Dropdown } from "flowbite-react";
import React from "react";
import { IoIosMore } from "react-icons/io";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";

export default function CartGig() {
  return (
    <div className=" bg-slate-100 dark:bg-slate-700 flex w-full gap-4 sm:w-[200px] sm:flex-col border border-gray-200 dark:border-gray-500">
      <div className=" relative">
        <span className=" absolute m-1 bg-green-400 rounded-sm w-[50px] text-center">
          Active
        </span>
        <img
          className=" w-[200px] h-[100px] object-cover"
          src="https://mir-s3-cdn-cf.behance.net/projects/404/fa19c1182329117.Y3JvcCw4MDgsNjMyLDAsMA.jpg"
          alt="gig image"
        />
      </div>
      <div className=" space-y-8  sm:space-y-3 p-2 bg-slate-100 dark:bg-slate-700">
        <div className=" text-sm">
          <p>heading</p>
        </div>
        <div className="">
          <div className=" flex items-center sm:justify-between gap-20 ">
            <Dropdown
              className=" w-[200px]"
              arrowIcon={false}
              inline
              label={<IoIosMore className=" dark:text-gray-400" size={32} />}>
              <Link>
                <Dropdown.Item>
                  <CiEdit className=" mr-3" />
                  <span>Edit</span>
                </Dropdown.Item>
              </Link>
              <Dropdown.Item>
                <MdOutlineDeleteOutline className=" mr-3" />

                <span>Delete</span>
              </Dropdown.Item>
            </Dropdown>
            <div className=" flex items-center gap-1">
              <span>From</span>
              <span className="">$5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
