import React from 'react';
import {
  Box, 
  Text,
  Image
} from '@chakra-ui/react';
import Link from 'next/link'
import Header from '../components/Header';

function home() {
  return (
    <Box h='97.5vh' m='.5rem' border='2px' borderColor='#9B5D73' borderRadius='xl'>
      <Header />
      <Box width='80%' display='flex' justifyContent='space-between' m='3rem auto'> 
        <Text lineHeight='95%' width='60%' fontSize='3xl' fontWeight='bold' align='center'>Brow Care With Vegan Products</Text>
        <Image boxSize={20} src='/static/img/eyebrow.png' />
      </Box>
      <Box w='50%' display='flex' m='8rem auto' textAlign='center' justifyContent='space-around'>
        <Link href='/service-details'>
          <Box w='5rem' p='.25rem' border='2px' borderColor='#9B5D73'>Services</Box>
        </Link>
        <Link href='/bookable-services'>
          <Box w='5rem' p='.25rem' border='2px' borderColor='#9B5D73'>Book</Box>
        </Link>
      </Box>
    </Box>
  )
}

export default home;