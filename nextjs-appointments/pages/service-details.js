import React from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import serviceData from '../data/service-data';

function serviceDetails() {

  let renderedServiceCards = serviceData.map((service, index) => {
    return (
      <ServiceCard key={index} props={service} />
    )
  })


  return (
    <Box m='.5rem' border='2px' borderColor='#9B5D73' borderRadius='xl'>
      <Header />
      <Text align='center' fontSize='2xl' fontWeight='bold' color='#9B5D73'>Lets Build Your Brows</Text>
      <Box p='2rem 0' gap={5} display='flex' flexDir='column'>
        {renderedServiceCards}
      </Box>
    </Box>
  )
}

export default serviceDetails;