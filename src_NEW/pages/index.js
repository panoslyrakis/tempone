import * as React from "react"
import { ChakraProvider, Box, Text } from "@chakra-ui/react";
import Header from "../components/Header";


const IndexPage = () => {
  return (
    <ChakraProvider>
      <Header />
      
      <Box p={8}>
        <Text fontSize="xl">Welcome to WPMUDEV Second Level Support</Text>
      </Box>
    </ChakraProvider>
  );
}

export default IndexPage

export const Head = () => <title>Home Page</title>
