import React, { useEffect, useState } from 'react'
import ContractContext from './ContractContext'
import getInstance from '../../../ethereum/factory';
import getElectionInstance from '../../../ethereum/election'


const ContractState = (props)=> {
  const [web3, setWeb3] = useState(null);
  const [ElectionFactory, setFactory] = useState(null);
  const [Election, setElection] = useState(null);
  const baseURL = "http://localhost:5000/api/election";

  useEffect(() => {
    async function fetchData() {
      const { web3, instance } = await getInstance();
      setWeb3(web3);
      setFactory(instance);
    }
    fetchData();
  }, []);

  const createNewElection = async (email, electionName, description) =>{
    let accounts = await web3.eth.getAccounts();
    let res;
    try{
      res = await ElectionFactory.methods.createElection(email, electionName, description)
      .send({
        from : accounts[0]
      });
      console.log("election created ", res);
      let elections = await getAllElections();
      // console.log(elections);
      let address = elections[elections.length - 1];
      // console.log(address);
      addElectionToDB('create',address);
      return res;
    }catch(error){
      console.log(error);
      return error;
    }
  }

  const addElectionToDB = async (type, address)=>{
    let data = {type, address}

    const authToken = localStorage.getItem("authToken");
  
    let url = baseURL+"/addElection"
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'auth-token' : authToken
      },
      body : JSON.stringify(data)
    });
    // console.log(response, "response of add election to db");
    return response;
  }

  const getAllElections = async ()=>{
    let res;
    try{
      res = await ElectionFactory.methods.getElections().call();
      // console.log(res);
      return res;
    }catch(error){
      console.log(error);
    }
  }

  const getElections = async (type)=>{
    if(type.length===0)
      type = localStorage.getItem('previousUserType');
    const authToken = localStorage.getItem("authToken");
    const url = baseURL + `/getElection/?type=${type}`;
    // console.log(type);
    try {
      // console.log(type);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        console.error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  const instantiateElection = async (address)=>{
    let election = await getElectionInstance(address)
    // console.log(election)
    return election;
  }

  const getElectionDetail = async (Election)=>{
    let res;
    try{
      res = await Election.methods.getElectionDetails().call();
      return res;
    }catch(error){
      console.log(error);
    }
  }

  const addCandidateInContract = async (address, candidateName, candidateDescription, candidateEmail, ipfsHash)=>{
    let accounts = await web3.eth.getAccounts();
    try{
      const Election = await instantiateElection(address)
      console.log("adding Candidate");
      let response = await Election.methods.addCandidate(candidateName, candidateDescription, candidateEmail, ipfsHash).send({from: accounts[0]});
      console.log("candidate added");
      return true;
    }catch(err){
      console.log(err);
      return false;
    }

  }

  const getCandidate = async (index, Election)=>{
    let accounts = await web3.eth.getAccounts();
    try{
      console.log("Getting candidate detail", index);
      let response = await Election.methods.getCandidateElectionEnd(index).call();
      // console.log("Getting candidate detail", index);
      console.log(response);
      return response
    }catch(err){
      console.log(err);
    }
  }

  const viewCandidates = async (address)=>{
    try{
      const Election = await instantiateElection(address);
      const accounts = await web3.eth.getAccounts();
      const electionDetail = await Election.methods.getElectionDetails().call();
      const candidateCount = electionDetail[5];
      console.log("Getting candidates to view i am in view candidates");
      let candidates = [];
      for(let i=0; i<candidateCount; i++){
        candidates.push(await getCandidateView(i, Election));
      }
      return candidates;
    }catch(error){
      console.log(error);
      return false;
    }
  }

  const getCandidateView = async (index, Election)=>{
    let accounts = await web3.eth.getAccounts();
    try{
      let response = await Election.methods.getCandidateNotOwner(index).call();
      // console.log(response);
      return response
    }catch(err){
      console.log(err);
    }
  }

  const addVoter = async (address, electionName, email)=>{
    let type = 'voter';
    const authToken = localStorage.getItem('authToken');

    // first checking the voter exsist in system or not
    let url = baseURL+`/isVoterExist/?email=${email}`;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken,
      },
    });
    let responseData = await response.json();
    if (!response.ok) {
      // voter not exists
      console.log(responseData," I am here in add voter")
      return responseData;
    }

    console.log("contract address", address);
    // voter exist
    // adding voter in contract
    try{
      const Election = await instantiateElection(address); 
      let accounts = await web3.eth.getAccounts(); 
      let password = "xyz"             //testing password
      console.log('adding voter in contract')
      response = await Election.methods.addVoter(email, password).send({from:accounts[0]});
      console.log('added')
      
      console.log('checking is voter added successfully')
      let isVOter = await Election.methods.isVoter(email).call();
      if(!isVOter){
        return {status:false, message:"something went wrong"}
      }
      
      // adding election address in voters data
      let data = {type, email, address, electionName, password};
      
      console.log('adding election address to db')
      let url = baseURL+"/addElection"
      response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'auth-token' : authToken
        },
        body : JSON.stringify(data)
      });
      // console.log(response, "response of add election to db");
      return response;
    }catch(error){
      console.log(error);
    }
  }

  const startElection = async (address)=>{
    const Election = await instantiateElection(address);
    let accounts = await web3.eth.getAccounts();
    try{
      console.log("Starting the election");
      let response = await Election.methods.startElection().send({from:accounts[0]});
      console.log("Election started", response);
      return true;
    }catch(error){
      console.log(error);
      return false;
    }
  }

  const endElections = async (address)=>{
    try{
      const Election = await instantiateElection(address);
      let accounts = await web3.eth.getAccounts();
      console.log("Ending the election");
      let response = await Election.methods.endElection().send({from:accounts[0]});
      console.log("Election Ended", response);
      return true;
    }catch(error){
      console.log(error);
      return false;
    }
  }

  const getResults = async (address)=>{
    try{
      const Election = await instantiateElection(address);
      const accounts = await web3.eth.getAccounts();
      const electionDetail = await Election.methods.getElectionDetails().call();
      const candidateCount = electionDetail[5];
      console.log("Getting results");
      let candidates = [];
      for(let i=0; i<candidateCount; i++){
        candidates.push(await getCandidate(i, Election));
      }
      console.log("completed");
      candidates.sort((a, b) => {
        if (b[2] !== a[2]) {
          return b[2] - a[2];
        } else {
          return -b[0].localeCompare(a[0]);
        }
      });
      return candidates;
    }catch(error){
      console.log(error);
      return false;
    }
  }

  const hasVoted = async (email, address, setVoted)=>{
    try{
      const Election = await instantiateElection(address);
      let res = await Election.methods.hasVoted(email).call();
      console.log(res, "from has voted");
      if(res===true){
        setVoted(true);
      }else{
        setVoted(false);
      }
      return true;
    }catch(error){
      console.log(error)
      return false;
    }
  }

  const vote = async (email, password, index, address)=>{
    try{
      const accounts = await web3.eth.getAccounts();
      const Election = await instantiateElection(address);
      let res = await Election.methods.vote(email, index, password).send({from:accounts[0]});
      console.log("successfull", res);
      return true;
    }catch(error){
      console.log(error, " <- erorr");
      return false;
    }
  }

  return (
    <ContractContext.Provider value={{createNewElection, getAllElections, addElectionToDB, getElections, getElectionDetail, instantiateElection, addVoter, addCandidateInContract, startElection, endElections, getResults, viewCandidates, vote, hasVoted}}>
        {props.children}
    </ContractContext.Provider>
  )
}

export default ContractState;
