import React from 'react'

export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const sizeMap = {
    sm: '20px',
    md: '40px',
    lg: '60px'
  }

  const spinnerStyle = {
    width: sizeMap[size],
    height: sizeMap[size],
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }

  const containerStyle = fullPage ? {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh'
  } : {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem'
  }

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
