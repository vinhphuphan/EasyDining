'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can log the error to an error reporting service here
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="max-w-md w-full px-4 py-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Something went wrong
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <Button
                            onClick={() => {
                                this.setState({ hasError: false, error: null })
                                window.location.reload()
                            }}
                        >
                            Try again
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}