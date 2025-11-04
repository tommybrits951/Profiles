import {useContext, useState} from 'react'
import ProfileContext from '../context/ProfileContext'
import axios from '../api/axios'
import {Link} from  'react-router'

export default function Login() {
    const {setAuth} = useContext(ProfileContext)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [err, setErr] = useState("")
    
    function change(e) {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
        setErr("")
    }
    function submit(e) {
        e.preventDefault()
        
        const pkg = new FormData()
        pkg.append("email", formData.email)
        pkg.append("password", formData.password)
        axios.post("/auth", formData)
        .then(res => {

            console.log(res.data)
            setAuth(res.data)
        })
        .catch(err => {
            console.log(err)
            setErr(err.response.data.message)
        })
    }

  return (
    <section className='absolute w-1/2 left-1/4 top-32 bg-stone-400'>
        <div className='text-center'>
            <h2 className='text-4xl m-5 font-mono text-black'>Login User</h2>
            <p className='text-red-500'>{err}</p>
        </div>
        <form className='text-center bg-stone-200 flex flex-col justify-around' onSubmit={submit} encType='multipart/form-data'>
        <label className=' font-bold text-lg mt-3'>Email
        <br />
        <input className='bg-white text-black p-1 rounded' type="email" name='email' value={formData.email} onChange={change} required />
        </label>
        <br />
        <label className=' font-bold text-lg mt-3'>Password
            <br />
            <input className='bg-white text-black p-1 rounded' type='password' name='password' value={formData.password} onChange={change} required/>
        </label>
        <br />
        <div className='flex justify-around'>
            <Link className='text-lg p-2 m-3 underline text-stone-900' to={"/register/1"}>Register New User</Link>
            <button className='text-lg p-2 m-3 hover:scale-95 text-white bg-lime-600 shadow-lg rounded-lg'>Submit</button>
        </div>
        </form>
    </section>
  )
}
