import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { Card, Icon, Image, Container } from 'semantic-ui-react'
import ContractContext from './Context/ContractContext/ContractContext';
import Loading from './Loading';

export default function Candidates(props) {

    let [loading, setLoading] = useState(false);
    
    const address = props.address;
    const candidates = props.candidates;
    const setCandidates = props.setCandidates;

    const {viewCandidates} = useContext(ContractContext);
    
    useEffect(() => {
        fetchCandidateData();
    }, [])
    
    const fetchCandidateData = async ()=>{
        setLoading(true);
        let res = await viewCandidates(address);
        if(res===false){
            // todo
        }else{
            setCandidates(res);
        }
        setLoading(false);
    }

  return (
    <>
        <h3>Registered Candidates</h3>
        {loading?
            <Loading message={{messageHeader:"Wait For a Second", messageDescription:"Fetching registered candidate list of the election"}}/>
        :candidates.length!=0?
            <div style={{"display": "flex", "flexDirection":"row", "justifyContent":"space-around", "flexWrap":"wrap"}}>
                    {candidates.map((candidate, index)=>{
                        // console.log(candidate)
                        return (
                            <Card key={index} style={{"margin":"1rem"}}>
                                <Image src={`https://${candidate[3]}.ipfs.w3s.link/candidatePicture.png`} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{candidate[0]}</Card.Header>
                                    <Card.Description>
                                        {candidate[1]}
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Icon name='at' />
                                        {candidate[2]}
                                </Card.Content>
                            </Card>
                        )
                    })}
            </div>
        :<Container>No candidate registered yet</Container>
        }
    </>
  )
}
