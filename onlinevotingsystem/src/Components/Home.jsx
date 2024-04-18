import React from 'react'
import Navbar from './Navbar';
import { Grid, Segment } from 'semantic-ui-react';
import Elections from './Elections';
import Profile from './Profile';
import CreateElection from './CreateElection';
import { useState, useContext, useEffect } from 'react';
import LoginContext from './Context/LoginContext/LoginContext';

export default function AuthorithHome() {

  let {setUserType, userType} = useContext(LoginContext);
  useEffect(() => {
    setUserType(localStorage.getItem('previousUserType'));
  }, [userType])
  
  let [show, setShow] = useState("Elections");
  
  return (
    <>
      <Grid style={{marginTop:"2px"}}>
          <Grid.Column width={2}>
            <Navbar setShow={setShow}/>
          </Grid.Column>
          <Grid.Column stretched width={11}>
            <Segment>
              {show==='Elections'?<Elections/>:show==='Create Election'?<CreateElection/>:<Profile/>}
            </Segment>
          </Grid.Column>
        </Grid>
    </>
  )
}
