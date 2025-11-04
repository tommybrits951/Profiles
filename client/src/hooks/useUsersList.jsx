import {useState, useEffect} from 'react';
import axios from '../api/axios';

export default function useUsersList(auth) {
    const [userList, setUserList] = useState([])

    useEffect(() => {
        axios.get("/user", {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        })
        .then(res => {
            setUserList(res.data)
        })
        .catch(err => console.log(err))
    }, [])
    return [userList, setUserList]
}