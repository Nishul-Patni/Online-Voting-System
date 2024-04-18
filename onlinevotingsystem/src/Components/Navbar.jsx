import React, { useState, useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import LoginContext from './Context/LoginContext/LoginContext';

export default function Navbar(props) {
  let [activeItem, setActiveItem] = useState("Elections");
  let setShow = props.setShow;
  let {userType} = useContext(LoginContext);

  let handleItemClick = (e) => {
    setActiveItem(e.target.innerHTML);
    setShow(e.target.innerHTML);
  }


  return (
    <Menu fluid vertical style={{height : "100vh"}}>
    <Menu.Item
      name='Elections'
      active={activeItem === 'Elections'}
      onClick={(e) =>{handleItemClick(e)}}
    />
    {userType==='authority'?
      <Menu.Item
      name='Create Election'
      active={activeItem === 'Create Election'}
      onClick={(e) =>{handleItemClick(e)}}
      />:''
    }  
    <Menu.Item
      name='Profile'
      active={activeItem === 'Profile'}
      onClick={(e) =>{handleItemClick(e)}}
    />
  </Menu>
  )
};