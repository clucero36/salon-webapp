import React from 'react';
import {
  Box, 
  Text
} from '@chakra-ui/react';


export async function getServerSideProps(context) {

  const serviceId = context.query.serviceId;
  const serviceVersion = context.query.serviceVersion;
  const teamMemberId = context.query.teamMemberId;
  const startAt = context.query.startAt;

  const res = await fetch(`http://localhost:3030/contact/${serviceId}/${serviceVersion}/${teamMemberId}/${startAt}`)
  const data = await res.text();


  return {
    props: {
      data: { data }
    }
  }
}

export default function contact({ data }) {

  let parsedData = JSON.parse(data.data);
  console.log(parsedData);

  return (
    <Box>
      Contact Page
    </Box>
  )
}