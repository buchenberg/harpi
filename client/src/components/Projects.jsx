import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Badge, Alert } from 'react-bootstrap'
import axios from 'axios'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects')
      setProjects(response.data)
    } catch (err) {
      setError('Failed to load projects')
      console.error('Error fetching projects:', err)
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
        <h2>Projects</h2>
        <Button variant="primary">
          <i className="bi bi-plus"></i> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No projects found</h5>
            <p className="text-muted">Create your first project to get started</p>
            <Button variant="primary">Create Project</Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {projects.map((project) => (
            <Col md={6} lg={4} key={project._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text className="text-muted">
                    {project.description || 'No description available'}
                  </Card.Text>
                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">
                      {project.hars?.length || 0} HAR files
                    </Badge>
                    <Badge bg="info">
                      {project.specs?.length || 0} Specs
                    </Badge>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    View
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    Edit
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Projects
