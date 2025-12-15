import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { findingApi } from '../api/rest'; // Ensure this is exported in rest.ts
import { toast } from 'react-toastify';


// Define Interface locally or import it if you have a shared types file
interface Finding {
    id: string;
    category: string;
    severity: number;
    estimatedCost?: number;
    notes: string;
}

interface AddFindingModalProps {
    show: boolean;
    handleClose: () => void;
    inspectionId: string;
    onSuccess: () => void; // Callback to refresh the list after adding
    findingToEdit?: Finding | null;
}

const AddFindingModal: React.FC<AddFindingModalProps> = ({ show, handleClose, inspectionId, onSuccess, findingToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        category: 'BLADE_DAMAGE',
        severity: 1,
        estimatedCost: 0,
        notes: ''
    });


    // NEW: Effect to populate form when editing
    useEffect(() => {
        if (findingToEdit) {
            setFormData({
                category: findingToEdit.category,
                severity: findingToEdit.severity,
                estimatedCost: findingToEdit.estimatedCost || 0,
                notes: findingToEdit.notes || ''
            });
        } else {
            // Reset to defaults if adding new
            setFormData({
                category: 'BLADE_DAMAGE',
                severity: 1,
                estimatedCost: 0,
                notes: ''
            });
        }
    }, [findingToEdit, show]);


    const validateForm = () => {
        const severity = Number(formData.severity);
        const cost = Number(formData.estimatedCost);

        if (!Number.isInteger(severity) || severity < 1 || severity > 10) {
            return "Severity must be an integer between 1 and 10.";
        }
        if (cost <= 0) {
            return "Estimated cost must be a positive number.";
        }
        return null;
    };

    // Reset form when modal opens/closes if needed, or just keep state
    // For simplicity, we keep state but you might want a useEffect to reset on 'show' change

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            // Construct payload based on Prisma schema & Validation
            // const payload = {
            //     ...formData,
            //     inspectionId,
            //     severity: Number(formData.severity),
            //     estimatedCost: Number(formData.estimatedCost)
            // };

            const basePayload = {
                category: formData.category,
                severity: Number(formData.severity),
                estimatedCost: Number(formData.estimatedCost),
                notes: formData.notes || null
            };

            // await findingApi.create(payload, inspectionId);

            if (findingToEdit) {
                // EDIT MODE
                await findingApi.update(findingToEdit.id, basePayload);
                toast.success('Finding updated successfully');
            }
            else {
                // CREATE MODE
                const createPayload = {
                    ...basePayload,
                    inspectionId
                };

                await findingApi.create(createPayload, inspectionId);
                toast.success('Finding added successfully');
            }

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
                        <div className="d-flex justify-content-end gap-2">

                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (findingToEdit ? 'Update Finding' : 'Add Finding')}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddFindingModal;