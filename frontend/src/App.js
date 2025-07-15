import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://cxh4zjs1lg.execute-api.us-east-1.amazonaws.com/dev/users'

function App() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    axios.get(API).then((res) => setUsers(res.data.users || []))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(API, form)
    setUsers([...users, res.data.user])
    setForm({ name: '', email: '' })
  }

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API}/${userId}`)
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  return (
    <div>
      <h1>User Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button>Add User</button>
      </form>
      <ul>
        { users.length > 0 ? users.map((u) => (
          <li key={u.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{u.name} - {u.email}</span>
            <button 
              onClick={() => deleteUser(u.id)}
              style={{ 
                background: '#ff4444', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Delete
            </button>
          </li>
        )) : <li>No users found</li>}
      </ul>
    </div>
  )
}

export default App
