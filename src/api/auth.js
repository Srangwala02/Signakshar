import defaultUser from "../utils/default-user";

import { toastDisplayer } from "../components/toastDisplay/toastDisplayer";
import axios from "axios";

export async function signIn(email, password) {
  try {
    // Send request
    console.log(email, password);
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });
      const token = response.data.jwt;
      console.log("token", token);
      // Save the token to localStorage or any other preferred storage mechanism
      localStorage.setItem("jwt", token);

      // You can perform additional actions after successful login, such as redirecting the user
      console.log("Login successful!", token);

      toastDisplayer("success", "Login Successful");
      //  console.log(user);
      // return response;
      return {
        isOk: true,
        // data: defaultUser
        data: token,
      };
    } catch (error) {
      console.error("Error during login:", error?.response?.data?.detail);
      // setLoading(false);
      return toastDisplayer("error", error?.response?.data?.detail);
    }
  } catch {
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

export async function signInWithGoogleAPI(access_token) {
  try {
    // Send request
    console.log(access_token);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/googleLogIn/",
        {
          token: access_token,
        }
      );
      const token = response.data.jwt;
      console.log("token", token);
      // Save the token to localStorage or any other preferred storage mechanism
      localStorage.setItem("jwt", token);

      // You can perform additional actions after successful login, such as redirecting the user
      console.log("Login successful!", token);

      toastDisplayer("success", "Login Successful");
      //  console.log(user);
      // return response;
      return {
        isOk: true,
        // data: defaultUser
        data: token,
      };
    } catch (error) {
      console.error("Error during login:", error);
      // setLoading(false);
      return toastDisplayer("error", "Invalid User");
    }
  } catch {
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

export async function getUser() {
  try {
    const jwtToken = localStorage.getItem("jwt");
    await axios.get("http://localhost:8000/api/user/", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return {
      isOk: true,
      data: jwtToken,
      // data: defaultUser
    };
  } catch (error) {
    return {
      isOk: false,
    };
    // console.error("Error fetching user data:", error);
  }
  // try {
  //   // Send request
  //   const storedJwt=localStorage.getItem("jwt");
  //   if(storedJwt){
  //     return {
  //       isOk: true,
  //       data:storedJwt
  //       // data: defaultUser
  //     };
  //   }
  //   else{
  //     return{
  //       isOk:false
  //     }
  //   }

  // }
  // catch {
  //   return {
  //     isOk: false
  //   };
  // }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to create account",
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}

export async function Logout() {
  try {
    localStorage.removeItem("jwt");
    try {
      return {
        isOk: false,
      };
    } catch (error) {}
  } catch {}
}
