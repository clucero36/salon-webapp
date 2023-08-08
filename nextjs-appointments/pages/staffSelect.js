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

  const res = await fetch(`http://localhost:3030/staff/${serviceID}`);
  
  const data = await res.json();
  console.log(data);
  if (!data) {
    return {
      notFound: true,
    }
  }

  return { 
    props: {
      staffData: data
    }
  }
};

// displays service selected, a description of the service, & a list of team members.
// Next.js Link component transitions user to /availabilities. Query params provided.
export default function staffSelect({ staffData }) {
  const reviver = (key, value) => key === 'version' || key === 'serviceDuration' || key === 'amount' ? BigInt(value) : value;
  const team = JSON.parse(staffData.team, reviver);
  const service = JSON.parse(staffData.service, reviver);

  let renderedTeam = team.map((teamMember) => {
    return (
      <Link key={teamMember.id} href={{
        pathname: '/availabilities',
        query: {
          serviceId: `${service.object.id}`,
          serviceVersion: `${service.object.version}`,
          teamMemberId: `${teamMember.id}`,
          serviceVariationId: `${service.object.itemData.variations[0].id}`,
          locationId: team[0].assignedLocations.locationIds[0],
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
      <Text>You Have Selected the {service.object.itemData.name} Service</Text>
      <Text>{service.object.itemData.description}</Text>
      <Box align='left'>
        <Text>Select a Team Member:</Text>
        {renderedTeam}
      </Box>
    </Box>
  )
}

