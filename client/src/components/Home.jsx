import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome to Harpi</h1>
        <p className="lead text-muted">
          HTTP Archive Pipeline - Transform your HAR files into API specifications
        </p>
      </div>

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
              <Button variant="outline-primary" disabled>
                Coming Soon
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
              <li>Upload HAR files from your browser's developer tools</li>
              <li>Generate API specifications automatically</li>
              <li>Export specifications in various formats</li>
            </ol>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Home
