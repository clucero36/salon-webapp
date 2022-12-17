import React from 'react';
import {
  Box, 
  Icon,
} from '@chakra-ui/react';
import { IoLogoTableau } from "react-icons/io5";

const Header = () => {

  return (
    <Box display='flex' justifyContent='space-between' m='2rem auto' p='0 .5rem' gap={2} >
      <Icon boxSize='25' as={IoLogoTableau} mt='1px'/>
    </Box>
  )
}

export default Header;