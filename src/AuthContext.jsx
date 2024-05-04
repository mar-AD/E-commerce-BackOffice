

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext({
  token: "",
  refToken: "",
  decodedToken: null,
  userImage: null,
  login: (access, refresh) => {},
  logout: () => {},
  setUserImage: (image) => {},
});

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
  const [refToken, setRefToken] = useState(localStorage.getItem("refreshToken") || null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [userImage, setUserImage] = useState(null);

  const loginHandler = (access, refresh) => {
    setAuthToken(access);
    setRefToken(refresh);
    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
  };

  const logoutHandler = () => {
    setAuthToken(null);
    setRefToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  };

  const setUserImageHandler = (image) => {
    setUserImage(image);
  };

  const refreshAccessToken = async () => {
    try {
      if (refToken) {
        const decodedRefreshToken = decodeJwt(refToken);
        const currentTime = Date.now() / 1000;

        if (currentTime <= decodedRefreshToken.exp) {
          const config = {
            headers: {
              Authorization: `Bearer ${refToken}`,
            },
          };
          const response = await axios.post("https://e-commerce-project-backend-yec6.onrender.com/v1/refresh/token", {}, config);

          const { access_token } = response.data;
          setAuthToken(access_token);
          localStorage.setItem("token", access_token);
        } else {
          logoutHandler();
          return;
        }
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      logoutHandler();
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      if (authToken) {
        const decoded = decodeJwt(authToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && currentTime > decoded.exp) {
          await refreshAccessToken();
        } else {
          setDecodedToken(decoded);
          loginHandler(authToken, refToken);
          const storedUserId = localStorage.getItem("userId");
          try {
            const response = await axios.get(`https://e-commerce-project-backend-yec6.onrender.com/v1/users/${storedUserId}`);
            const userData = response.data;
            setUserImage(userData.user_image || null);
          } catch (error) {
            console.error("Error fetching user image:", error);
          }
        }
      } else {
        logoutHandler();
      }
    };

    checkAuthentication();
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{
        token: authToken,
        refresh: refToken,
        decodedToken: decodedToken,
        userImage: userImage,
        login: loginHandler,
        logout: logoutHandler,
        setUserImage: setUserImageHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
