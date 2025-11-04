import { useState } from "react";
import RegisterForm from "../forms/RegisterForm";
import PhotoUpload from "../forms/PhotoUpload";
import axios from "../../api/axios";
import { useNavigate } from "react-router";
const initForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  gender: "Private",
  bio: "",
  occupation: "",
  phone: "",
  email: "",
  password: "",
  city: "",
  postal: "",
  state: "AL",
  country: "USA",
};
export default function Register() {
  const [formData, setFormData] = useState(initForm);
  const [page, setPage] = useState(1);
  const [img, setImg] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const navigate = useNavigate()
  // Handle changes in form data
  function change(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Change page between user data and profile pic upload
  function turnPage(e) {
    e.preventDefault();
    const { title } = e.target;
    if (title === "next" && page === 1) {
      setPage(2);
    } else {
      setPage(1);
    }
  }

  function submit(e) {
    e.preventDefault();
    console.log(formData)
    const pkg = new FormData();
    pkg.append("img", img);
    Object.keys(formData).map((key) => pkg.append(key, formData[key]));
    Object.keys(croppedAreaPixels).map((key) =>
      pkg.append(key, croppedAreaPixels[key])
    );
    axios
      .post("/user/register", pkg)
      .then((res) => {
        console.log(res.data);
        navigate("/")
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {page === 1 ? (
        <RegisterForm change={change} formData={formData} turnPage={turnPage} />
      ) : (
        <PhotoUpload
          turnPage={turnPage}
          setCroppedAreaPixels={setCroppedAreaPixels}
          croppedAreaPixels={croppedAreaPixels}
          img={img}
          setImg={setImg}
          submit={submit}
        />
      )}
    </>
  );
}
