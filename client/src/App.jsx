import { useState, useEffect} from "react";
import ProfileContext from "./context/ProfileContext";
import "./App.css";
import Home from "./components/layout/Home";
import axios from "./api/axios";
import useUser from "./hooks/useUser";
import useUsersList from "./hooks/useUsersList";


function App() {
  // Authentication and user states
  const [auth, setAuth] = useState(undefined);
  const [user, setUser] = useUser(auth)
  const [loading, setLoading] = useState(true);
  // User lists and social states
  const [userList, setUserList] = useUsersList(auth)
  
  
  
  
  

  
  useEffect(() => async function() {
    await axios.get("/auth")
    .then(res => {
      console.log(res.data)
      setAuth(res.data)
    })
  
    await axios.get("/user", {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => {
      setUserList(res.data)
    })
  }, [auth])

  const contextValue = {
    loading,
    setLoading,
    user,
    setUser,
    auth,
    setAuth,
    userList,
    setUserList
  }
  return (
    <main>
      <ProfileContext.Provider value={contextValue}>
        <Home />
      </ProfileContext.Provider>
    </main>
  );
}

export default App;
