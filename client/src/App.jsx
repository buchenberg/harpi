import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, Navbar, Nav } from 'react-bootstrap'
import Home from './components/Home'
import Projects from './components/Projects'
import Hars from './components/Hars'
import Specs from './components/Specs'
import Diagrams from './components/Diagrams'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Harpi</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/projects">Projects</Nav.Link>
              <Nav.Link href="/hars">HAR Files</Nav.Link>
              <Nav.Link href="/specs">Specs</Nav.Link>
              <Nav.Link href="/diagrams">Diagrams</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hars" element={<Hars />} />
          <Route path="/specs" element={<Specs />} />
          <Route path="/diagrams" element={<Diagrams />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
