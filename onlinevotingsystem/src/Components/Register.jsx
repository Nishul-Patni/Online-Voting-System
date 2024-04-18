import React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Segment,
  Input,
  Form
} from 'semantic-ui-react'
import ContractContext from './Context/ContractContext/ContractContext';
import { useContext } from 'react';
import { useState } from 'react';
import { Web3Storage, getFilesFromPath } from 'web3.storage/dist/bundle.esm.min.js';


const Register = (props) => {

    let {addVoter, addCandidateInContract} = useContext(ContractContext)
    
    let [email, setEmail] = useState('');
    let [addVoterLoading, setAddVoterLoading] = useState(false)
    let [addCandidateLoading, setAddCandidateLoading] = useState(false);
    let [file, setfile] = useState(null);
    let [data, setData] = useState({name:'', email:'', description:''});

    let address = props.address; 
    let setShowMessage = props.setShowMessage;
    let setMessageData = props.setMessageData;
    let electionName = props.electionName;
    let setReload = props.setReload;
    let reload = props.reload;

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGU3OUIxNzFCNWZmMjBFNUVEMzM0NTZkOGFhNUI4YzMyRDRhZGI5MjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njk1Mjc3NjQ1NTYsIm5hbWUiOiJkZWNlbnRyYWxpemVkRWxlY3Rpb25zIn0.C5NGlBhzQ0geOMAhY7qza7A_TWt574ORxdEPWKt7OhQ"

    const handleEmailInput = (e)=>{
        setEmail(e.target.value);
    }

    const handleAddVoter = async ()=>{
        setShowMessage(false);
        setAddVoterLoading(true);
        let res = await addVoter(address, electionName, email);
        console.log(Response);
        if(!res.status){
            setShowMessage(true);
            setMessageData({positive:false, negative:true, message:res.error});
        }else{
            setShowMessage(true);
            setMessageData({positive:true, negative:false, message:"Voter added successfully"});
        }
        setAddVoterLoading(false);
        setReload(!reload);
    }

    let handleInput = (event)=>{
        setData({...data, [event.target.name] :event.target.value});
        // console.log(data)
    }

    const handleImageInput = async (event)=>{
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0];
        var blob = file.slice(0, file.size, 'image/png'); 
        let newFile = new File([blob], 'candidatePicture.png', {type: 'image/png'});
        console.log(newFile);
        setfile(newFile);
        // file.name='candidateImage.jpg'
    }

    const storeFiles= async (file) =>{
        const storage = new Web3Storage({ token })
        const files = []
        files.push(file)

        console.log(`Uploading ${files.length} files`)
        const cid = await storage.put(files)
        return cid;
    }
    // linke to retrive file
    // https://bafybeiezepobovq3gtbg3k4jtlndtzvctf26iimvkc4bbbjbot6toofyli.ipfs.w3s.link/candidatePicture.png
    // https://cid.ipfs.w3s.link/filename


    const addCandidate = async (event)=>{
        if(data.name.length===0 || data.description.length===0 || data.email.length==0 || file===null)
        return;
        setAddCandidateLoading(true);
        console.log("Uploading image");
        const ipfsHash = await storeFiles(file);
        console.log("Image uploaded", ipfsHash);
        let response = await addCandidateInContract(address, data.name, data.description, data.email, ipfsHash);
        if(response){
            setShowMessage(true);
            setMessageData({positive:true, negative:false, message:"Candidate added successfully"})
        }else{
            setShowMessage(true);
            setMessageData({positive:false, negative:true, message:"Something went wrong (see console for details)"})
        }
        setAddCandidateLoading(false);
        setReload(!reload);
    }

    return(
        <Segment placeholder>
            <Grid columns={2} stackable textAlign='center'>
            <Divider vertical>Or</Divider>

            <Grid.Row verticalAlign='middle'>
                <Grid.Column>
                    <Input loading={addVoterLoading===true} icon='user' type="email" value={email} onChange={handleEmailInput} placeholder='Enter a Valid Email' />
                    <Button disabled={addVoterLoading===true} primary className='my-2' onClick={handleAddVoter}>Add Voter</Button>
                </Grid.Column>

                <Grid.Column>
                <Header icon>
                <Form className='small' disabled={addCandidateLoading}>
                    <Form.Field>
                        <Input required name='name' placeholder="Enter Candidate's Name here" value={data.name} onChange={handleInput}/>
                    </Form.Field>
                    <Form.Field>
                        <Input required name='description' placeholder="Enter Candidate's description here" value={data.description} onChange={handleInput}/>
                    </Form.Field>
                    <Form.Field>
                        <Input required name='email' placeholder="Enter Candidate's e-mail here" value={data.email} onChange={handleInput}/>
                    </Form.Field>
                    <Form.Field>
                        <Input required type='file' onChange={handleImageInput} val/>
                    </Form.Field>
                    <Button primary loading={addCandidateLoading} disabled={addCandidateLoading} type='submit' onClick={addCandidate}>Add Candidate</Button>
                </Form>
                </Header>
                </Grid.Column>
            </Grid.Row>
            </Grid>
        </Segment>
    )
}

export default Register;