import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import UserAuth from './components/UserAuth'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '20px'
    },
    header: {
      maxWidth: '1200px',
      margin: '0 auto 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    logo: {
      color: 'white',
      fontSize: '28px',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    },
    nav: {
      display: 'flex',
      gap: '10px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: '5px',
      borderRadius: '30px',
      backdropFilter: 'blur(10px)'
    },
    navButton: {
      padding: '10px 25px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }
  }

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '24px' }}>⏳ Loading...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>🎓 Admission Portal</div>
        <div style={styles.nav}>
          {!isAdmin && (
            <button 
              onClick={() => setIsAdmin(false)}
              style={{
                ...styles.navButton,
                backgroundColor: !isAdmin ? 'white' : 'transparent',
                color: !isAdmin ? '#667eea' : 'white'
              }}
            >
              Student Portal
            </button>
          )}
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            style={{
              ...styles.navButton,
              backgroundColor: isAdmin ? 'white' : 'transparent',
              color: isAdmin ? '#667eea' : 'white'
            }}
          >
            Admin Portal
          </button>
        </div>
      </div>
      {isAdmin ? (
        <AdminDashboard />
      ) : user ? (
        <UserDashboard user={user} onLogout={handleLogout} />
      ) : (
        <UserAuth onAuthSuccess={setUser} />
      )}
    </div>
  )
}

export default App
