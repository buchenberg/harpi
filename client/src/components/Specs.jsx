import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Badge, Alert, Table } from 'react-bootstrap'
import axios from 'axios'

function Specs() {
  const [specs, setSpecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
                      <Button variant="outline-primary" size="sm" className="me-2">
                        View
                      </Button>
                      <Button variant="outline-success" size="sm" className="me-2">
                        Export
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

export default Specs
