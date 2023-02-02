import React, { useState } from "react";
//import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import Header from "../components/Header";

import JSZip from "jszip";
import Promise from "bluebird";
import FileSaver from "file-saver";

const ZipPage = () => {
  const [showNotice, setShowNotice] = useState(false);

  /**
   * Checks if url is valid and contains all required parts.
   * 
   * @param string urlString 
   * @returns bool
   */
  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  /**
   * Validates if url is valid github url.
   * 
   * @param string input 
   * @returns bool
   */
  const validateInputUrl = (input) => {
    return (
      isValidUrl(input) &&
      (input.startsWith( 'https://raw.githubusercontent.com/' ) ||
        input.includes("github.com"))
    );
  };
  
  /**
   * Handles button click
   * 
   * @returns void
   */
  const handleClick = () => {
    const inputElement = document.getElementById("inputURL"),
      inputURL = inputElement.value;
    let url ='';

    setShowNotice(false);

    if (!validateInputUrl(inputURL)) {
      setShowNotice(true);
      return;
    }

    url = adjustGithubURL( inputURL );

    downloadAndZip([url]);
  };

  /**
   * Adjusts the url to match the file's raw url.
   * 
   * @param string inputURL 
   * @returns string|bool
   */
  const adjustGithubURL = ( inputURL ) => {
    if ( inputURL.startsWith( 'https://raw.githubusercontent.com/' ) ) {
      return inputURL;
    }

    const urlStruct = new URL( inputURL );

    if ( 0 >= urlStruct.pathname.length ) {
      return false;
    }

    const urlParts = urlStruct.pathname.split( '/' ),
      username = urlParts[1],
      repo = urlParts[2],
      branch = urlParts[4],
      file = urlStruct.pathname.split( `${repo}/blob/${branch}/` )[1];
    
    return `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${file}`;
  }

  /**
   * Fetches the blob from url.
   * 
   * @param string url 
   * @returns string
   */
  const download = (url) => {
    return fetch(url).then((resp) => resp.blob());
  };

  const downloadByGroup = (urls, files_per_group = 5) => {
    return Promise.map(
      urls,
      async (url) => {
        return await download(url);
      },
      { concurrency: files_per_group }
    );
  };

  const exportZip = (blobs, urls) => {
    console.log( 'urls: ', urls );
    const zip = new JSZip();
    let filename, extension, zipFilename;

    blobs.forEach((blob, i) => {
      filename = getFilenameFromURL( urls[i] );
      extension = getExtensionFromFile( filename );
      zipFilename = filename.replace( extension, 'zip' )

      zip.file(filename, blob);
    });

    zip.generateAsync({ type: "blob" }).then((zipFile) => {
      const currentDate = new Date().getTime();
      //const fileName = `combined-${currentDate}.zip`;
      return FileSaver.saveAs(zipFile, zipFilename);
    });
  };

  /**
   * Called from button handler.
   * 
   * @param Array urls The list of urls
   * @returns 
   */
  const downloadAndZip = (urls) => {
    return downloadByGroup(urls, 5).then(
      (blobs) => {
        exportZip( blobs, urls );
      }
    );

  };

  /**
   * Helper. Gets the last part, filename, from github url.
   * 
   * @param string url 
   * @returns string
   */
  const getFilenameFromURL = (url) => {
    return url.substring( url.lastIndexOf( '/' ) + 1 )
  }

  /**
   * Helper. Gets the file extension from file.
   * 
   * @param string url 
   * @returns string
   */
  const getExtensionFromFile = ( file ) => {
    return file.split( '.' )[1];
  }

  /**
   * The component.
   * 
   * @returns 
   */
  const UrlInput = () => {
    return (
      <InputGroup size="lg">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Enter github file url"
          id="inputURL"
        />

        <InputRightElement width="7.5rem">
          <Button size="md" onClick={handleClick}>
            Download
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  };

  return (
    <ChakraProvider>
      <Header />
      {showNotice && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Invalid URL</AlertTitle>
          <AlertDescription>Please type a valid url.</AlertDescription>
        </Alert>
      )}

      <Box p={8}>
        <Text fontSize="xl">Zip a Github File</Text>
        <UrlInput />
      </Box>
    </ChakraProvider>
  );
};

export default ZipPage;

export const Head = () => <title>Zip Github File</title>;
