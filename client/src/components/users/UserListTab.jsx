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
    const {friends} = user;
    
  }

  function sendRequest() {
    const pkg = new FormData();
    pkg.append("_id", person._id);
    axios
      .post(`/friend/${user._id}`, pkg, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFriendBtn("pending");
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    checkStatus();
  }, [person]);

  return (
    <div className="user-tab p-0">
      <div className="h-18 tab-img">
        <img
          src={`http://localhost:9000/profile/${person.email}.png`}
          className="h-full rounded-xl"
        />
      </div>
      <div className="tab-data">
        <h4>{person.full_name}</h4>
        <p>Age: {person.age}</p>
      </div>
      <div className="tab-btns mr-5">
        {friendBtn === "add" ? (
          <button
            className="h-7 hover:scale-95 cursor-pointer"
            onClick={sendRequest}
          >
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
