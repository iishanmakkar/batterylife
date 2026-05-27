'use client';

import type { ReactNode } from 'react';
import React from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('BatteryIQ render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h1 className="font-syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--tx1)' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 20 }}>
              Try refreshing the page. If the issue persists, re-upload your battery report.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--acc)',
                color: '#081017',
                border: 'none',
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
