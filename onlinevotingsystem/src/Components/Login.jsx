import React from 'react'
import { Button, Form, Message, Header } from 'semantic-ui-react';
import { useState, useContext, useEffect } from 'react';
import LoginContext from './Context/LoginContext/LoginContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  let [data, setData] = useState({email:'', password:''});
  let [message, setMessage] = useState("");
  let [showMessage, setShowMessage] = useState(false);
  let {loginUsingEmail, userType, setUserType, setUserData, saveUserDataInLocalStorage} = useContext(LoginContext);
  const navigate = useNavigate();


  useEffect(() => {
    setUserType(localStorage.getItem('previousUserType'));
  }, [userType])
  

  let handleLogin = async ()=>{
    let res = await loginUsingEmail(data.email, data.password);
    console.log(res);
    if(res.status){
      if(userType === 'authority'){
        setUserData(res.data.authority)
        saveUserDataInLocalStorage(res.data.authority, res.authToken)
        console.log(localStorage.getItem('userData')," here2");
        navigate('/home');
      }
      else{
        setUserData(res.data.voter);
        navigate('/home');
      }
    }else{
      setShowMessage("ERROR");
      console.log(res, "HI");
      if(!res.errors && Array.isArray(res.error.errors)){
        console.log(res.error.errors[0].msg)
        setMessage(res.error.errors[0].msg);
      }else{
          setMessage(res.error)
      }
    }
  }

  let handleInput = (event)=>{
    setData({...data, [event.target.name] :event.target.value});
    // console.log(data)
  }

  return (
    <div className='container centered-content max-size'>
      <Header as={'h1'}>Login in as {userType}</Header>
      <Form className='large'>
        <Form.Field>
            <label>E-mail</label>
            <input name='email' placeholder='Enter e-mail here' value={data.email} onChange={handleInput}/>
        </Form.Field>
        <Form.Field>
            <label>Password</label>
            <input name='password' placeholder='Enter Password' type='password' value={data.password} onChange={handleInput}/>
        </Form.Field>

        <Button type='submit' onClick={handleLogin} primary>Login</Button>
        {showMessage==="ERROR"?
                <Message negative>
                    <Message.Header>ERROR</Message.Header>
                    <p>{message}</p>
                </Message>:''
        }
      </Form>
    </div>
  )
}
