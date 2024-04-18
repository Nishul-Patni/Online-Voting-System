import React, { useContext, useState, useEffect } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import LoginContext from "./Context/LoginContext/LoginContext";
import ContractContext from "./Context/ContractContext/ContractContext";

export default function CreateElection() {
  
  useEffect(() => {
    setUserType(localStorage.getItem('previousUserType'));
    loadUserDataFromLocalStorage()
  }, [userType])
  
  let {userData, setUserType, userType, loadUserDataFromLocalStorage} = useContext(LoginContext);
  let {createNewElection, getElections, instantiateElection, getElectionDetail} = useContext(ContractContext);
  
  let [data, setData] = useState({electionName:'', description : ''})
  let [buttonState, setButtonState] = useState(false)
  let [showMessage, setShowMessage] = useState(false)
  let [messageData, setMessageData] = useState({positive:false, negative:false, message:""});

  
  let handleInput = (event)=>{
    setData({...data, [event.target.name] :event.target.value});
  }

  let createElectionButtonHandler = async ()=>{
    setShowMessage(false);
    let {email} = userData;
    let {electionName, description} = data;
    if(electionName.length===0 || description.length===0)
      return;
    console.log(email, electionName, description);
    setButtonState(true);
    let res = await createNewElection(email, electionName, description);
    console.log(res," this is in lkfasjdlfj");
    setShowMessage(true);
    if(res.blockHash){
      setMessageData({positive:true, negative:false, message:"Election Created Successfully"});
    }else{
      setMessageData({positive:false, negative:true, message:res.message});
    }
    setButtonState(false);
  }

  return (
    <>
      <Form>
        <Form.Field>
          <label htmlFor="electionName">Election Name :</label>
          <input type="text" name="electionName" placeholder="Enter Name of Election" value={data.electionName} onChange={handleInput} required/>
        </Form.Field>
        <Form.Field>
          <label htmlFor="description">Description :</label>
          <input type="text" name="description" placeholder="Enter descripton for the election" value={data.description} onChange={handleInput} required/>
        </Form.Field>
        <Button primary type="submit" loading={buttonState} disabled={buttonState} onClick={createElectionButtonHandler}>Create Election</Button>
        {/* <Button primary type="button" onClick={addTestHandler}>test add</Button> */}
      </Form>

      {showMessage?
      <Message positive={messageData.positive} negative={messageData.negative}>
        <Message.Header>{
          messageData.positive?"Success":"Failed"
        }</Message.Header>
        <p>
          {messageData.message}
        </p>
      </Message>:''  
      }

    </>
  );
}
