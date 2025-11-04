import { useState, useEffect } from "react";
import axios from '../api/axios'
export default function useUser(auth) {
    const [user, setUser] = useState(null)
    useEffect(() => {
        auth && axios.get("/auth/user", {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        })
        .then(res => {
            setUser(res.data)
        })
    }, [auth])

    return [user, setUser]
}