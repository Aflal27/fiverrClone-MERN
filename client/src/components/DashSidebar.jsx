import React from "react";
import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashSidebar() {
  return (
    <Sidebar className=" w-full md:w-[56]">
      <Sidebar.Items>
        <Sidebar.ItemGroup className=" flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item>Profile</Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=my-gig">
            <Sidebar.Item>My Gig</Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=msg">
            <Sidebar.Item>Message</Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
