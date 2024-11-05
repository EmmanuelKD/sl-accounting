'use client'

import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'

const rotate = `
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const bounce = `
  @keyframes bounce {
    0%, 100% {
      transform: scale(0.9);
      background-color: #4285f4;
    }
    50% {
      transform: scale(1.1);
      background-color: #ea4335;
    }
  }
`

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: theme?.palette?.background?.default || '#ffffff',
}))

const LoaderContainer = styled(Box)({
  position: 'relative',
  width: 60,
  height: 60,
})

const Spinner = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: '3px solid transparent',
  borderTopColor: '#4285f4',
  borderRadius: '50%',
  animation: 'rotate 1s linear infinite',
  [`${rotate}`]: '',
})

const Dot = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 12,
  height: 12,
  marginTop: -6,
  marginLeft: -6,
  borderRadius: '50%',
  backgroundColor: '#4285f4',
  animation: 'bounce 1.2s ease-in-out infinite',
  [`${bounce}`]: '',
})

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme?.spacing?.(2) || '16px',
  color: theme?.palette?.text?.secondary || '#666666',
  fontWeight: 500,
}))

export default function LoadingPage() {
  const [loadingText, setLoadingText] = useState('Loading')

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText === 'Loading...') return 'Loading'
        return prevText + '.'
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <StyledBox>
      <LoaderContainer>
        <Spinner />
        <Dot />
      </LoaderContainer>
      <LoadingText variant="h6">
        {loadingText}
      </LoadingText>
    </StyledBox>
  )
}