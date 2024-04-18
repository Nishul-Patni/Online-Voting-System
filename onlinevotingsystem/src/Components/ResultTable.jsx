import React from 'react'
import { useEffect, useContext, useState } from 'react'
import { Header, Image, Table, Card, Icon } from 'semantic-ui-react'
import ContractContext from './Context/ContractContext/ContractContext'
import Loading from './Loading'

const ResultTable = (props) => {

    let [candidates, setCandidates] = useState([])

    const address = props.address;
    let setShowMessage = props.setShowMessage;
    let setMessageData = props.setMessageData;

    const {getResults} = useContext(ContractContext);

    useEffect(() => {
      fetchData()
    }, [])
    
    const fetchData = async ()=>{
        let response = await getResults(address);
        if(response==false){
            setShowMessage(true);
            setMessageData({positive:false, negative:true, message:"Something went wrong (please see console for more details)"});
        }else{
            setCandidates(response);
        }
    }
  
  return(
    <>
    <hr />
    <Header as='h2' textAlign='center'>Winner 🎊</Header>
    {  
        candidates.length>0?
        <div style={{"display":"flex", "alignItems":"centre", "justifyContent":"center"}}>
        {console.log(candidates[0], "winner")} 
        <Card style={{"margin":"1rem"}}>
            <Image src={`https://${candidates[0][4]}.ipfs.w3s.link/candidatePicture.png`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{candidates[0][0]}</Card.Header>
                <Card.Meta>
                    <span className='date'>Votes {candidates[0][2]}</span>
                </Card.Meta>
                <Card.Description>
                    {candidates[0][1]}
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name='at' />
                    {candidates[0][3]}
            </Card.Content>
        </Card> 
        </div>:''
    }
    <Header as='h2'>Results</Header>
    {candidates.length===0?<Loading message={{messageHeader:'Loading...', messageDescription:'Fetching election results'}}/>:
        <Table size="large" style={{"width":"100%"}} celled collapsing>
            <Table.Header fullWidth>
                <Table.Row>
                    <Table.HeaderCell>Candidate</Table.HeaderCell>
                    <Table.HeaderCell>Total Votes</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {candidates.map((candidate)=>{
                    return (
                        <Table.Row>
                            <Table.Cell>
                            <Header as='h4' image>
                                <Image src={`https://${candidate[4]}.ipfs.w3s.link/candidatePicture.png`} rounded size='massive' />
                                <Header.Content>
                                {candidate[0]}
                                <Header.Subheader>{candidate[3]}</Header.Subheader>
                                </Header.Content>
                            </Header>
                            </Table.Cell>
                            <Table.Cell>{candidate[2]}</Table.Cell>
                        </Table.Row>
                    )
                })}

            </Table.Body>
    </Table>
    }
    </>
    )
}

export default ResultTable;