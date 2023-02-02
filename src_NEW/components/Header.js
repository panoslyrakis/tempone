import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
//import { Link } from "gatsby"
import { Link } from '@chakra-ui/react'

// Colors:
//https://chakra-ui.com/docs/styled-system/theme

const Header = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="#1f1b50"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="md" letterSpacing={"tighter"}>
          WPMUDEV <br /><small>SLS Code Snippets</small>
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
        <Link href="/">Home</Link>
        <Link href="/ZipGithubFile">Zip Github File</Link>

      </Stack>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Button
          variant="outline"
          _hover={{ bg: "green.400", borderColor: "green.900" }}
        >
          Get support
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;