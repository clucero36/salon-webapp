import React from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';

// pre rendering method used to call the server
// passes services provided as props to services
// export async function getServerSideProps() {

//   const res = await fetch('http://localhost:3030');
  
//   const data = await res.text();

//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }

//   return { 
//     props: {
//       serviceData: data
//     }
//   }
// }


export default function BookableServices({ serviceData }) {
  // console.log(JSON.parse(serviceData))
  // let services = JSON.parse(serviceData);
  // let renderedServices = services.items.map((service) => {
  //   return (
  //     <Box key={service.id}>
  //       <Link href={{
  //         pathname: '/staffSelect',
  //         query: {
  //           serviceId: `${service.id}`,
  //           serviceVersion: `${service.version}`
  //         }
  //       }}>
  //         {service.itemData.name}
  //       </Link>
  //     </Box>
  //   )
  // })
  return (   
    <Box p='4rem' align='center' h='97.5vh' m='.5rem' border='2px' borderColor='#988686' borderRadius='xl'>
      <Text>Book An Appointment With Me! Coming Soon!</Text>
      {/* {renderedServices} */}
    </Box>
  )
}