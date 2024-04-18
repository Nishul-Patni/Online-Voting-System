import React from 'react'
import LoginContext from './Context/LoginContext/LoginContext'
import { useContext } from 'react'

export default function Successfull() {
  let {userType} = useContext(LoginContext);
  return (
    <div>Successfull {userType}</div>
  )
}
