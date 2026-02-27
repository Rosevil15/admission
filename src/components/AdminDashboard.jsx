import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [applications, setApplications] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user, filter])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check if user is admin
    if (user) {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'
      if (user.email !== adminEmail) {
        setMessage('Access denied. Admin privileges required.')
        setMessageType('error')
        await supabase.auth.signOut()
        setUser(null)
        return
      }
    }
    
    setUser(user)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Check if email is admin email
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'
    if (email !== adminEmail) {
      setMessage('Access denied. Only admin can login here.')
      setMessageType('error')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)
    if (error) {
      setMessage('Login failed: ' + error.message)
      setMessageType('error')
    } else {
      setUser(data.user)
      setMessage('Login successful!')
      setMessageType('success')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setApplications([])
  }

  const fetchApplications = async () => {
    setLoading(true)
    let query = supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query

    if (!error) setApplications(data)
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setMessage(`✅ Application ${status} successfully`)
      setMessageType('success')
      fetchApplications()
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('❌ Failed to update status')
      setMessageType('error')
    }
  }

  const getStats = () => {
    const total = applications.length
    const pending = applications.filter(app => app.status === 'pending').length
    const approved = applications.filter(app => app.status === 'approved').length
    const rejected = applications.filter(app => app.status === 'rejected').length
    return { total, pending, approved, rejected }
  }

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm)
  )

  const styles = {
    loginContainer: {
      maxWidth: '450px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    loginHeader: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    loginTitle: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '10px',
      fontWeight: '700'
    },
    loginSubtitle: {
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
    container: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    adminIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#667eea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    headerInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333'
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#666'
    },
    logoutBtn: {
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: '10px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#333'
    },
    controls: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchInput: {
      flex: '1',
      minWidth: '250px',
      padding: '12px 16px',
      fontSize: '14px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    select: {
      padding: '12px 16px',
      fontSize: '14px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontWeight: '600'
    },
    content: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    applicationCard: {
      border: '2px solid #e0e0e0',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '15px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333'
    },
    statusBadge: {
      padding: '6px 15px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600'
    },
    cardDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '15px'
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    detailLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: '600'
    },
    detailValue: {
      fontSize: '14px',
      color: '#333'
    },
    actions: {
      display: 'flex',
      gap: '10px',
      paddingTop: '15px',
      borderTop: '1px solid #e0e0e0'
    },
    actionBtn: {
      padding: '8px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    message: {
      padding: '15px',
      borderRadius: '10px',
      fontSize: '14px',
      marginBottom: '20px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#666'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { bg: '#d4edda', color: '#155724' }
      case 'rejected':
        return { bg: '#f8d7da', color: '#721c24' }
      default:
        return { bg: '#fff3cd', color: '#856404' }
    }
  }

  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginHeader}>
          <h2 style={styles.loginTitle}>🔐 Admin Login</h2>
          <p style={styles.loginSubtitle}>Access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
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
            {loading ? '⏳ Logging in...' : '🔓 Login'}
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            marginTop: '20px'
          }}>
            {message}
          </div>
        )}
      </div>
    )
  }

  const stats = getStats()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.adminIcon}>👨‍💼</div>
          <div style={styles.headerInfo}>
            <div style={styles.headerTitle}>Admin Dashboard</div>
            <div style={styles.headerSubtitle}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          🚪 Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statLabel}>Total Applications</div>
          <div style={styles.statValue}>{stats.total}</div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.statIcon}>⏳</div>
          <div style={styles.statLabel}>Pending Review</div>
          <div style={styles.statValue}>{stats.pending}</div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statLabel}>Approved</div>
          <div style={styles.statValue}>{stats.approved}</div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.statIcon}>❌</div>
          <div style={styles.statLabel}>Rejected</div>
          <div style={styles.statValue}>{stats.rejected}</div>
        </div>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="🔍 Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

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

      <div style={styles.content}>
        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⏳</div>
            <div>Loading applications...</div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <div>No applications found</div>
          </div>
        ) : (
          filteredApplications.map((app) => {
            const statusColors = getStatusColor(app.status)
            return (
              <div 
                key={app.id} 
                style={styles.applicationCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>👤 {app.name}</div>
                  <div style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColors.bg,
                    color: statusColors.color
                  }}>
                    {app.status.toUpperCase()}
                  </div>
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>📧 Email</div>
                    <div style={styles.detailValue}>{app.email}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>📱 Phone</div>
                    <div style={styles.detailValue}>{app.phone}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>🎓 Program</div>
                    <div style={styles.detailValue}>{app.program || 'N/A'}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>📚 Education</div>
                    <div style={styles.detailValue}>{app.education || 'N/A'}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>🎂 Date of Birth</div>
                    <div style={styles.detailValue}>{app.date_of_birth || 'N/A'}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>⚧ Gender</div>
                    <div style={styles.detailValue}>{app.gender || 'N/A'}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>📍 Address</div>
                    <div style={styles.detailValue}>{app.address}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>📅 Submitted</div>
                    <div style={styles.detailValue}>
                      {new Date(app.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div style={styles.actions}>
                    <button 
                      onClick={() => updateStatus(app.id, 'approved')}
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: '#28a745',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      onClick={() => updateStatus(app.id, 'rejected')}
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: '#dc3545',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
