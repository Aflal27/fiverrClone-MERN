import React, { useEffect, useState } from "react";
import MsgSilde from "../components/MsgSilde";
import MsgMain from "../components/MsgMain";
import { useDispatch, useSelector } from "react-redux";
import { toggleBtn2 } from "../redux/slices/toggles";

export default function Message() {
  const { msgToggle } = useSelector((state) => state.toggleState);
  const [clickUser, setClickUser] = useState(null);
  const dispatch = useDispatch();
  const [converstionID, setConverstionID] = useState("");

  useEffect(() => {
    dispatch(toggleBtn2(false));
  }, []);

  return (
    <div className=" flex flex-1 md:w-screen ">
      {/* msgSild */}
      <div
        className={` ${
          msgToggle && "hidden"
        } w-full md:block sm:w-[300px] h-screen bg-slate-200 dark:bg-slate-700`}>
        <MsgSilde
          setConverstionID={setConverstionID}
          setClickUser={setClickUser}
        />
      </div>
      {/* msgMain */}
      <div
        className={` ${
          !msgToggle && "hidden"
        } sm:inline-block w-screen h-screen sm:w-full  dark:bg-slate-600 bg-slate-100`}>
        <MsgMain converstionID={converstionID} clickUser={clickUser} />
      </div>
    </div>
  );
}
