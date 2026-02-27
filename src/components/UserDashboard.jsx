import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdmissionForm from './AdmissionForm'

function UserDashboard({ user, onLogout }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchUserApplications()
  }, [])

  const fetchUserApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })

    if (!error) setApplications(data)
    setLoading(false)
  }

  const handleApplicationSubmit = () => {
    setShowForm(false)
    fetchUserApplications()
  }

  const styles = {
    container: {
      maxWidth: '1000px',
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
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    avatar: {
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
    userDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    userName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333'
    },
    userEmail: {
      fontSize: '14px',
      color: '#666'
    },
    actions: {
      display: 'flex',
      gap: '10px'
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    content: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
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
    },
    emptyText: {
      fontSize: '18px',
      marginBottom: '10px'
    },
    emptySubtext: {
      fontSize: '14px',
      color: '#999',
      marginBottom: '30px'
    },
    applicationCard: {
      border: '2px solid #e0e0e0',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '15px',
      transition: 'all 0.3s ease'
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
      gap: '15px'
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

  if (showForm) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{user.email[0].toUpperCase()}</div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>New Application</div>
              <div style={styles.userEmail}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            style={{
              ...styles.button,
              backgroundColor: '#6c757d',
              color: 'white'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
        <AdmissionForm userEmail={user.email} onSuccess={handleApplicationSubmit} />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user.email[0].toUpperCase()}</div>
          <div style={styles.userDetails}>
            <div style={styles.userName}>My Dashboard</div>
            <div style={styles.userEmail}>{user.email}</div>
          </div>
        </div>
        <div style={styles.actions}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              ...styles.button,
              backgroundColor: '#667eea',
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
          >
            + New Application
          </button>
          <button
            onClick={onLogout}
            style={{
              ...styles.button,
              backgroundColor: '#dc3545',
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>My Scholarship Applications</h2>

        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⏳</div>
            <div style={styles.emptyText}>Loading your applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <div style={styles.emptyText}>No applications yet</div>
            <div style={styles.emptySubtext}>Start your journey by submitting your scholarship application</div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                ...styles.button,
                backgroundColor: '#667eea',
                color: 'white'
              }}
            >
              Submit Application
            </button>
          </div>
        ) : (
          applications.map((app) => {
            const statusColors = getStatusColor(app.status)
            return (
              <div 
                key={app.id} 
                style={styles.applicationCard}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>{app.program || 'Application'}</div>
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
                    <div style={styles.detailLabel}>Full Name</div>
                    <div style={styles.detailValue}>{app.name}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Email</div>
                    <div style={styles.detailValue}>{app.email}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Phone</div>
                    <div style={styles.detailValue}>{app.phone}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Submitted On</div>
                    <div style={styles.detailValue}>
                      {new Date(app.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default UserDashboard
