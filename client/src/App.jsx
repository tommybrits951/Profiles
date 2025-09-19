import { useState, useEffect } from "react";
import ProfileContext from "./context/ProfileContext";
import "./App.css";
import Home from "./components/layout/Home";
import axios from "./api/axios";

function App() {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState(null)

  
  useEffect(() => {
    axios
      .get("/auth")
      .then((res) => {
        setAuth(res.data);
      })
      .catch((err) => console.log(err));
      
  }, []);


  useEffect(() => {
    {auth
      ? axios
          .get("/auth/user", {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          })
          .then((res) => setUser(res.data))
          .catch((err) => console.log(err))
      : null}
          {auth ? 
    axios.get("/user", {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => {
      console.log(res.data)
      setUserList(res.data)
    })
    .catch(err => console.log(err))
    : null
  }

  }, [auth]);

  return (
    <main>
      <ProfileContext.Provider value={{ auth, user, setUser, setAuth }}>
        <Home />
      </ProfileContext.Provider>
    </main>
  );
}

export default App;
