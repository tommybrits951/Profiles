import React from "react";
import userPic from "../../assets/profile.png";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <header className="fixed white top-0 w-full p-2 bg-stone-400 h-10">
      <Link to={"/"} className="h-full">
        <img src={userPic} className="h-full hover:scale-110" />
      </Link>
    </header>
  );
}
