import { useState } from 'react'
import { supabase } from '../lib/supabase'

function AdmissionForm({ userEmail, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: userEmail || '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    education: '',
    program: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('applications')
      .insert([{ ...formData, user_email: userEmail, status: 'pending' }])

    setLoading(false)
    if (error) {
      setMessage('Error: ' + error.message)
      setMessageType('error')
    } else {
      setMessage('🎉 Application submitted successfully! We will review your application and get back to you soon.')
      setMessageType('success')
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000)
      } else {
        setFormData({ 
          name: '', 
          email: userEmail || '', 
          phone: '', 
          address: '',
          date_of_birth: '',
          gender: '',
          education: '',
          program: ''
        })
      }
    }
  }

  const styles = {
    container: {
      maxWidth: '800px',
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
      fontSize: '32px',
      color: '#333',
      marginBottom: '10px',
      fontWeight: '700'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      lineHeight: '1.6'
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
      color: '#333',
      marginBottom: '5px'
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
    textarea: {
      padding: '12px 16px',
      fontSize: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      minHeight: '100px',
      resize: 'vertical'
    },
    select: {
      padding: '12px 16px',
      fontSize: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
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
    message: {
      padding: '15px',
      borderRadius: '10px',
      fontSize: '14px',
      lineHeight: '1.6',
      marginTop: '20px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Application Form</h2>
        <p style={styles.subtitle}>
          Fill out the form below to apply for admission. All fields are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name *</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address *</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                ...styles.input,
                backgroundColor: userEmail ? '#f5f5f5' : 'white',
                cursor: userEmail ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => !userEmail && (e.target.style.borderColor = '#667eea')}
              onBlur={(e) => !userEmail && (e.target.style.borderColor = '#e0e0e0')}
              disabled={!!userEmail}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Birth *</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              style={styles.select}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Address *</label>
          <textarea
            placeholder="Enter your complete address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={styles.textarea}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Highest Education *</label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              style={styles.select}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            >
              <option value="">Select education level</option>
              <option value="high-school">High School</option>
              <option value="associate">Associate Degree</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="doctorate">Doctorate</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Program of Interest *</label>
            <select
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              style={styles.select}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            >
              <option value="">Select program</option>
              <option value="computer-science">Computer Science</option>
              <option value="business">Business Administration</option>
              <option value="engineering">Engineering</option>
              <option value="medicine">Medicine</option>
              <option value="arts">Arts & Humanities</option>
              <option value="science">Natural Sciences</option>
            </select>
          </div>
        </div>

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
          {loading ? '⏳ Submitting...' : '📝 Submit Application'}
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
    </div>
  )
}

export default AdmissionForm
