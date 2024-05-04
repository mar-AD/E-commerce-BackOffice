import React, { useState, useContext } from "react";
import "./Navbar.css";
import SearchIcon from '@mui/icons-material/Search';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { AuthContext } from "../../AuthContext";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Button } from "react-bootstrap";

const Navbar = ({handleSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isIconVisible, setIconVisibility] = useState(true);
  const authCtx = useContext(AuthContext);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleIconClick = () => {
    handleSearch(searchValue);
    console.log('Searching for:', searchValue);
    setIconVisibility(false);
  };
  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(searchValue);
    }
  };
  const logOutHandler = (e) => {
    authCtx.logout();
  };


  function getCurrentDate() {
    const currentDate = new Date();
  
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateLocaleString = currentDate.toLocaleDateString(undefined, options);
  
    return dateLocaleString;
  }
  
  return (
    <div className="navbars">
      <div className="search" onSubmit={(e) => e.preventDefault()}>
      {isIconVisible && <SearchIcon onClick={handleIconClick} className="search-icon" />}
      <input
        type="text"
        placeholder="Search something..."
        className="search-input"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
    </div>
      <div className="right-buttons">
      <Button className="date" style={{backgroundColor: "var(--background2)", border:"var(--background2)", color:"var(--background)", padding: "9px", cursor:'inherit', borderRadius:'15px'}}>
      <CalendarMonthIcon/> {getCurrentDate()}
      </Button>
      <button className="notifications" type="button">
        <NotificationsRoundedIcon className="noti-img"/>
        </button>
      <button className="logout" type="Logout" onClick={logOutHandler}>
        <LogoutRoundedIcon/>
      </button>
      </div>
    </div>
  );
};

export default Navbar;
