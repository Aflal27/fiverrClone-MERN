import React, { useEffect, useState } from "react";
import DashSidebar from "../components/DashSidebar";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    setTab(tabFormUrl);
  }, [location.search]);
  console.log(tab);
  return (
    <div className=" min-h-screen flex flex-col md:flex-row">
      <div>
        <DashSidebar />
      </div>

      {/* profile */}
      {tab === "profile" && <DashProfile />}
    </div>
  );
}
