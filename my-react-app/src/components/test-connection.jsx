import { useState, useEffect } from "react"
import api from "../api/axios.js"

const TestConnection = () => {
  const [testResult, setTestResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testBackendConnection = async () => {
    setLoading(true)
    try {
      const response = await api.get('/test')
      setTestResult(`✅ Backend connection successful: ${response.data.message}`)
    } catch (error) {
      setTestResult(`❌ Backend connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testBackendConnection()
  }, [])

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Backend Connection Test</h3>
      <button onClick={testBackendConnection} disabled={loading}>
        {loading ? "Testing..." : "Test Connection"}
      </button>
      <p>{testResult}</p>
    </div>
  )
}

export default TestConnection 