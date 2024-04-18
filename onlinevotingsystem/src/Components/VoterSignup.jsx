import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import LoginContext from './Context/LoginContext/LoginContext';

export default function VoterSignup() {

  let [data, setData] = useState({name:'', email:'', password:'', userId : ''});
  let [message, setMessage] = useState("");
  let [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  let {setUserType} = useContext(LoginContext);

  useEffect(() => {
      setUserType('voter');
  },[])

  let handleInput = (event)=>{
      setData({...data, [event.target.name] :event.target.value});
    //   console.log(data);
  }

  let handleSignUp = async ()=>{
    setShowMessage(false);
    console.log("Singning up Authority");

    const response = await fetch(`http://localhost:5000/api/auth/signup/voter`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(data)
      });

      let json = await response.json();

      if(json.status){
        navigate('/login')  
      }else{
        setShowMessage("ERROR");
        if(Array.isArray(json.error.errors)){
            console.log(json.error.errors[0].msg)
            setMessage(json.error.errors[0].msg);
        }else{
            setMessage(json.error)
        }
      }

      console.log(json)

    }


  return (
    <div className='container centered-content max-size'>
        <Form className='large'>
            <Form.Field>
                <label>Full Name</label>
                <input name='name' placeholder='Enter Full Name here' value={data.name} onChange={handleInput}/>
            </Form.Field>
            <Form.Field>
                <label>E-mail</label>
                <input name='email' placeholder='Enter e-mail here' value={data.email} onChange={handleInput}/>
            </Form.Field>
            <Form.Field>
                <label>User Id</label>
                <input name='userId' placeholder='Enter User ID' type='number' value={data.userId} onChange={handleInput}/>
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input name='password' placeholder='Enter Password' type='password' value={data.password} onChange={handleInput}/>
            </Form.Field>
            <Button type='submit' onClick={handleSignUp} primary>Submit</Button>
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
