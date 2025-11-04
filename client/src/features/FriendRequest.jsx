import { useContext, useState, useEffect } from "react";
import ProfileContext from "../context/ProfileContext";
import axios from "../api/axios";

export default function FriendRequest({ person }) {
  const { auth, user } = useContext(ProfileContext);
  


  useEffect(() => {
      console.log(user.isFriend(person._id))
  }, [user]);

  return (
    <div>
  
    </div>
  );
}
