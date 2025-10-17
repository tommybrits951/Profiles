import {useState, useContext} from 'react'
import {Link} from 'react-router'
import ProfileContext from '../../context/ProfileContext'
import axios from '../../api/axios'


const initForm = {
    email: "", 
    password: ""
}
export default function LoginForm() {
    const [formData, setFormData] = useState(initForm)
    const [err, setErr] = useState("")
    const {setAuth} = useContext(ProfileContext)

    function change(e) {
        setErr("")
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }
    function submit(e) {
        e.preventDefault()
        const pkg = new FormData()
        pkg.append("email", formData.email)
        pkg.append("password", formData.password)
        
        axios.post("/auth", pkg)
        .then(res => {
            setAuth(res.data)
            console.log(res.data)
        })
        .catch(err => setErr(err.response.data.message))
    }
    
  const content = (
     <section className='absolute rounded shadow-2xl bg-zinc-600 w-1/2 left-1/4 top-32'>
        <h2 className='text-4xl m-3 text-center text-white font-mono'>Login User</h2>
        <p className='text-red-700 text-center'>{err}</p>
        <form className='text-center' encType='multipart/form-data' onSubmit={submit} >
            <label className='text-white m-2'>
                Email
                <br />
                <input className='text-black p-1 bg-white' type='email' name='email' value={formData.email} onChange={change} placeholder='email' required autoComplete='false' />
            </label>
            <br />
            <label className='text-white m-2'>
                Password
                <br />
                <input className='text-black p-1 bg-white' type='password' name='password' value={formData.password} onChange={change} placeholder='password' required autoComplete='false' />
            </label>
            <br />
            <div className='flex justify-around m-5'>
                <Link to={"/register"} className='text-white text-lg underline'>New User</Link>
                <button type='submit' className='text-lg bg-lime-400 text-white p-2 shadow-2xl rounded-xl hover:scale-95 cursor-pointer'>Submit</button>
            </div>
        </form>
    </section>
  )
  return content
}
