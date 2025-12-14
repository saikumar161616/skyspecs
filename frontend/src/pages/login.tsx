import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/rest';
import { useAuth } from '../context/authContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    // Email Regex (Simple version compatible with Joi's logic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    return null;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
        setError(validationError);
        return;
    }
    try {
      // Adjusted endpoint based on UserRoute: router.post('/login', ...)
      const res = await authApi.login({ email, password });
      console.log(res);
      if (res.data.status) {
        // Assuming response structure: { status: true, data: { token: '...' } }
        login(res.data.data); 
        navigate('/turbines');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Button className="w-100" type="submit">Log In</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;