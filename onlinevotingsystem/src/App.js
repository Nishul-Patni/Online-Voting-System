import React from "react";
import 'semantic-ui-css/semantic.min.css'
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import UserChoice from "./Components/UserChoice";
import AuthoritySignup from './Components/AuthoritySignup';
import VoterSignup from "./Components/VoterSignup";
import Login from "./Components/Login";
import Successfull from "./Components/Successfull";
import LoginState from "./Components/Context/LoginContext/LoginState";
import Home from "./Components/Home";
import VoterHome from "./Components/VoterHome";
import ContractState from "./Components/Context/ContractContext/ContractState";
import ElectionView from "./Components/ElectionView";

function App() {
  return (
    <div className="App">
      <LoginState>
        <ContractState>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<UserChoice/>}></Route>
              <Route exact path="/userChoice/signupAuthority" element={<AuthoritySignup/>}></Route>
              <Route exact path="/userChoice/signupVoter" element={<VoterSignup/>}></Route>
              <Route exact path="/login" element={<Login/>}></Route>
              <Route exact path="/successfull" element={<Successfull/>}></Route>
              <Route exact path="/home" element={<Home/>}></Route>
              <Route exact path="/voterhome" element={<VoterHome/>}></Route>
              <Route exact path="/Election/:address" element={<ElectionView/>}></Route>
            </Routes>
          </BrowserRouter>
        </ContractState>
      </LoginState>
    </div>
  );
}

export default App;
