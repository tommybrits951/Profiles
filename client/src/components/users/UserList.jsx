import { useContext, useState, useEffect } from "react";
import ProfileContext from "../../context/ProfileContext";
import UserCard from './UserCard';
import { FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
import debounce from 'lodash/debounce';

export default function UserList() {
  const { 
    userList, 
    
  } = useContext(ProfileContext);

  const [filter, setFilter] = useState('all'); // all, friends, pending
  const [sortBy, setSortBy] = useState('name'); // name, location, recent
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearchChange(e) {
    const {value} = e.target;
    return setSearchTerm(value)
  }
  return (
    <section className="fixed w-1/2 h-6/7 top-18 left-1/4 border-2 inset-0 bg-white shadow-lg rounded-lg overflow-hidden m-4">
      <div className="flex">
        <input type="search" onChange={handleSearchChange} value={searchTerm} className="w-full border-2"/>
        <button>
          <FaSearch />
        </button>
      </div>
      {userList && userList.map((person, idx) => {
        return (
          <li key={idx}>
            <UserCard person={person} />
          </li>
        )
      })}
    </section>
  );
}
