import React from 'react'
import './Shorts.css'
import  logo from'../../assets/logo.png'

const Shorts = (setSearchValue, searchValue, handleSearch) => {
  return (
    <div>
      {/*search bar */}
      <div className='body'>
       </div>
      
        <div className="search-bar">
      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button className="search-arrow" onClick={handleSearch} tabIndex={-1}>
        &gt;
      </button>
    </div>
    <div className='logo'>
        <h1>propy Ai</h1>
   </div>  
 </div>
  )
}

export default Shorts
