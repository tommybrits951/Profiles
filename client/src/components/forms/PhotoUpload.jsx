import { useState } from "react";
import Cropper from "react-easy-crop";



export default function PhotoUpload({
  img,
  setImg,
  setCroppedAreaPixels,
  submit,
  turnPage,
  croppedAreaPixels
}) {
  
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [url, setUrl] = useState(null);
  function pageHandle(e) {
    return turnPage(e);
  }
  
  function submitHandle(e) {
    submit(e)
  }
  function onCropComplete(croppedArea, croppedAreaPixels) {
    console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }
  async function imageUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  async function handleImage(e) {
    const file = e.target.files[0];
    const croppedImage = await imageUrl(file);
    setUrl(croppedImage)
    await setImg(file);
  }

  return (
    <div className="absolute grid grid-rows-3 h-full w-full">
      <div className="relative row-end-2 h-full w-full bg-stone-200">
        <Cropper
          zoom={zoom}
          crop={crop}
          aspect={1}
          croppedAreaPixels={croppedAreaPixels}
          image={url}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
        />
      </div>
      <form encType="multipart/form-data" onSubmit={submitHandle}>
        <div className="row-start-2 row-end-3 text-center mt-15">
          <label className="text-xl text-center w-full">
            Zoom In
            <br />
            <input
              type="range"
              step={0.1}
              min={1}
              max={3}
              className="w-5/6"
              onChange={(e) => setZoom(e.target.value)}
              value={zoom}
            />
          </label>
          <br />
          <label className="mt-5">
            Pick File
            <br />
            <input
              className="bg-sky-400 p-1 text-white cursor-pointer rounded shadow-2xl"
              type="file"
              onChange={handleImage}
            />
          </label>
        </div>
        <div className="w-full flex mt-25 justify-around">
          <button
            title="back"
            onClick={pageHandle}
            className="bg-stone-400 rounded-2xl text-white w-1/3 p-1 shadow-2xl hover:scale-95 cursor-pointer"
          >
            Back
          </button>
          <button
            title="submit"
            onClick={submitHandle}
            className="bg-lime-400 w-1/3 rounded-2xl text-white p-1 shadow-2xl hover:scale-95 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
