import { ChakraProvider } from '@chakra-ui/react';
import { overrides  } from '../themes/themeIndex';
import "@fontsource/actor"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={overrides}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
