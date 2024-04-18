import React, { useState, useEffect, useContext } from 'react'
import { Divider, Card, Image, Header, Icon, Table, Container, Message, Button } from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import ContractContext from './Context/ContractContext/ContractContext';
import LoginContext from './Context/LoginContext/LoginContext';
import Loading from './Loading';
import Register from './Register';
import ResultTable from './ResultTable';
import Candidates from './Candidates';
import VotingModal from './VotingModal';

export default function ElectionView() {
  const { address } = useParams();
  let [loading, setLoading] = useState(false);
  let [electoinDetails, setElectionDetails] = useState({});
  let [messageData, setMessageData] = useState({});
  let [showMessage, setShowMessage] = useState(false);
  let [statusLoading, setStatusLoading] = useState(false);    // for loading start and end election
  let [reload, setReload] = useState(false);
  let [candidates, setCandidates] = useState([]);
  let [open, setOpen] = useState(false)
  let [voted, setVoted] = useState(false);

  const { getElectionDetail, instantiateElection, startElection, endElections, hasVoted} = useContext(ContractContext)
  let { userType ,setUserType, loadUserDataFromLocalStorage} = useContext(LoginContext);

  useEffect(() => {
    // load resources first here
    setUserType(localStorage.getItem('previousUserType'));
    loadUserDataFromLocalStorage();
    // fetch data to render
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [reload]);

  // this fetches details of the election
  const fetchData = async() => {
    setLoading(true);
    console.log("addres of election form election view", address)
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
    setElectionDetails({authority, electionName, authorityEmail, description, status, candidatesCount, totalVoters, totalVotes, statusDescription});
    setLoading(false);
    if(userType=='voter'){
      let {email} = JSON.parse(localStorage.getItem('userData'))["voter"]
      let response = await hasVoted(email, address, setVoted);
    }
    // console.log(email, "-")
  }

  const handleStartElection = async () =>{
    setStatusLoading(true);
    let response = await startElection(address);
    setShowMessage(true)
    if(response){
      setMessageData({positive:true, message:"Elections Started"});
      setStatusLoading(false);
      setReload(!reload);
    }else{
      setMessageData({positive:false, negative:true, message:"Something went wrong (see console for more information)"});
      setStatusLoading(false);
    }
  }

  const handleEndElection = async ()=>{
    setStatusLoading(true);
    let response = await endElections(address);
    setShowMessage(true)
    if(response){
      setMessageData({positive:true, message:"Elections Ended Successfully"});
      setStatusLoading(false);
      setReload(!reload);
    }else{
      setMessageData({positive:false, negative:true, message:"Something went wrong (see console for more information)"});
      setStatusLoading(false);
    }
  }

  const handleVote = async ()=>{
    setOpen(true);
  }

  return (
    <>
      {loading==true?<Loading message={{messageHeader:"Loading...", messageDescription:"We are fetching Election Details for you."}}/>:
        <Container style={{"border":"2px solid #d9d7d7", "padding":"0.5rem", "border-radius":"0.3rem", "minHeight":"100vh"}}>
          <div style={{"display":"flex", "justifyContent":"space-between", "alignItems":"center"}}>
            <Header as='h1'>{electoinDetails.electionName}</Header>
            <div>
              {electoinDetails.status==1 && userType=='authority'?<Button loading={statusLoading} disabled={statusLoading} primary onClick={handleStartElection}>Start Elections</Button>:''}
              {electoinDetails.status==2 && userType=='authority'?<Button loading={statusLoading} disabled={statusLoading} primary onClick={handleEndElection}>End Elections</Button>:''}
              {(electoinDetails.status==2 && userType=='voter' && !voted)?<Button loading={statusLoading} disabled={statusLoading} primary open={open} setOpen={setOpen} onClick={handleVote}>Vote</Button>:''}
            </div>
          </div>
          <Divider horizontal>
            <Header as='h4'>
              <Icon name='tag' />
              Description
            </Header>
          </Divider>

          <p>
            {electoinDetails.description}
          </p>

          <Divider horizontal>
            <Header as='h4'>
              <Icon name='bar chart' />
              About Election
            </Header>
          </Divider>

          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={3}>Status</Table.Cell>
                <Table.Cell>{electoinDetails.statusDescription}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width={3}>Number Of Candidates</Table.Cell>
                <Table.Cell>{electoinDetails.candidatesCount}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width={3}>Number Of Voters</Table.Cell>
                <Table.Cell>{electoinDetails.totalVoters}</Table.Cell>
              </Table.Row>
              {electoinDetails.status==1? console.log(electoinDetails.status):
              <Table.Row>
                <Table.Cell width={3}>Total Votes</Table.Cell>
                <Table.Cell>{electoinDetails.totalVotes}</Table.Cell>
              </Table.Row>
              }
            </Table.Body>
          </Table>
          {userType=='authority' && electoinDetails.status==1?<Register setReload={setReload} reload={reload} address={address} electionName={electoinDetails.electionName} setShowMessage={setShowMessage} setMessageData={setMessageData} />:''}
          {electoinDetails.status==2  && userType=='authority'?
            <Message icon>
              <Icon name='circle notched' loading />
              <Message.Content>
                <Message.Header>Election Started</Message.Header>
                For ending the election Please Click on End Election Button
              </Message.Content>
            </Message>: ''
          }
          
          {electoinDetails.status==1  && userType=='voter'?
            <Message icon>
              <Icon name='pencil alternate'/>
              <Message.Content>
                <Message.Header>Registerd</Message.Header>
                You have been successfully register for the election for any queries contact authority at {electoinDetails.authorityEmail}
              </Message.Content>
            </Message>: ''
          }

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

          {electoinDetails.status==2  && userType=='voter'?
            <Message icon>
              <Icon name='user'/>
              <Message.Content>
                <Message.Header>Voting Started</Message.Header>
                To Vote click on the Vote button above
              </Message.Content>
            </Message>: ''
          }
          <Candidates address={address} setCandidates={setCandidates} candidates={candidates}/>
          {electoinDetails.status==0?<ResultTable address={address} setShowMessage={setShowMessage} setMessageData={setMessageData}/>:''}
            <VotingModal open={open} setOpen={setOpen} candidates={candidates} address={address} setMessageData={setMessageData} setShowMessage={setShowMessage} setReload={setReload} reload={reload}/>
        </Container>
      }
    </>
  )
}
