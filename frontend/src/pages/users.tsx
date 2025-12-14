import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form , Alert} from 'react-bootstrap';
import { authApi } from '../api/rest';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    passwordHash?: string;
    status?: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newUser, setNewUser] = useState<User>({ name: '', email: '', role: '', passwordHash: '' });
    const { user: currentUser } = useAuth();
    const [formError, setFormError] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await authApi.getAllUsers(); // Ensure this method exists in your api/rest.ts
            setUsers(res.data.data);
        } catch (error) {
            toast.error('Failed to load users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: User) => {
        setEditingId(user.id || null);
        setNewUser({ name: user.name, email: user.email, role: user.role });
        setFormError('');
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingId(null);
        setNewUser({ name: '', email: '', role: '', passwordHash: '' });
        setFormError('');
    };


    const validateForm = () => {
        if (!newUser.name || newUser.name.length < 3) {
            return "Name must be at least 3 characters long.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!newUser.email || !emailRegex.test(newUser.email)) {
            return "Please enter a valid email address.";
        }

        if (!newUser.role) {
            return "Please select a role.";
        }

        // Only validate password for new users
        if (!editingId) {
            if (!newUser.passwordHash || newUser.passwordHash.length < 6) {
                return "Password must be at least 6 characters long.";
            }
        }
        return null;
    };

    const handleSave = async () => {
        const error = validateForm();
        if (error) {
            setFormError(error);
            return;
        }
        try {
            if (editingId) {
                // Update logic
                const { passwordHash, ...updatePayload } = newUser;
                console.log('Updating user with ID:', updatePayload);
                await authApi.updateUser(editingId, updatePayload); //Ensure updateUser exists
                toast.success('User updated successfully');
            }
            else {
                // Create logic
                await authApi.register(newUser);
                toast.success('User created successfully');
            }
            handleClose();
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} user`);
            setFormError('');
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Users</h1>
                {currentUser?.role !== 'VIEWER' && (
                    <Button onClick={() => setShowModal(true)}>+ Add User</Button>
                )}
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        {currentUser?.role !== 'VIEWER' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((t, index) => (
                        <tr key={index}>
                            <td>{t.name}</td>
                            <td>{t.email}</td>
                            <td>{t.role}</td>
                            <td>{t?.status}</td>
                            {currentUser?.role !== 'VIEWER' && (
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleEdit(t)}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {formError && <Alert variant="danger">{formError}</Alert>}
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={newUser.name}
                                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="">Select Role</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="ENGINEER">ENGINEER</option>
                                <option value="VIEWER">VIEWER</option>
                            </Form.Select>
                        </Form.Group>

                        {/* HIDE PASSWORD FIELD IF EDITING */}
                        {!editingId && (
                            <Form.Group className="mb-2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={newUser.passwordHash || ''}
                                    onChange={e => setNewUser({ ...newUser, passwordHash: e.target.value })}
                                />
                            </Form.Group>
                        )}
                        {editingId && (
                            <Form.Group className="mb-2">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={newUser.status}
                                    onChange={e => setNewUser({ ...newUser, status: e.target.value })}
                                >
                                    <option value="">Select Status</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </Form.Select>
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>
                        {editingId ? 'Update' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Users;