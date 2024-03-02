import { Stack } from '@chakra-ui/layout'
import { Skeleton } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
  
 <Stack>
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
</Stack>
  
  )
}

export default ChatLoading
// what is skeleton in react?
// When data is not yet loaded, a Skeleton Component serves as a placeholder preview for the user. Material UI for React provides an easily integratable version of this component, and in React JS, the following approach can be employed to utilize the Skeleton Component..Here we have used  chakra -UI for importing and using