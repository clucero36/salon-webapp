import React from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';

// pre rendering method makes a request to express server.
// passes staff data retrieved in response to StaffSelect as props.
export async function getServerSideProps(context) {
  const serviceID = context.query.serviceId;
  const serviceVersion = context.query.serviceVersion;

  const res = await fetch(`http://localhost:3030/staff/${serviceID}/${serviceVersion}`);
  
  const data = await res.text();

  if (!data) {
    return {
      notFound: true,
    }
  }

  return { 
    props: {
      data: data
    }
  }
};

// displays service selected, a description of the service, & a list of team members.
// Next.js Link component transitions user to /availabilities. Query params provided.
export default function staffSelect({ data }) {
  let staffData = JSON.parse(data);
  const team = staffData.team;
  const service = staffData.service.object.itemData.name;
  const serviceDesc = staffData.service.object.itemData.description;

  let renderedTeam = team.map((teamMember) => {
    return (
      <Link key={teamMember.id} as='/availabilites' href={{
        pathname: '/availabilities',
        query: {
          serviceId: `${staffData.service.object.id}`,
          serviceVersion: `${staffData.service.object.version}`,
          teamMemberId: `${teamMember.id}`,
          serviceVariationId: `${staffData.service.object.itemData.variations[0].id}`,
          locationId: `${staffData.service.object.presentAtLocationIds[0]}`,
        }
      }}>
        <Box border='1px'>
          <Text>{teamMember.givenName}</Text>
          <Text>{teamMember.familyName}</Text>
          <Text>{teamMember.emailAddress}</Text>
          <Text>{teamMember.phoneNumber}</Text>
        </Box>
      </Link>
    )
  })

  return (
    <Box p='5rem' align='center'>
      <Text>StaffSelect Page</Text>
      <Text>You Have Selected the {service} Service</Text>
      <Text>{serviceDesc}</Text>
      <Box align='left'>
        <Text>Select a Team Member:</Text>
        {renderedTeam}
      </Box>
    </Box>
  )
}

