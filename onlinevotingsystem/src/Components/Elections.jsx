import React, { useEffect, useState, useContext } from 'react'
import ElectionCard from './ElectionCard';
import ContractContext from './Context/ContractContext/ContractContext';
import LoginContext from './Context/LoginContext/LoginContext'
import Loading from './Loading';

export default function Elections() {

  let [elections, setElections] = useState([]);
  let [electoinDetails, setElectionDetails] = useState([]);
  let [loading, setLoading] = useState(false)

  const {getElections, getElectionDetail, instantiateElection} = useContext(ContractContext)
  let {userType, setUserType, loadUserDataFromLocalStorage} = useContext(LoginContext);

  useEffect(() => {
    // load resources first here
    setUserType(localStorage.getItem('previousUserType'));
    loadUserDataFromLocalStorage();

    // fetch data to render
    async function fetchData() {
      setLoading(true);
      console.log("in use effect")
      let res = await getElections(userType);
      console.log(res, "Printing res")
      setElections(res.elections)
      elections = res.elections
      // console.log(elections)
      if (res.elections.length > 0) {
        const details = [];

        for (const address of elections) {
          // console.log(address)
          const election = await instantiateElection(address);
          
          const detail = await getElectionDetail(election);
          let{0:authority, 1:electionName, 2:authorityEmail, 3:description, 4:status, 5:candidatesCount, 6:totalVoters, 7:totalVotes} = detail;
          let statusDescription
          if(status==0){
            statusDescription = "Election Ended ⚫"
          }else if(status==1){
            statusDescription = "Registration Phase 🟢"
          }else{
            statusDescription = "Voting Phase 🔴"
          }
          details.push({authority, electionName, authorityEmail, description, status, candidatesCount, totalVoters, totalVotes, statusDescription});
        }
        setElectionDetails(details);
      }
      setLoading(false);
    }
    fetchData();
  }, []); 
  
  return (
    <>
      <h2>Elections</h2>
      {loading===true?<Loading message={{messageHeader:"Loading...", messageDescription:"We are fetching that Elections for you."}}/>:""}
      {/* <Loading/> */}
      {elections.length==0?<h3>No Elections To Show</h3>:''}
      {electoinDetails.map((election, index)=>{
        return <ElectionCard key={elections[index]} election = {election} address={elections[index]}/>
      })}

    </>
  )
}




  // sample election
  // let elections =[
  //   {
  //     electionName : "Test 1",
  //     authorityEmail : "testEmail@123.com",
  //     description : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum, quis! Beatae, pariatur obcaecati. Minima illo veritatis provident eius, corrupti esse.",
  //     status : 0,
  //     candidatesCount : 5,
  //     totalVoters : 100,
  //     totalVotes : 0
  //   }
  // ] 