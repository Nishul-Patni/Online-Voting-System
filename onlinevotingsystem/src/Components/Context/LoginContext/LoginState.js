import { useState} from "react";
import LoginContext from "./LoginContext";
import React from 'react'


const LoginState = (props)=>{

    let [userType, setUserType] = useState('');
    // let [userTy]
    let [userData, setUserData] = useState({});
    let [authToken, setAuthToken] = useState(null);

    const loginUsingEmail = async (email, password)=>{
      console.log(userType);
      let data = {email, password};

      const url = `http://localhost:5000/api/auth/login/${userType}`;

      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(data)
      });

      let json = await response.json();
      console.log(json);
      if(json.status){
        console.log("I am here in login using email", json.data, json.authToken)
        setUserData(json.data);
        setAuthToken(json.authToken);
        saveUserDataInLocalStorage(json.data, json.authToken)
        return json;
      }else{
        return json;
      }
    }

    const saveUserDataInLocalStorage = (userData, authToken)=>{
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("authToken", authToken);
    }

    const loadUserDataFromLocalStorage = async ()=>{
      setUserData(await JSON.parse(localStorage.getItem("userData")));
      setAuthToken(localStorage.getItem("authToken"));
    }

  return (
    <LoginContext.Provider value={{userType, setUserType, loginUsingEmail, userData, setUserData, saveUserDataInLocalStorage, loadUserDataFromLocalStorage, authToken, setAuthToken}}>
        {props.children}
    </LoginContext.Provider>
  )
}


export default LoginState;