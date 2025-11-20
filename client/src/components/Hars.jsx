import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Badge, Alert, Table } from 'react-bootstrap'
import axios from 'axios'

function Hars() {
  const [hars, setHars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHars()
  }, [])

  const fetchHars = async () => {
    try {
      const response = await axios.get('/api/hars')
      setHars(response.data)
    } catch (err) {
      setError('Failed to load HAR files')
      console.error('Error fetching HAR files:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // TODO: Implement file upload
      console.log('File selected:', file.name)
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>HAR Files</h2>
        <div>
          <input
            type="file"
            accept=".har"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <Button variant="primary" as="label" htmlFor="file-upload">
            <i className="bi bi-upload"></i> Upload HAR File
          </Button>
        </div>
      </div>

      {hars.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No HAR files found</h5>
            <p className="text-muted">Upload your first HAR file to get started</p>
            <Button variant="primary" as="label" htmlFor="file-upload">
              Upload HAR File
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Project</th>
                  <th>Size</th>
                  <th>Requests</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hars.map((har) => (
                  <tr key={har._id}>
                    <td>{har.name}</td>
                    <td>
                      <Badge bg="secondary">
                        {har.project?.name || 'No Project'}
                      </Badge>
                    </td>
                    <td>{har.size ? `${(har.size / 1024).toFixed(1)} KB` : 'N/A'}</td>
                    <td>
                      <Badge bg="info">
                        {har.log?.entries?.length || 0}
                      </Badge>
                    </td>
                    <td>
                      {har.created ? new Date(har.created).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2">
                        View
                      </Button>
                      <Button variant="outline-success" size="sm" className="me-2">
                        Generate Spec
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default Hars
