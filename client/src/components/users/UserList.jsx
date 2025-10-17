import { useState, useContext, useEffect } from "react";
import axios from "../../api/axios";
import ProfileContext from "../../context/ProfileContext";
import UserListTab from "./UserListTab";
export default function UserList() {
  const { auth, user } = useContext(ProfileContext);
  const [users, setUsers] = useState();
  const [friendsList, setFriendsList] = useState([]);

  function getFriends() {
    axios
      .get(`/friend/list/${user._id}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => console.log(err));
  }


  // Sort and check for friend status
  function checkFriendStatus(user, usersList) {
    
    

  }


  function getUsers() {
    axios
      .get("/user", {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((res) => {
        const list = res.data.filter((obj) => obj.email !== user.email);
        console.log(auth);
        setUsers(list);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    user && getUsers();
    user && getFriends();
    
      
    
  }, [user]);
  return (
    <ul className="absolute rounded-xl top-12 w-1/2 left-1/4 border-2 h-11/12 overflow-y-scroll">
      {users
        ? users.map((person, idx) => {
            return (
              <li className="w-full border-1 p-2" key={idx}>
                <UserListTab person={person} />
              </li>
            );
          })
        : null}
    </ul>
  );
}
