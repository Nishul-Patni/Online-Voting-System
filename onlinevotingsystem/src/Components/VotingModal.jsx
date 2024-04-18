import React, { useState, useContext } from 'react'
import { Button, Input, Image, Modal, Label, Card } from 'semantic-ui-react'
import ContractContext from './Context/ContractContext/ContractContext';
import LoginContext from './Context/LoginContext/LoginContext';

const VotingModal = (props) => {

    let [loading, setLoading] = useState(false);
    let [index, setIndex] = useState(null);
    let [password, setPassword] = useState('')
    let [votingLoading, setVotingLoading] = useState(false);

    let {vote} = useContext(ContractContext);
    let {userData} = useContext(LoginContext);

    let open = props.open;
    let setOpen = props.setOpen;
    let candidates = props.candidates;
    const address = props.address;
    const setMessageData = props.setMessageData;
    const setShowMessage = props.setShowMessage;
    const setReload = props.setReload;
    const reload = props.reload
    
    const handleSelect = (event)=>{
        setIndex(event.target.getAttribute('index'))
        setLoading(true);
        setPassword('');
    }

    const handleConfirmVote = async ()=>{
      if(password.length==0){
        alert("Password can't be empty");
        return;
      }
      setVotingLoading(true);
      let email = userData["voter"]["email"]
      console.log(email);
      let res = await vote(email, password, index, address)
      setVotingLoading(false);
      if(res){
        setOpen(false);
        setReload(!reload);
        setShowMessage(true);
        setMessageData({positive:true, negative:false, message:"You vote is successfully recorded"});
      }else{
        setShowMessage(true);
        setOpen(false)
        console.log(res, 'here fljfa')
        setMessageData({positive:false, negative:true, message:"Something went wrong (please see console for more information)"});
      }
    }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      style={{"height":"auto", "position":"relative", "width":'50vw'}}
      dimmer="blurring"
    >
      <Modal.Header>Select any candidate by clicking select button <br/><Label size='tiny'>Use password which is shared through email</Label></Modal.Header>
      <Modal.Content image scrolling>
        <Card.Group>
            {candidates.map((candidate, index)=>{
                return(
                  <Card key={index } fluid>
                    <Card.Content>
                        <Image
                        floated='right'
                        size='tiny'
                        src={`https://${candidate[3]}.ipfs.w3s.link/candidatePicture.png`}
                        />
                        <Card.Header>{candidate[0]}</Card.Header>
                        <Card.Meta>{candidate[2]}</Card.Meta>
                        <Card.Description>
                        {candidate[1]}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui one buttons'>
                        <Button basic color='green' disabled={loading} onClick={handleSelect} index={index}>
                            Select {candidate[0]}
                        </Button>
                        </div>
                    </Card.Content>
                </Card>
                )
              })}
        </Card.Group>
      </Modal.Content>
      
      {index!=null?
      <Modal.Actions>
      <Label size='mini'>{candidates[index][0]} is selected</Label>
        <Input type='password' placeholder="Enter password" onChange={(event)=>{setPassword(event.target.value)}}/>
        <Button color='black' disabled = {votingLoading} onClick={() => {setIndex(null); setLoading(false)}}>
          Reselect
        </Button>
        <Button
          content="Confirm Vote"
          labelPosition='right'
          icon='checkmark'
          onClick={handleConfirmVote}
          positive
          loading = {votingLoading}
          disabled = {votingLoading}
          />
      </Modal.Actions>
      :''}
    </Modal>
  )
}

export default VotingModal