import React from "react";
import { Segment, Item } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';

const ElectionCard = (props) => {

  const navigate = useNavigate();

  const address = props.address;

  let {electionName,
    authorityEmail,
    description,
    candidatesCount,
    totalVoters,
    statusDescription
  } = props.election;
  

  return (
    <Segment onClick={()=>{navigate(`/Election/${address}`)}} style={{"cursor":"pointer"}}>
      <Item.Group>
        <Item>
          <Item.Content>
            <Item.Header as="a">{electionName}</Item.Header>
            <Item.Meta>Status : {statusDescription}</Item.Meta>
            <Item.Description>
              {description}
            </Item.Description>
            <Item.Extra>Candidates Count: {candidatesCount}, Voters Count : {totalVoters}, Authority Email : {authorityEmail}</Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>
  );
};

export default ElectionCard;
