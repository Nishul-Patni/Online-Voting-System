import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Segment } from 'semantic-ui-react';
import { useContext } from 'react';
import LoginContext from './Context/LoginContext/LoginContext';
import "./CSS/general.css"

export default function UserChoice() {
  let {setUserType} = useContext(LoginContext);

  return (
    <div className="container centered-content" id='userChoiceContainer' style={{height:'100vh'}}>
        <Segment placeholder style={{width:'100vw'}}>
            <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
                <h2 className='center-text'>For Authority</h2>
                <Link to='/login'><Button className='my-2' onClick={()=>{
                  setUserType('authority')
                  localStorage.setItem('previousUserType', 'authority');
                }} primary>Login As Authority</Button></Link>
                <Link to='/userChoice/signupAuthority'><Button className='my-2' primary onClick={()=>{
                  setUserType('authority')
                  localStorage.setItem('previousUserType', 'authority');
                }}>Register An Authority</Button></Link>
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
                <h2 className='center-text'>For Voters</h2>
                <Link to='/login'><Button className='my-2' onClick={()=>{
                  setUserType('voter')
                  localStorage.setItem('previousUserType', 'voter');  
                }} primary>Login As Voter</Button></Link>
                <Link to='/userChoice/signupVoter'><Button className='my-2' primary onClick={()=>{
                  setUserType('voter')
                  localStorage.setItem('previousUserType', 'voter');  
                }}>Sign up</Button></Link>
            </Grid.Column>
            </Grid>

            <Divider vertical>Or</Divider>
        </Segment>
        <i className='angle left'></i>
    </div>
  )
}
