import React from 'react'
import { Message, Loader, Image, Segment } from 'semantic-ui-react'

export default function Loading(props) {

  const {messageHeader, messageDescription} = props.message;

  return (
    <>
        <Loader className='my-2' active inline='centered' />
        <h2 style={{"textAlign":'center'}}>
            {messageHeader}
        </h2>
        <p style={{"textAlign":'center'}}>
            {messageDescription}
        </p>
    </>
  )
}
