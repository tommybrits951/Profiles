import { Outlet } from "react-router";
import Navbar from "../nav/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
