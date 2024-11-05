'use client'

import React, { ReactNode } from 'react'
import { Alert } from '@mui/material'

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <Alert severity="error">Something went wrong. Please try again later.</Alert>
    }

    return this.props.children
  }
}

export default ErrorBoundary