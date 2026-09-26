import React, { Component, type ReactNode } from 'react';

/**
 * Localized Error Boundary for Home page sections.
 * Prevents a single component crash from triggering the router's
 * global 404 (NotFound) page.
 */
export class SectionBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error(`[SectionBoundary] Crash detected:`, error, errorInfo);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
