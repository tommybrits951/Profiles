import { Link } from "react-router";
const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
  "AS",
  "GU",
  "MP",
  "PR",
  "UM",
  "VI",
];
export default function IdentityForm({ change, turnPage, formData }) {
  function changeForm(e) {
    return change(e);
  }

  function pageHandle(e) {
    return turnPage(e);
  }

  return (
    <section className="text-center top-5 rounded shadow-2xl absolute w-6/8 left-1/8 bg-stone-400">
      <h2 className="text-4xl m-5">Register User</h2>
      <form
        encType="multipart/form-data"
        className="form-grid h-5/6 bg-stone-200"
      >
        <div className="form-col-1">
          <label className="text-black">
            First Name <span className="text-red-700">*</span>
            <br />
            <input
              className="w-5/6 bg-white p-1 rounded"
              type="text"
              title="name"
              name="firstName"
              value={formData.firstName}
              onChange={changeForm}
              required
            />
          </label>

          <label className="text-black">
            Middle Name
            <br />
            <input
              className="w-5/6 bg-white p-1 rounded"
              type="text"
              title="name"
              name="middleName"
              value={formData.middleName}
              onChange={changeForm}
              required
            />
          </label>

          <label className="text-black">
            Last Name <span className="text-red-700">*</span>
            <br />
            <input
              className="w-5/6 bg-white p-1 rounded"
              type="text"
              title="name"
              name="lastName"
              value={formData.lastName}
              onChange={changeForm}
              required
            />
          </label>

          <label className="text-black">
            Date of Birth <span className="text-red-700">*</span>
            <br />
            <input
              className="bg-white w-5/6 p-1 rounded"
              type="date"
              title="info"
              name="dob"
              value={formData.dob}
              onChange={changeForm}
              required
            />
          </label>

          <label className="text-black">
            Email <span className="text-red-700">*</span>
            <br />
            <input
              className="bg-white w-5/6 p-1 rounded"
              type="email"
              title="contact"
              name="email"
              value={formData.email}
              onChange={changeForm}
              required
            />
          </label>

          <label className="text-black">
            Password <span className="text-red-700">*</span>
            <br />
            <input
              className="bg-white w-5/6 p-1 rounded"
              type="password"
              title="contact"
              name="password"
              value={formData.password}
              onChange={changeForm}
              required
            />
          </label>
        </div>

        <div className="form-col-2">
          <label className="text-black">
            Gender <span className="text-red-700">*</span>
            <br />
            <select
              name="gender"
              title="info"
              onChange={changeForm}
              className="bg-white w-5/6 p-1 rounded"
              required
            >
              <option>Private</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>

          <label className="text-black">
            Phone Number
            <br />
            <input
              type="number"
              title="contact"
              name="phone"
              value={formData.phone}
              onChange={changeForm}
              className="bg-white w-5/6 p-1 rounded"
            />
          </label>

          <label className="text-black">
            Location City
            <br />
            <input
              type="text"
              title="location"
              name="city"
              value={formData.city}
              onChange={changeForm}
              className="bg-white w-5/6 p-1 rounded"
            />
          </label>

          <label className="text-black">
            Location Postal/Zip Code
            <br />
            <input
              type="number"
              title="location"
              name="postal"
              value={formData.postal}
              onChange={changeForm}
              className="bg-white w-5/6 p-1 rounded"
            />
          </label>

          <label className="text-black">
            State/Province
            <select
              className="bg-white w-5/6 p-1 rounded"
              title="location"
              name="state"
              onChange={changeForm}
              required
            >
              {states.map((itm, idx) => {
                return <option key={idx}>{itm}</option>;
              })}
            </select>
          </label>

          <label className="text-black">
            Occupation
            <br />
            <input
              type="text"
              title="info"
              name="occupation"
              value={formData.occupation}
              onChange={changeForm}
              className="bg-white w-5/6 p-1 rounded"
            />
          </label>
        </div>
        <label className="text-black bio">
          Bio
          <br />
          <textarea
            className="bg-white w-5/6 p-1 rounded"
            name="bio"
            value={formData.bio}
            onChange={changeForm}
          />
        </label>

        <div className="flex justify-around row-start-10 col-start-1 col-end-3">
          <Link
            className="bg-gray-400 rounded shadow-lg text-white cursor-pointer p-2 hover:scale-95 mb-5"
            to={"/"}
          >
            Cancel
          </Link>
          <button
            title="next"
            className="bg-gray-400 rounded shadow-lg text-white cursor-pointer p-2 hover:scale-95 mb-5"
            onClick={pageHandle}
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
}
