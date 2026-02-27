import { useState } from 'react'
import { supabase } from '../lib/supabase'

function UserAuth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      setLoading(false)
      return
    }

    if (!isLogin && password.length < 6) {
      setMessage('Password must be at least 6 characters')
      setMessageType('error')
      setLoading(false)
      return
    }

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setMessage('Login failed: ' + error.message)
        setMessageType('error')
      } else {
        setMessage('Login successful!')
        setMessageType('success')
        onAuthSuccess(data.user)
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        setMessage('Registration failed: ' + error.message)
        setMessageType('error')
      } else {
        setMessage('Registration successful! You can now login.')
        setMessageType('success')
        setIsLogin(true)
        setPassword('')
        setConfirmPassword('')
      }
    }

    setLoading(false)
  }

  const styles = {
    container: {
      maxWidth: '450px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '10px',
      fontWeight: '700'
    },
    subtitle: {
      fontSize: '14px',
      color: '#666'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    input: {
      padding: '12px 16px',
      fontSize: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },
    button: {
      padding: '15px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    toggleText: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '14px',
      color: '#666'
    },
    toggleLink: {
      color: '#667eea',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'none'
    },
    message: {
      padding: '12px',
      borderRadius: '10px',
      fontSize: '14px',
      marginTop: '15px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{isLogin ? '👋 Welcome Back' : '🎓 Create Account'}</h2>
        <p style={styles.subtitle}>
          {isLogin ? 'Login to track your scholarship application' : 'Register to apply for scholarship'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address *</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password *</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
        </div>

        {!isLogin && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#ccc' : '#667eea',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#5568d3')}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
        >
          {loading ? '⏳ Please wait...' : isLogin ? '🔐 Login' : '📝 Register'}
        </button>
      </form>

      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <div style={styles.toggleText}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={styles.toggleLink}
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage('')
            setPassword('')
            setConfirmPassword('')
          }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </div>
    </div>
  )
}

export default UserAuth
