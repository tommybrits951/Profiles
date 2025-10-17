import { Outlet } from "react-router";
import Navbar from "../nav/Navbar";
import FriendsListBar from "../friends/FriendsListBar";
export default function Layout() {
  return (
    <>
      <Navbar />
      <FriendsListBar />
      <Outlet />
    </>
  );
}
