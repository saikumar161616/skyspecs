import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { ToastContainer } from 'react-toastify';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">TurbineOps Lite</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {user && (
              <Nav className="me-auto">
                
                {/* USERS: Only visible to ADMIN */}
                {(user.role === 'ADMIN' || user?.role === 'VIEWER' ) && (
                  <Nav.Link 
                    as={Link} 
                    to="/users" 
                    active={location.pathname.startsWith('/users')}
                  >
                    Users
                  </Nav.Link>
                )}

                {/* TURBINES: Visible to ALL logged-in users */}
                <Nav.Link 
                  as={Link} 
                  to="/turbines" 
                  active={location.pathname.startsWith('/turbines')}
                >
                  Turbines
                </Nav.Link>

                {/* INSPECTIONS: Visible to ALL logged-in users */}
                <Nav.Link 
                  as={Link} 
                  to="/inspections" 
                  active={location.pathname.startsWith('/inspections')}
                >
                  Inspections
                </Nav.Link>

              </Nav>
            )}
            <Nav className="ms-auto">
              {user ? (
                <>
                  <Navbar.Text className="me-3">
                    Signed in as: <span className="fw-bold">{user.name} ({user.role})</span>
                  </Navbar.Text>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Outlet />
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Layout;