import {useState, useContext, useEffect} from 'react'
import axios from '../../api/axios'
import ProfileContext from '../../context/ProfileContext'
import UserListTab from './UserListTab'
export default function UserList() {
  const [users, setUsers] = useState(null)
  const {auth} = useContext(ProfileContext)


  useEffect(() => {
    auth ? axios.get("/user", {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => {
      console.log(res.data)
      setUsers(res.data)
    })
    .catch(err => console.log(err)) : null
  }, [])

  return (
    <ul className='absolute top-12 w-1/2 left-1/4 border-2 h-11/12 overflow-x-scroll'>
      {users === null ? <p>Loading...</p> : 
      users.map((person, idx) => {
        return (
          <li className='w-full border-1 p-2' key={idx}>
            <UserListTab person={person}/>
          </li>
        )
      })
      }
    </ul>
  )


}
