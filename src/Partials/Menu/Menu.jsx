import React,{ useState, useEffect, useContext } from "react";
import "./Menu.css";
import { Link, useLocation} from "react-router-dom";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import logodark from "../../Assets/aaa.png";
import logo from "../../Assets/tst.png";
import { AuthContext } from "../../AuthContext";
import CategoryIcon from "@mui/icons-material/Category"; 
import ClassIcon from "@mui/icons-material/Class";
import upload from '../../Assets/upload.png'


function Menu() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const authContext = useContext(AuthContext);
  const [userImage, setUserImage] = useState(authContext.userImage);
  const loca = useLocation();


  useEffect(() => {
    setUserImage(authContext.userImage);
  }, [authContext.userImage]);

  useEffect(() => {
    const currentPage = loca.pathname.split('/').pop();
    console.log(currentPage);
    setSelectedItem(currentPage || 'dashboard');
  }, [loca.pathname]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const userName = authContext.decodedToken ? authContext.decodedToken.name : "..."; 

  const darkModeCheck = () =>{
    setIsDarkMode(!isDarkMode)
    if (isDarkMode){
      document.documentElement.classList.remove('isLightMode')
    } else{
      document.documentElement.classList.add('isLightMode')
    }
  } 


  return (
    <div className="Menu">
      <div className="SideBar">
        <div className="logo">
          <img src={isDarkMode ? logodark : logo} alt="" />
        </div>
        <div className="profile">
        {userImage ? (
        <img src={userImage instanceof File ? URL.createObjectURL(userImage) : userImage} alt="" style={{
          margin: '2%',
          width: '85px',
          height: '85px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#ccc',
        }}/>
        ) : (
          <img style={{ width: '95px',height: '95px',}} src={upload} alt="" />
        )}
          <span>{userName }</span>
          <Link to="/Edit">
            <button> Edit</button>
          </Link>
        </div>
        <div className="list">
      <ul>
        <li className={`menu-item ${selectedItem === 'dashboard' ? 'active' : ''}`}>
          <Link to="/Dashboard" className="item1" onClick={() => handleItemClick('dashboard')}>
            <DashboardRoundedIcon />
            Dashboard
          </Link>
        </li>
        <li className={`menu-item ${selectedItem === 'Users' ? 'active' : ''}`}>
          <Link to="/Users" className="item1" onClick={() => handleItemClick('Users')}>
            <AccountCircleIcon />
            Users
          </Link>
        </li>
        <li className={`menu-item ${selectedItem === 'Customers' ? 'active' : ''}`}>
          <Link to="/Customers" className="item1" onClick={() => handleItemClick('Customers')}>
            <PeopleAltIcon />
            Customers
          </Link>
        </li>
        <li className={`menu-item ${selectedItem === 'Products' ? 'active' : ''}`}>
          <Link to="/Products" className="item1" onClick={() => handleItemClick('Products')}>
            <ShoppingBagIcon />
            Products
          </Link>
        </li>
        <li className={`menu-item ${selectedItem === 'Categories' ? 'active' : ''}`}>
          <Link to="/Categories" className="item1" onClick={() => handleItemClick('Categories')}>
            <CategoryIcon />
            Categories
          </Link>
        </li>
        <li className={`menu-item ${selectedItem === 'SubCategories' ? 'active' : ''}`}>
          <Link to="/SubCategories" className="item1" onClick={() => handleItemClick('SubCategories')}>
            <ClassIcon />
            SubCategories
          </Link>
        </li>
        <li className={`menu-item ${selectedItem === 'Orders' ? 'active' : ''}`}>
          <Link to="/Orders" className="item1" onClick={() => handleItemClick('Orders')}>
            <ShoppingCartIcon />
            Orders
          </Link>
        </li>
        {/*  */}
      </ul>
    </div>
      </div>
      <div className="dark-mode-switch">
        <p  className="dark-label">Light</p>
        <input type="checkbox" id="dark-mode-toggle" checked={isDarkMode} onChange={darkModeCheck}/>
        <label htmlFor="dark-mode-toggle"></label>
        <p className="dark-label">Dark</p>
      </div>
    </div>
  );
}

export default Menu;
