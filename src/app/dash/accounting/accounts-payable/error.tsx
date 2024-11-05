'use client'

import { Container, Typography, Button } from '@mui/material'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Something went wrong!
      </Typography>
      <Typography variant="body1" paragraph>
        {error.message}
      </Typography>
      <Button variant="contained" onClick={() => reset()}>
        Try again
      </Button>
    </Container>
  )
}