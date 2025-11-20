import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Badge, Alert, Table, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Hars() {
  const [hars, setHars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedHar, setSelectedHar] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const navigate = useNavigate()

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

  const handleView = (har) => {
    setSelectedHar(har)
    setShowViewModal(true)
  }

  const handleDelete = async (harId, harName) => {
    if (!window.confirm(`Are you sure you want to delete "${harName}"?`)) {
      return
    }

    try {
      setError(null)
      await axios.delete(`/api/hars/${harId}`)
      setSuccessMessage(`HAR file "${harName}" deleted successfully`)
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchHars()
    } catch (err) {
      console.error('Error deleting HAR file:', err)
      setError(err.response?.data?.message || 'Failed to delete HAR file')
    }
  }

  const handleGenerateSpec = async (harId) => {
    try {
      setError(null)
      setLoading(true)
      const response = await axios.post(`/api/hars/${harId}/specs`)
      
      // Check if the endpoint is disabled (501 status)
      if (response.status === 501) {
        setError('Swagger generation is temporarily disabled')
        return
      }
      
      setSuccessMessage('Spec generated successfully')
      setTimeout(() => setSuccessMessage(null), 3000)
      // Navigate to specs page or show the generated spec
      navigate('/specs')
    } catch (err) {
      console.error('Error generating spec:', err)
      if (err.response?.status === 501) {
        setError('Swagger generation is temporarily disabled due to dependency issues')
      } else {
        setError(err.response?.data?.message || 'Failed to generate spec')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.har')) {
      setError('Please select a .har file')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Read file as text
      const fileText = await file.text()
      const harData = JSON.parse(fileText)

      // Validate it's a valid HAR file
      if (!harData.log || !harData.log.entries) {
        setError('Invalid HAR file format')
        setLoading(false)
        return
      }

      // Create HAR object with the parsed data
      const harPayload = {
        name: file.name.replace('.har', ''),
        log: harData.log
      }

      // Upload to server
      const response = await axios.post('/api/hars', harPayload)
      
      // Refresh the list
      await fetchHars()
      
      // Reset file input
      event.target.value = ''
      
      console.log('HAR file uploaded successfully:', response.data)
    } catch (err) {
      console.error('Error uploading HAR file:', err)
      setError(err.response?.data?.message || 'Failed to upload HAR file')
    } finally {
      setLoading(false)
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
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
      
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
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleView(har)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleGenerateSpec(har._id)}
                        disabled={loading}
                      >
                        Generate Spec
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(har._id, har.name)}
                      >
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

      {/* View HAR Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedHar?.name || 'HAR File Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHar && (
            <div>
              <h5>HAR Information</h5>
              <Table striped bordered size="sm">
                <tbody>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{selectedHar.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Created:</strong></td>
                    <td>{selectedHar.created ? new Date(selectedHar.created).toLocaleString() : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Requests:</strong></td>
                    <td>{selectedHar.log?.entries?.length || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Has Mermaid Diagram:</strong></td>
                    <td>{selectedHar.mermaid ? 'Yes' : 'No'}</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Request Entries</h5>
              {selectedHar.log?.entries ? (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {selectedHar.log.entries.slice(0, 20).map((entry, index) => (
                    <Card key={index} className="mb-2">
                      <Card.Body>
                        <Badge bg="primary" className="me-2">{entry.request.method}</Badge>
                        <strong>{entry.request.url}</strong>
                        <div className="mt-2">
                          <small className="text-muted">
                            Status: {entry.response.status} {entry.response.statusText}
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  {selectedHar.log.entries.length > 20 && (
                    <p className="text-muted">... and {selectedHar.log.entries.length - 20} more entries</p>
                  )}
                </div>
              ) : (
                <p className="text-muted">No entries found</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Hars
