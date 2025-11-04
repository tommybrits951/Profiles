import { useContext } from "react";
import ProfileContext from "../../context/ProfileContext";
import { Routes, Route } from "react-router";
import Layout from "./Layout";
import Register from '../layout/Register';
import Login from "../../features/Login";
import UserList from "../users/UserList";
export default function Home() {
  const { auth } = useContext(ProfileContext);

  return (
    <>
      {auth === undefined ? (
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Register />} path="/register/*" />
        </Routes>
      ) : (
        <Routes>
          <Route element={<Layout />} path="/*">
            <Route element={<UserList />} index />
          </Route>
        </Routes>
      )}
    </>
  );
}
