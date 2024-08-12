import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  getUser,
  signIn as sendSignInRequest,
  Logout,
  signInWithGoogleAPI,
} from "../api/auth";
import { toastDisplayer } from "../components/toastDisplay/toastDisplayer";
import axios from "axios";
import { useNavigate} from 'react-router-dom';

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const result = await getUser();
      if (result.isOk) {
        setUser(result.data);
      }

      setLoading(false);
    })();
  }, []);

  // Use useEffect to handle redirection after login
  // useEffect(() => {
  //   if (user) {
  //     // const redirectUrl = localStorage.getItem('initialUrl') || '/userdashboard';
  //     const redirectUrl = localStorage.getItem('initialUrl');
  //     localStorage.removeItem('initialUrl');
  //     console.log(redirectUrl);
  //     navigate(redirectUrl); // Redirect to the saved URL or default to the dashboard
  //   }
  // }, [user]);

  const signIn = useCallback(async (email, password) => {
    // console.log("here");
    const result = await sendSignInRequest(email, password);
    // console.log("result", result);
    // setUser
    // try {
    //   const response = await axios.post("http://localhost:8000/api/login/", {
    //     email,
    //     password,
    //   });
    //   const token = response.data.jwt;
    //   console.log("token",token)
    //   // Save the token to localStorage or any other preferred storage mechanism
    //   localStorage.setItem("jwt", token);

    //   // You can perform additional actions after successful login, such as redirecting the user
    //   console.log("Login successful!", token);

    //   if (response.isOk) {
    //     setUser(response.data);
    //   }

    //    toastDisplayer("success","Login Successfull")
    //    console.log(user);
    //   return response;
    // } catch (error) {
    //   console.error("Error during login:", error);
    //   setLoading(false);
    //   return toastDisplayer("error","Invalid User");
    // }
    if (result.isOk) {
      // console.log(result.data);
      setUser(result.data);
      // const redirectUrl = localStorage.getItem('redirectUrl') || '/userdashboard';
      // console.log(redirectUrl);
      // localStorage.removeItem('redirectUrl');
      // navigate(redirectUrl); 
    }
  }, []);

  const signInWithGoogle = useCallback(async (data) => {
    console.log("here", data.access_token);
    const result = await signInWithGoogleAPI(data.access_token);
    console.log("result", result);
    if (result.isOk) {
      console.log(result.data);
      setUser(result.data);
    }
  }, []);

  const signOut = useCallback(() => {
    const result = Logout();
    if (!result.isOk) {
      setUser(undefined);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, loading, signInWithGoogle }}
      {...props}
    />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
