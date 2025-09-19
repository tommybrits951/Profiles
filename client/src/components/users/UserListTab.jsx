import { useContext, useEffect, useState } from "react";
import ProfileContext from "../../context/ProfileContext";
import axios from "../../api/axios";
import addFriend from "../../assets/addFriendDark.png";
import reqPending from "../../assets/pendingDark.png";
import friendAdded from "../../assets/friendAdded.png";

export default function UserListTab({ person }) {
  const { user, auth } = useContext(ProfileContext);
  const [friendBtn, setFriendBtn] = useState(null);

  function checkStatus() {
    const { friends, requests } = user;
    const { sent, received } = requests;
    if (friends.includes(person._id)) {
      setFriendBtn("friend");
    } else if (sent.includes(person._id) || received.includes(person._id)) {
      setFriendBtn("pending");
    } else {
      setFriendBtn("add");
    }
  }

  useEffect(() => {
    checkStatus();
  }, [person]);
  return (
    <div className="user-tab">
      <div className="tab-data">
        <h4>{person.full_name}</h4>
        <p>Age: {person.age}</p>
      </div>
      <div className="tab-btns">
        {friendBtn === "add" ? (
          <button className="h-7">
            <img src={addFriend} className="h-full" />
          </button>
        ) : friendBtn === "pending" ? (
          <div className="h-7">
            <img src={reqPending} className="h-full" />
          </div>
        ) : (
          <div className="h-7">
            <img src={friendAdded} className="h-full" />
          </div>
        )}
      </div>
    </div>
  );
}
