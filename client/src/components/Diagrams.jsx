import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, Alert, Table, Modal } from 'react-bootstrap'
import axios from 'axios'

function Diagrams() {
  const [diagrams, setDiagrams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDiagram, setSelectedDiagram] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchDiagrams()
  }, [])

  const fetchDiagrams = async () => {
    try {
      const response = await axios.get('/api/diagrams')
      setDiagrams(response.data)
    } catch (err) {
      setError('Failed to load diagrams')
      console.error('Error fetching diagrams:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDiagram = async (diagramId) => {
    try {
      const response = await axios.get(`/api/diagrams/${diagramId}/mermaid`)
      setSelectedDiagram({
        id: diagramId,
        mermaid: response.data
      })
      setShowViewModal(true)
    } catch (err) {
      console.error('Error fetching diagram:', err)
      setError('Failed to load diagram')
    }
  }

  const handleExportDiagram = async (diagramId) => {
    try {
      const response = await axios.get(`/api/diagrams/${diagramId}/mermaid`)
      const mermaidText = response.data
      const blob = new Blob([mermaidText], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Get the diagram title for the filename
      const diagram = diagrams.find(d => d._id === diagramId)
      const filename = diagram?.title ? `${diagram.title}.mmd` : `diagram-${diagramId}.mmd`
      a.download = filename
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error exporting diagram:', err)
      setError('Failed to export diagram')
    }
  }

  const handleDeleteDiagram = async (diagramId) => {
    if (!window.confirm('Are you sure you want to delete this diagram?')) {
      return
    }

    try {
      await axios.delete(`/api/diagrams/${diagramId}`)
      // Refresh the list
      fetchDiagrams()
    } catch (err) {
      console.error('Error deleting diagram:', err)
      setError('Failed to delete diagram')
    }
  }

  // Render Mermaid diagram
  useEffect(() => {
    if (showViewModal && selectedDiagram && selectedDiagram.mermaid) {
      // Wait for modal to be fully rendered
      setTimeout(() => {
        if (window.mermaid && selectedDiagram) {
          const element = document.getElementById('mermaid-diagram-view')
          if (element) {
            // Clear previous content
            element.innerHTML = selectedDiagram.mermaid
            // Re-initialize Mermaid for this element
            window.mermaid.init(undefined, element)
          }
        }
      }, 100)
    }
  }, [showViewModal, selectedDiagram])

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
      <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mermaid Diagrams</h2>
      </div>

      {diagrams.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No diagrams found</h5>
            <p className="text-muted">
              Generate diagrams from your HAR files to get started
            </p>
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
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {diagrams.map((diagram) => (
                  <tr key={diagram._id}>
                    <td>{diagram.title}</td>
                    <td>
                      <Badge bg="primary">Mermaid</Badge>
                    </td>
                    <td>
                      {diagram.created ? new Date(diagram.created).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleViewDiagram(diagram._id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleExportDiagram(diagram._id)}
                      >
                        Export
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteDiagram(diagram._id)}
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
          <Modal.Title>Mermaid Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px', maxHeight: '70vh', overflow: 'auto' }}>
          {selectedDiagram && (
            <div>
              <pre id="mermaid-diagram-view" className="mermaid" style={{ margin: 0 }}>
                {selectedDiagram.mermaid}
              </pre>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          {selectedDiagram && (
            <Button variant="primary" onClick={() => {
              setShowViewModal(false)
              handleExportDiagram(selectedDiagram.id)
            }}>
              Export
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Diagrams

