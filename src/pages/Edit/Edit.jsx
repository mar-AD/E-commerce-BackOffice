import React, { useState, useEffect, useContext } from "react";
import "./Edit.css";
import axios from "axios";
import {Button} from 'react-bootstrap'
import upload from '../../Assets/upload.png'
import { AuthContext } from "../../AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Edit() {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_name: "",
    role: "",
    user_image: null,
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
      try {
        const response = await axios.get(
          `https://e-commerce-project-backend-yec6.onrender.com/v1/users/${storedUserId}`
        );
        const userData = response.data;
        setUser({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          user_name: userData.user_name,
          role: userData.role,
          user_image: userData.user_image || null,
        });
      } catch (error) {
        toast.error(error)
      }
    };

    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUser((prevUser) => ({
      ...prevUser,
      user_image: file,
    }));
    authContext.setUserImage(file);
  };

  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("user_name", user.user_name);
      formData.append("email", user.email);
      formData.append("role", user.role);
      // formData.append("user_image", user.user_image || null);
      if (user.user_image) {
        formData.append("user_image", user.user_image);
      }

      const response = await axios.put(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data)
    } catch (error) {
      toast.error("Couldnr't update user", {error})
    }
  };
  

  return (
    <div className="edit-profile">
      <div className="image">
      <div  style={{
          border: ' solid var(--background2)',
          margin: '2%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#ccc',
          position:'relative'
        }}>
          {user.user_image ? (
          <img src={user.user_image instanceof File ? URL.createObjectURL(user.user_image) : (user.user_image) }
        alt="" style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer',
          position:'absolute'
        }} onClick={() => document.getElementById('image-input').click()} />
        ) : (
          <img style={{ width: "100%", height: '100%' }} src={upload} alt="" />
        )}
       <input
      type="file"
      id="image-input"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer'
      }}
      accept="image/*"
      onChange={handleImageChange}
    />
        </div>
      </div>
      <div className="blank">
        
      </div>
      <div className="middle">
        <div className="inputs">
        <label>First Name</label>
          <input
            type="text"
            value={user.first_name}
            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
          />
        </div>
        <div className="inputs">
          <label>Last Name</label>
          <input
            type="text"
            value={user.last_name}
            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
          />
        </div>
        <div className="inputs">
          <label>Role</label>
          <input
            type="text"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          />
        </div>
        
      </div>
      <div className="right">
      <div className="inputs">
      <label>Username</label>
          <input
            type="text"
            value={user.user_name}
            onChange={(e) => setUser({ ...user, user_name: e.target.value })}
          />
        </div>
        <div className="inputs">
          <label>Password</label>
          <input
            type="text"
            placeholder="#$*$#*$#$***$#"
            className="blurred-input"
            disabled
          />
        </div>
        <div className="inputs">
        <label>Email</label>
          <input
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="save-button">
          <Button type="submit" onClick={saveChanges}>Save</Button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
export default Edit ;
