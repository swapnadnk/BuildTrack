import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    axios.get('/api/health')
      .then((res) => setStatus(res.data.status))
      .catch((err) => setStatus('error'))
  }, [])

  return <h1>Flask Backend Status: {status}</h1>
}

export default App
