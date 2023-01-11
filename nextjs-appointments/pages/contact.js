import React from 'react';
import {
  Box, 
  Text,
  FormControl,
  FormLabel ,
  Input,
  Button
} from '@chakra-ui/react';
import axios from 'axios';

export async function getServerSideProps(context) {
  const serviceId = context.query.serviceId;
  const serviceVersion = context.query.serviceVersion;
  const teamMemberId = context.query.teamMemberId;
  const startAt = context.query.startAt;

  const res = await fetch(`http://localhost:3030/contact/${serviceId}/${serviceVersion}/${teamMemberId}/${startAt}`)
  let data = await res.json();

  return {
    props: {
      serviceDetails: data
    }
  }
}

export default function contact({ serviceDetails }) {
  const reviver = (key, value) => key === 'version' || key === 'serviceDuration' || key === 'amount' || key === 'serviceVariationVersion' ? BigInt(value) : value;
  const replacer = (key, value) => key === 'version' || key === 'serviceDuration' || key === 'amount' || key === 'serviceVariationVersion' ? value.toString() : value;

  let serviceData = JSON.parse(serviceDetails, reviver);
  const handleSubmit = (event) => {
    event.preventDefault();
    let userData = {
      firstName: event.target.first.value,
      lastName: event.target.last.value,
      email: event.target.email.value,
      note: event.target.note.value,
    }

    axios.post('http://localhost:3030/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({userData, serviceData}, replacer),
    })
  }

  return (
    <Box w='95%' m='2rem auto'>
      <Text textAlign='center'>Fill Out Your Contact Information To Complete The Booking</Text>
      <form onSubmit={handleSubmit}>
        <FormControl mt='2rem' p='10px' border='1px' borderRadius='md' borderColor='#9B5D73'>
          <FormLabel m='0'>FirstName:</FormLabel >
          <Input variant='flushed' focusBorderColor='#9B5D73' mb='1rem' size='sm' placeholder='First Name' type='text' name='first'/>
          <FormLabel m='0'>LastName:</FormLabel >
          <Input variant='flushed' focusBorderColor='#9B5D73' mb='1rem' size='sm' placeholder='Last Name' type='text' name='last'/>
          <FormLabel m='0'>Email:</FormLabel >
          <Input variant='flushed' focusBorderColor='#9B5D73' mb='1rem' size='sm' placeholder='Email' type='text' name='email'/>
          <FormLabel m='0'>Note:</FormLabel >
          <Input variant='flushed' focusBorderColor='#9B5D73' mb='1rem' size='sm' placeholder='Customer Note' type='text' name='note'/>
          <Button type='submit'>Submit</Button>
        </FormControl>
      </form>
    </Box>
  )
}