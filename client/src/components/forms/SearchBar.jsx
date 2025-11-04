import { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";


import React from 'react'

export default function SearchBar({searchTerm, setSearchTerm}) {
    function handleSearchChange(e) {
    const {value} = e.target;
    return setSearchTerm(value)
    }
    
  return (
    <form>
        <input type="search" onChange={handleSearchChange} value={searchTerm} className="w-full border-2"/>
    <button>
        <FaSearch />
    </button>
    </form>
  )
}
