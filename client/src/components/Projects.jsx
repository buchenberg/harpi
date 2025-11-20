import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Badge, Alert, Modal, Form } from 'react-bootstrap'
import axios from 'axios'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

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

  const handleCreateProject = async (e) => {
    e.preventDefault()
    
    if (!projectName.trim()) {
      setError('Project name is required')
      return
    }

    try {
      setCreating(true)
      setError(null)
      const response = await axios.post('/api/projects', {
        title: projectName.trim(),
        description: projectDescription.trim()
      })
      
      // Refresh the list
      await fetchProjects()
      
      // Close modal and reset form
      setShowCreateModal(false)
      setProjectName('')
      setProjectDescription('')
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  const handleOpenCreateModal = () => {
    setProjectName('')
    setProjectDescription('')
    setError(null)
    setShowCreateModal(true)
  }

  const handleViewProject = async (projectId) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`)
      setSelectedProject(response.data)
      setShowViewModal(true)
    } catch (err) {
      console.error('Error fetching project:', err)
      setError('Failed to load project')
    }
  }

  const handleEditProject = async (projectId) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`)
      const project = response.data
      setSelectedProject(project)
      setProjectName(project.title || '')
      setProjectDescription(project.description || '')
      setError(null)
      setShowEditModal(true)
    } catch (err) {
      console.error('Error fetching project:', err)
      setError('Failed to load project')
    }
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()
    
    if (!projectName.trim()) {
      setError('Project name is required')
      return
    }

    if (!selectedProject) {
      setError('No project selected')
      return
    }

    try {
      setUpdating(true)
      setError(null)
      await axios.put(`/api/projects/${selectedProject._id}`, {
        title: projectName.trim(),
        description: projectDescription.trim()
      })
      
      // Refresh the list
      await fetchProjects()
      
      // Close modal and reset form
      setShowEditModal(false)
      setSelectedProject(null)
      setProjectName('')
      setProjectDescription('')
    } catch (err) {
      console.error('Error updating project:', err)
      setError(err.response?.data?.message || 'Failed to update project')
    } finally {
      setUpdating(false)
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
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <i className="bi bi-plus"></i> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No projects found</h5>
            <p className="text-muted">Create your first project to get started</p>
            <Button variant="primary" onClick={handleOpenCreateModal}>Create Project</Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {projects.map((project) => (
            <Col md={6} lg={4} key={project._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {project.description || 'No description available'}
                  </Card.Text>
                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">
                      {project.hars?.length || 0} HAR files
                    </Badge>
                    <Badge bg="info" className="me-2">
                      {project.specsCount || 0} Specs
                    </Badge>
                    <Badge bg="primary">
                      {project.diagramsCount || 0} Diagrams
                    </Badge>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleViewProject(project._id)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleEditProject(project._id)}
                  >
                    Edit
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Project Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateProject}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Project Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description (optional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Project Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProject?.title || 'Project Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <h5>Project Information</h5>
              <Table striped bordered size="sm">
                <tbody>
                  <tr>
                    <td><strong>Title:</strong></td>
                    <td>{selectedProject.title}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>{selectedProject.description || 'No description'}</td>
                  </tr>
                  <tr>
                    <td><strong>Created:</strong></td>
                    <td>{selectedProject.created ? new Date(selectedProject.created).toLocaleString() : 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Statistics</h5>
              <div className="mb-3">
                <Badge bg="secondary" className="me-2">
                  {selectedProject.hars?.length || 0} HAR files
                </Badge>
                <Badge bg="info" className="me-2">
                  {selectedProject.specs?.length || 0} Specs
                </Badge>
                <Badge bg="primary">
                  {selectedProject.diagrams?.length || 0} Diagrams
                </Badge>
              </div>

              {selectedProject.hars && selectedProject.hars.length > 0 && (
                <div className="mt-4">
                  <h6>HAR Files</h6>
                  <ul>
                    {selectedProject.hars.map((har) => (
                      <li key={har._id}>{har.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          {selectedProject && (
            <Button variant="primary" onClick={() => {
              setShowViewModal(false)
              handleEditProject(selectedProject._id)
            }}>
              Edit
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProject}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Project Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description (optional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false)
              setSelectedProject(null)
              setProjectName('')
              setProjectDescription('')
            }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default Projects
