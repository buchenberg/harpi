import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function Home() {
  return (
    <div>
      <Card className="mb-5 border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <img 
            src={logo} 
            alt="Harpi Logo" 
            className="mb-4"
            style={{ maxWidth: '300px', height: 'auto' }}
          />
          <h1 className="display-4">Welcome to Harpi</h1>
          <p className="lead text-muted">
            HTTP Archive Pipeline - Transform your HAR files into API specifications and Mermaid sequence diagrams
          </p>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>
                <i className="bi bi-folder2-open"></i> Projects
              </Card.Title>
              <Card.Text>
                Manage your API projects and organize your HAR files
              </Card.Text>
              <Button as={Link} to="/projects" variant="primary">
                View Projects
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>
                <i className="bi bi-file-earmark-code"></i> HAR Files
              </Card.Title>
              <Card.Text>
                Upload and analyze HTTP Archive files
              </Card.Text>
              <Button as={Link} to="/hars" variant="primary">
                View HAR Files
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>
                <i className="bi bi-file-earmark-text"></i> Specifications
              </Card.Title>
              <Card.Text>
                Generate and manage API specifications
              </Card.Text>
              <Button as={Link} to="/specs" variant="primary">
                View Specs
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>
                <i className="bi bi-diagram-3"></i> UML Diagrams
              </Card.Title>
              <Card.Text>
                Generate UML diagrams from your HAR files
              </Card.Text>
              <Button as={Link} to="/diagrams" variant="primary">
                View Diagrams
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-5">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Getting Started</h5>
          </Card.Header>
          <Card.Body>
            <ol>
              <li>Create a new project to organize your work</li>
              <li>Upload HAR files from your browser's developer tools (you'll need to select a project when uploading)</li>
              <li>Generate API specifications or Mermaid sequence diagrams from your HAR files</li>
              <li>View, export, or test your specifications using the interactive Swagger UI</li>
              <li>View and export your Mermaid diagrams</li>
            </ol>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Home
