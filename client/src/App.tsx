import { useState } from 'react'
import axios from 'axios'

function LogUploader() {
  const [summary, setSummary] = useState<any>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('/api/upload-log', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSummary(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Upload Log File</h2>
      <input type="file" accept=".log,.txt" onChange={handleUpload} />
      {summary && (
        <div>
          <p>File: {summary.filename}</p>
          <p>Errors Found: {summary.error_count}</p>
          <ul>
            {summary.errors.map((line: string, idx: number) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LogUploader
