import React, { useEffect, useState } from "react";
import { BiCategoryAlt } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Button, Table } from "flowbite-react";
import { CiTimer } from "react-icons/ci";
import { BiRevision } from "react-icons/bi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function SingleGig() {
  const { gigId } = useParams();
  const [gigData, setgigData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [handleBtn, setHandleBtn] = useState({
    base: true,
    silver: false,
    platinum: false,
  });
  const [read1, setRead1] = useState(false);
  const [read2, setRead2] = useState(false);

  const handleBtnFun = (prop) => {
    if (prop === "base") {
      setHandleBtn({
        base: true,
        silver: false,
        platinum: false,
      });
    }
    if (prop === "silver") {
      setHandleBtn({
        base: false,
        silver: true,
        platinum: false,
      });
    }
    if (prop === "platinum") {
      setHandleBtn({
        base: false,
        silver: false,
        platinum: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/gig/getsinglegig/${gigId}`);
        setgigData(data);
        setLoading(false);
      } catch (error) {
        console.log("getSingleGigError", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [gigId]);

  SwiperCore.use([Navigation]);

  if (loading) {
    return (
      <div className=" flex items-center justify-center min-h-screen w-screen">
        {loading && <Spinner />}
      </div>
    );
  }

  return (
    <div className=" max-w-6xl mx-auto p-4 md:flex gap-5">
      {/* section 1 */}
      <div className=" flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-2">
          <BiCategoryAlt />
          <span className=" text-xs">{gigData?.category}</span>
        </div>
        <div className="">
          <h2 className=" text-xl sm:text-2xl font-semibold">
            {gigData?.title}
          </h2>
        </div>

        <div className=" flex items-center gap-3">
          <img
            className=" w-12 h-12 rounded-full "
            src={gigData?.userId.image}
            alt="profile"
          />
          <div className="">
            <div className=" flex items-center gap-3">
              <span className=" font-bold">{gigData?.userId.username}</span>
              <span className=" border h-3"></span>
              <span>{gigData?.userId.level}</span>
            </div>

            <div className=" flex items-center gap-1">
              <FaStar />
              <span>4.8</span>
            </div>
            <div className="">
              <span>{gigData?.userId.country}</span>
            </div>
          </div>
        </div>

        <div className="">
          <div className="">
            <div className="">
              <p className={` ${read1 ? " line-clamp-0" : "line-clamp-2"} `}>
                {gigData?.userId.description}
              </p>
              <span
                className="hover:cursor-pointer text-sm text-blue-500"
                onClick={() => setRead1(!read1)}>
                Readme...
              </span>
            </div>
            <p className=" flex  items-center gap-3 mt-3">
              {gigData?.userId.skills.map((s) => (
                <span className=" bg-slate-300 p-2 rounded-lg dark:bg-slate-500">
                  {s}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className=" flex flex-col gap-3">
          <h3 className=" text-lg font-bold ">About this Gig</h3>
          <span>{gigData?.title}</span>
          <div className="">
            <span className={` ${read2 ? " line-clamp-0" : "line-clamp-2"} `}>
              {gigData?.descriptiion}
            </span>
            <span
              className=" hover:cursor-pointer text-sm text-blue-500"
              onClick={() => setRead2(!read2)}>
              Readme...
            </span>
          </div>
          {/* swiper */}
          <div className="w-full md:max-w-xl mt-4">
            <Swiper navigation>
              {gigData?.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    className=" w-[600px] h-[250px] object-cover hover:scale-110 transition-all duration-300"
                    alt="img"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="">
          <h3 className=" font-bold text-lg">Reviews</h3>
          <span>ratiing</span>
        </div>

        <div className="">
          <h3 className=" text-lg font-bold">Commands</h3>
        </div>
      </div>
      {/* section 2 */}
      <div className=" flex-1 border-t mt-6 sm:border-none ">
        <Table className=" mt-2">
          <Table.Head className="">
            <Table.HeadCell className="  flex items-center justify-between">
              <Button
                className=" "
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  // setBasic(true);
                  // setStand(false);
                  // setPlatinum(false);
                  handleBtnFun("base");
                }}>
                Basic
              </Button>

              <span className=" border border-r h-10"></span>

              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  // setBasic(false);
                  // setStand(true);
                  // setPlatinum(false);
                  handleBtnFun("silver");
                }}>
                Standard
              </Button>
              <span className=" border border-r h-10"></span>

              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  // setBasic(false);
                  // setStand(false);
                  // setPlatinum(true);
                  handleBtnFun("platinum");
                }}>
                Primium
              </Button>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className=" border border-gray-200 dark:border-gray-700 ">
            <Table.Row>
              <Table.Cell className=" w-full flex justify-between">
                <span className=" text-lg  font-semibold uppercase">
                  {handleBtn.base && gigData?.base.baseTitle}
                  {handleBtn.silver && gigData?.silver.silverTitle}
                  {handleBtn.platinum && gigData?.platinum.platinumTitle}
                </span>
                <span className=" text-lg font-semibold">
                  {handleBtn.base && (
                    <span>${handleBtn.base && gigData?.base.basePrice}</span>
                  )}
                  {handleBtn.silver && (
                    <span>
                      ${handleBtn.silver && gigData?.silver.silverPrice}
                    </span>
                  )}
                  {handleBtn.platinum && (
                    <span>
                      ${handleBtn.platinum && gigData?.platinum.platinumPrice}
                    </span>
                  )}
                </span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <p className="">
                  {handleBtn.base && gigData?.base.baseDescription}

                  {handleBtn.silver && gigData?.silver.silverDescription}

                  {handleBtn.platinum && gigData?.platinum.platinumDescription}
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className=" flex items-center gap-3">
                <div className=" flex items-center gap-1">
                  <CiTimer />
                  {handleBtn.base && (
                    <span>
                      {handleBtn.base && gigData?.base.baseDays} Day Delivery
                    </span>
                  )}
                  {handleBtn.silver && (
                    <span>
                      {handleBtn.silver && gigData?.silver.silverDays} Day
                      Delivery
                    </span>
                  )}
                  {handleBtn.platinum && (
                    <span>
                      {handleBtn.platinum && gigData?.platinum.platinumDays} Day
                      Delivery
                    </span>
                  )}
                </div>
                <div className=" flex items-center gap-1">
                  <BiRevision />
                  {handleBtn.base && (
                    <span>
                      {handleBtn.base && gigData?.base.baseRevision} Revision
                    </span>
                  )}
                  {handleBtn.silver && (
                    <span>
                      {handleBtn.silver && gigData?.silver.silverRevision}{" "}
                      Revision
                    </span>
                  )}
                  {handleBtn.platinum && (
                    <span>
                      {handleBtn.platinum && gigData?.platinum.platinumRevision}{" "}
                      Revision
                    </span>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Button className=" bg-gray-800 w-full dark:bg-gray-700">
                  Continue
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Head className="">
            <Table.HeadCell>
              <Button
                gradientDuoTone="purpleToBlue"
                className=" w-full"
                outline>
                Contact me
              </Button>
            </Table.HeadCell>
          </Table.Head>
        </Table>
      </div>
    </div>
  );
}
