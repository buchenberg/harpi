import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Badge, Alert, Table, Modal } from 'react-bootstrap'
import axios from 'axios'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

function Specs() {
  const [specs, setSpecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSpec, setSelectedSpec] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchSpecs()
  }, [])

  const fetchSpecs = async () => {
    try {
      const response = await axios.get('/api/specs')
      setSpecs(response.data)
    } catch (err) {
      setError('Failed to load specifications')
      console.error('Error fetching specs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewSpec = async (specId) => {
    try {
      const response = await axios.get(`/api/specs/${specId}/swagger`)
      setSelectedSpec({
        id: specId,
        swagger: response.data
      })
      setShowViewModal(true)
    } catch (err) {
      console.error('Error fetching spec:', err)
      setError('Failed to load specification')
    }
  }

  const handleExportSpec = async (specId) => {
    try {
      const response = await axios.get(`/api/specs/${specId}/swagger`)
      const swaggerJson = JSON.stringify(response.data, null, 2)
      const blob = new Blob([swaggerJson], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Get the spec title for the filename
      const spec = specs.find(s => s._id === specId)
      const filename = spec?.title ? `${spec.title}.json` : `spec-${specId}.json`
      a.download = filename
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error exporting spec:', err)
      setError('Failed to export specification')
    }
  }

  const handleDeleteSpec = async (specId) => {
    if (!window.confirm('Are you sure you want to delete this specification?')) {
      return
    }

    try {
      await axios.delete(`/api/specs/${specId}`)
      // Refresh the list
      fetchSpecs()
    } catch (err) {
      console.error('Error deleting spec:', err)
      setError('Failed to delete specification')
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
        <h2>API Specifications</h2>
        <Button variant="primary" disabled>
          <i className="bi bi-plus"></i> New Specification
        </Button>
      </div>

      {specs.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No specifications found</h5>
            <p className="text-muted">
              Generate specifications from your HAR files to get started
            </p>
            <Button variant="primary" disabled>
              Generate Specification
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Version</th>
                  <th>Endpoints</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec._id}>
                    <td>{spec.title}</td>
                    <td>
                      <Badge bg="primary">
                        {spec.swagger?.swagger ? 'Swagger' : 'OpenAPI'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="secondary">
                        {spec.swagger?.info?.version || '1.0.0'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info">
                        {Object.keys(spec.swagger?.paths || {}).length}
                      </Badge>
                    </td>
                    <td>
                      {spec.created ? new Date(spec.created).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleViewSpec(spec._id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleExportSpec(spec._id)}
                      >
                        Export
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteSpec(spec._id)}
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

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="xl" fullscreen="lg-down">
        <Modal.Header closeButton>
          <Modal.Title>Swagger Specification</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          {selectedSpec && (
            <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                showLineNumbers={true}
                lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#858585' }}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
              >
                {JSON.stringify(selectedSpec.swagger, null, 2)}
              </SyntaxHighlighter>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          {selectedSpec && (
            <Button variant="primary" onClick={() => {
              setShowViewModal(false)
              handleExportSpec(selectedSpec.id)
            }}>
              Export
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Specs
