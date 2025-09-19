import { useContext, useState } from "react";
import ProfileContext from "../../context/ProfileContext";
import RegisterForm from "./RegisterForm";
import PhotoUpload from "./PhotoUpload";
import axios from "../../api/axios";
import { useNavigate } from "react-router";
const initForm = {
  first_name: "",
  last_name: "",
  postal: "",
  email: "",
  gender: "Private",
  dob: "",
  password: "",
};

export default function Register() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(initForm);
  const [err, setErr] = useState("");
  const [img, setImg] = useState(null);
  const [areaPixels, setAreaPixels] = useState(null);
const navigate = useNavigate()
  function change(e) {
    const { name, value } = e.target;
    setErr("");
    setFormData({ ...formData, [name]: value });
  }

  function submit(e) {
    e.preventDefault();
    const pkg = new FormData();
    Object.keys(formData).map((key) => {
      pkg.append(key, formData[key]);
    });
    Object.keys(areaPixels).map((key) => {
      pkg.append(key, areaPixels[key])
    })
    pkg.append("img", img);
    axios
      .post("/user", pkg)
      .then((res) => {
        console.log(res.data);
        navigate('/')
      })
      .catch((err) => console.log(err));
  }

  function turnPage(e) {
    const { title } = e.target;
    if (title === "next" && page === 1) {
      setPage(2);
    } else if (title === "back" && page === 2) {
      setPage(1);
    }
  }

  return (
    <div>
      {page === 1 ? (
        <RegisterForm formData={formData} change={change} turnPage={turnPage} />
      ) : page === 2 ? (
        <PhotoUpload
          img={img}
          submit={submit}
          turnPage={turnPage}
          setImg={setImg}
          setAreaPixels={setAreaPixels}
        />
      ) : null}
    </div>
  );
}
