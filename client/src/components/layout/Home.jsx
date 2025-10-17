import { useContext } from "react";
import ProfileContext from "../../context/ProfileContext";
import { Routes, Route } from "react-router";
import Register from "../user/Register";
import LoginForm from "../user/LoginForm";
import UserList from "../users/UserList";
import Layout from "./Layout";

export default function Home() {
  const { auth } = useContext(ProfileContext);

  return (
    <>
      {auth === null ? (
        <Routes>
          <Route element={<LoginForm />} path="/" />
          <Route element={<Register />} path="/register" />
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
