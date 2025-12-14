import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { findingApi } from '../api/rest'; // Ensure this is exported in rest.ts
import { toast } from 'react-toastify';

interface AddFindingModalProps {
    show: boolean;
    handleClose: () => void;
    inspectionId: string;
    onSuccess: () => void; // Callback to refresh the list after adding
}

const AddFindingModal: React.FC<AddFindingModalProps> = ({ show, handleClose, inspectionId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        category: 'BLADE_DAMAGE',
        severity: 1,
        estimatedCost: 0,
        notes: ''
    });

    // Reset form when modal opens/closes if needed, or just keep state
    // For simplicity, we keep state but you might want a useEffect to reset on 'show' change.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Construct payload based on Prisma schema & Validation
            const payload = {
                ...formData,
                inspectionId, 
                severity: Number(formData.severity),
                estimatedCost: Number(formData.estimatedCost)
            };

            await findingApi.create(payload, inspectionId);
            toast.success('Finding added successfully');
            
            // Reset form for next use
            setFormData({
                category: 'BLADE_DAMAGE',
                severity: 1,
                estimatedCost: 0,
                notes: ''
            });
            
            onSuccess(); // Refresh parent data
            handleClose();
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to add finding';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Finding</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {/* Category Enum */}
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select 
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="BLADE_DAMAGE">Blade Damage</option>
                            <option value="LIGHTNING">Lightning</option>
                            <option value="EROSION">Erosion</option>
                            <option value="UNKNOWN">Unknown</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Severity Int validation allows max 10 */}
                    <Form.Group className="mb-3">
                        <Form.Label>Severity (1-10)</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="1" 
                            max="10" 
                            required
                            value={formData.severity}
                            onChange={e => setFormData({ ...formData, severity: parseInt(e.target.value) || 0 })}
                        />
                        <Form.Text className="text-muted">
                            1 = Minor, 10 = Critical Failure
                        </Form.Text>
                    </Form.Group>

                    {/* Estimated Cost Float */}
                    <Form.Group className="mb-3">
                        <Form.Label>Estimated Repair Cost ($)</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="0" 
                            step="0.01"
                            required
                            value={formData.estimatedCost}
                            onChange={e => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
                        />
                    </Form.Group>

                    {/* Notes String */}
                    <Form.Group className="mb-3">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Describe the issue..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Finding'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddFindingModal;