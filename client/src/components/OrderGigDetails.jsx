import { Button } from "flowbite-react";
import React from "react";

export default function OrderGigDetails({ gigData, handleGigState }) {
  return (
    <div className=" md:w-[400px] bg-slate-100 dark:bg-gray-700 dark:border-gray-500 p-3 border shadow-md h-full">
      <div className=" flex flex-col gap-4">
        <div className=" flex items-center gap-2">
          <img
            className=" w-[100px] h-[100px] object-contain"
            src={gigData.images[0]}
            alt="gigImage"
          />
          <h3 className=" text-sm flex flex-wrap">{gigData.title}</h3>
        </div>
        <div className=" flex items-center justify-between">
          <p>{gigData.category}</p>

          {handleGigState.base && <span>${gigData.base.basePrice}</span>}
          {handleGigState.silver && <span>${gigData.silver.silverPrice}</span>}
          {handleGigState.platinum && (
            <span>${gigData.platinum.platinumPrice}</span>
          )}
        </div>
        <p className=" flex flex-wrap">
          {handleGigState.base && <span>{gigData.base.baseDescription}</span>}
          {handleGigState.silver && (
            <span>{gigData.silver.silverDescription}</span>
          )}
          {handleGigState.platinum && (
            <span>{gigData.platinum.platinumDescription}</span>
          )}
        </p>
        <div className=" flex items-center justify-between">
          <span className=" text-lg font-bold">Total</span>
          {handleGigState.base && <span>${gigData.base.basePrice}</span>}
          {handleGigState.silver && <span>${gigData.silver.silverPrice}</span>}
          {handleGigState.platinum && (
            <span>${gigData.platinum.platinumPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
