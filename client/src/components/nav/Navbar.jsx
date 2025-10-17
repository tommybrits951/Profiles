import { useContext } from "react";
import ProfileContext from "../../context/ProfileContext";
import userPic from "../../assets/profile.png";
import { Link } from "react-router";
import axios from "../../api/axios";

export default function Navbar() {
  const { setAuth } = useContext(ProfileContext);

  function logout() {
    axios
      .get("/auth/logout")
      .then((res) => {
        console.log(res.data);
        setAuth(null);
      })
      .catch((err) => console.log(err));
  }

  return (
    <header className="fixed white top-0 w-full p-2 flex justify-between bg-stone-400 h-12">
      <Link to={"/"} className="h-full">
        <img src={userPic} className="h-full hover:scale-110" />
      </Link>
      <button onClick={logout} className="text-white text-sm cursor-pointer">
        Logout
      </button>
    </header>
  );
}
