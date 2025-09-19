import {useContext, useState, useEffect} from 'react'
import ProfileContext from '../../context/ProfileContext'
import axios from '../../api/axios'

export default function Board() {
    const [posts, setPosts] = useState()
    const {user, auth} = useContext(ProfileContext)


    useEffect(() => {
        axios.get
    }, [])

    const content = posts.length > 0 ? (
        <ul>

        </ul>
    ) : <p>Loading...</p>
}
