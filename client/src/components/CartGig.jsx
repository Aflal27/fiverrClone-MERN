import { Dropdown } from "flowbite-react";
import React from "react";
import { IoIosMore } from "react-icons/io";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";

export default function CartGig({ gig }) {
  return (
    <div className=" bg-slate-100 dark:bg-slate-700 flex w-full gap-4 sm:w-[200px] sm:flex-col border border-gray-200 dark:border-gray-500">
      <div className=" relative">
        <span
          className={` p-1 absolute m-1 ${
            gig.status && "bg-green-400"
          } bg-red-400 rounded-lg w-auto text-center`}>
          {gig.status ? "Active" : "Panding"}
        </span>
        <img
          className=" w-[200px] h-[100px] object-cover"
          src={gig.images[0]}
          alt="gig image"
        />
      </div>
      <div className=" space-y-8  sm:space-y-3 p-2 bg-slate-100 dark:bg-slate-700">
        <div className=" text-sm">
          <p>{gig.title}</p>
        </div>
        <div className="">
          <div className=" flex items-center sm:justify-between gap-20 ">
            <Dropdown
              className=" w-[200px]"
              arrowIcon={false}
              inline
              label={<IoIosMore className=" dark:text-gray-400" size={32} />}>
              <Link to={`/update-gig/${gig._id}`}>
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
              <span className="">${gig.base.basePrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
