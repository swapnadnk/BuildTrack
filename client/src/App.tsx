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
      console.log("Res: ", res.data)
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
          <p>Total Errors: {summary.error_count}</p>

          <h3>🔎 Error Types</h3>
          <ul>
            {Object.entries(summary.error_types).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>

          <h3>📋 Recent Errors</h3>
          <ul>
            {summary.recent_errors.map((line: string, idx: number) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>

          <h3>⏱ Timestamped Errors</h3>
          <ul>
            {summary.timestamped.map((item: any, idx: number) => (
              <li key={idx}>
                [{item.timestamp}] - {item.error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LogUploader
