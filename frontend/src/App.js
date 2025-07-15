import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://6zwq0lsag4.execute-api.us-east-1.amazonaws.com/dev/users'

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
          <li key={u.id}>{u.name} - {u.email}</li>
        )) : <li>No users found</li>}
      </ul>
    </div>
  )
}

export default App
