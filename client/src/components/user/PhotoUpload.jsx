import { useState, useContext } from 'react'
import Cropper from 'react-easy-crop'
import { useNavigate } from 'react-router'
import ProfileContext from '../../context/ProfileContext'


export default function PhotoUpload({setImg, setAreaPixels, submit, turnPage}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({width: 1, height: 1})
    const [zoom, setZoom] = useState(1)
    const [url, setUrl] = useState(null)
    
    function pageHandler(e) {
        e.preventDefault()
        turnPage(e)
    }
    function submitHandler(e) {
        e.preventDefault()
        submit(e)
    }
    function readFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    function onCropComplete(croppedArea, croppedAreaPixels) {
        console.log(croppedAreaPixels)
        setCroppedAreaPixels(croppedAreaPixels)
        setAreaPixels(croppedAreaPixels)
    }
    async function changeImg(e) {
        const file = e.target.files[0]
        const imgUrl = await readFile(file)
        setImg(file)
        setUrl(imgUrl)
    }
    
    return (
        <section className='absolute h-full w-full grid grid-rows-2'>
            <div className='absolute left-0 w-full h-1/2 border-2 row-start-1'>
                <Cropper
                    image={url}
                    crop={crop}
                    zoom={zoom}
                    aspect={5 / 6}
                    cropShape='round'
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    className="border-2"
                />
            </div>
            <form encType='multipart/form-data' onSubmit={submitHandler} className='row-start-2 text-center grid grid-cols-4'>
                <label className='col-start-2 col-end-4 mt-20 w-full'>Zoom
                    <br />
                    <input className='w-full' type="range" value={zoom} min={1} max={3} step={0.1} aria-labelledby='Zoom' onChange={(e) => setZoom(e.target.value)} />
                </label>
                <br />
                <label className='col-start-2 col-end-4'>Choose Picture
                    <br />
                    <input type="file" name='img' onChange={changeImg} className='bg-white rounded' accept='image/*' />
                </label>
                <div className='col-start-2 col-end-4 '>
                    <button className='text-white bg-gray-500 p-2 shadow-xl rounded hover:scale-95 cursor-pointer mx-5' title='back' onClick={pageHandler}>Back</button>
                    <button className='text-white bg-cyan-500 p-2 shadow-xl rounded hover:scale-95 cursor-pointer mx-5' onClick={submitHandler}>Submit</button>
                </div>
            </form>

        </section >
    )
}
