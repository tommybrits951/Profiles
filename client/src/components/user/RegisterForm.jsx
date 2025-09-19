import {Link} from 'react-router'




export default function RegisterForm({ change, turnPage, formData }) {
  function changeHandler(e) {
    change(e);
  }
  function pageHandler(e) {
    e.preventDefault()
    turnPage(e)
  }

  return (
    <section className="absolute w-full h-full">
      <div className="absolute w-1/2 bg-zinc-600 top-10 rounded-xl shadow-xl left-1/4">
        <h3 className="text-center text-4xl text-white font-mono mt-5">Register User</h3>
        <form
          encType="multipart/form-data"
          className="pt-3 rounded-xl text-left p-5 mt-5"
        >
          <label className="p-2 text-lg text-white">
            First Name
            <br />
            <input
              className="bg-white w-full text-black p-1 rounded"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={changeHandler}
              autoCapitalize="true"
              required
            />
          </label>
          <br />
          <label className="p-2 text-lg text-white">
            Last Name
            <br />
            <input
              className="bg-white w-full text-black p-1 rounded"
              type="text"
              name="last_name"
              autoCapitalize="true"
              value={formData.last_name}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label className="p-2 text-lg text-white">
            Postal/Zip Code
            <br />
            <input
              className="bg-white w-full text-black p-1 rounded"
              type="number"
              name="postal"
              value={formData.postal}
              minLength={5}
              maxLength={5}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label className="p-2 text-lg text-white">
            Date of Birth
            <br />
            <input
              className="bg-white w-full text-black p-1 rounded"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label className="p-2 text-lg text-white">
            Email
            <br />
            <input
              className="bg-white w-full text-black p-1 rounded"
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label className="p-2 text-lg text-white">
            Password
            <br />
            <input
              className="bg-white w-full text-black p-1 rounded"
              type="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label className="p-2 text-lg text-white">
            Gender
            <br />
            <select
              name="gender"
              value={formData.gender}
              onChange={changeHandler}
              className="bg-white w-full text-black p-1 rounded"
            >
              <option>Private</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>
          <br />
          <div className="flex justify-around mt-5 p-5">
            <Link to={'/'} className="text-white underline text-lg rounded-lg hover:scale-95 cursor-pointer p-2">
            Sign In
            </Link>
            <button
              className="text-white bg-lime-400 px-5 py-0 rounded-lg hover:scale-95 cursor-pointer"
              value={"next"}
              title="next"
              onClick={pageHandler}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
