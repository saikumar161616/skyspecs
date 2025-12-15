// import React, { useEffect, useState } from 'react';
// import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { inspectionApi, turbineApi } from '../api/rest';
// import { toast } from 'react-toastify';

// interface Turbine {
//     id: string;
//     name: string;
// }

// const InspectionForm: React.FC = () => {
//     const navigate = useNavigate();
//     const { id } = useParams<{ id: string }>(); // If ID exists, we are editing
//     const [searchParams] = useSearchParams();
//     const specificTurbineId = searchParams.get('turbineId'); // If this exists, we are creating for a specific turbine

//     const [turbines, setTurbines] = useState<Turbine[]>([]);query
//     const [formData, setFormData] = useState({
//         date: new Date().toISOString().split('T')[0], // Default to today
//         turbineId: specificTurbineId || '',
//         dataSource: 'DRONE',
//         rawPackageUrl: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         loadTurbines();
//         if (id) {
//             loadInspection(id);
//         }
//     }, [id]);

//     const loadTurbines = async () => {
//         try {
//             const res = await turbineApi.getAll();
//             setTurbines(res.data.data);
//         } catch (e) {
//             toast.error('Failed to load turbines list');
//         }
//     };

//     const loadInspection = async (inspectionId: string) => {
//         try {
//             const res = await inspectionApi.getById(inspectionId);
//             const data = res.data.data;
//             setFormData({
//                 date: new Date(data.date).toISOString().split('T')[0],
//                 turbineId: data.turbineId,
//                 dataSource: data.dataSource,
//                 rawPackageUrl: data.rawPackageUrl || ''
//             });
//         } catch (e) {
//             setError('Could not fetch inspection details.');
//             toast.error('Failed to load inspection');
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             if (id) {
//                 await inspectionApi.update(id, formData);
//                 toast.success('Inspection updated successfully');
//             } else {
//                 await inspectionApi.create(formData);
//                 toast.success('Inspection created successfully');
//             }
//             navigate('/inspections');
//         } catch (err: any) {
//             const msg = err.response?.data?.message || 'Operation failed';
//             setError(msg);
//             toast.error(msg);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Container className="d-flex justify-content-center mt-4">
//             <Card style={{ width: '600px' }}>
//                 <Card.Header>
//                     <h3>{id ? 'Edit Inspection' : 'New Inspection'}</h3>
//                 </Card.Header>
//                 <Card.Body>
//                     {error && <Alert variant="danger">{error}</Alert>}
                    
//                     <Form onSubmit={handleSubmit}>
//                         {/* Turbine Selection */}
//                         <Form.Group className="mb-3">
//                             <Form.Label>Turbine</Form.Label>
//                             <Form.Select
//                                 value={formData.turbineId}
//                                 onChange={e => setFormData({ ...formData, turbineId: e.target.value })}
//                                 required
//                                 disabled={!!specificTurbineId || !!id} // Lock if editing or created via specific turbine link
//                             >
//                                 <option value="">Select a Turbine</option>
//                                 {turbines.map(t => (
//                                     <option key={t.id} value={t.id}>{t.name}</option>
//                                 ))}
//                             </Form.Select>
//                             {specificTurbineId && <Form.Text className="text-muted">Locked to specific turbine.</Form.Text>}
//                         </Form.Group>

//                         {/* Date */}
//                         <Form.Group className="mb-3">
//                             <Form.Label>Inspection Date</Form.Label>
//                             <Form.Control
//                                 type="date"
//                                 value={formData.date}
//                                 onChange={e => setFormData({ ...formData, date: e.target.value })}
//                                 required
//                             />
//                         </Form.Group>

//                         {/* Data Source */}
//                         <Form.Group className="mb-3">
//                             <Form.Label>Data Source</Form.Label>
//                             <Form.Select
//                                 value={formData.dataSource}
//                                 onChange={e => setFormData({ ...formData, dataSource: e.target.value })}
//                             >
//                                 <option value="DRONE">DRONE</option>
//                                 <option value="MANUAL">MANUAL</option>
//                             </Form.Select>
//                         </Form.Group>

//                         {/* Raw Package URL */}
//                         <Form.Group className="mb-3">
//                             <Form.Label>Raw Package URL (Optional)</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder="https://..."
//                                 value={formData.rawPackageUrl}
//                                 onChange={e => setFormData({ ...formData, rawPackageUrl: e.target.value })}
//                             />
//                         </Form.Group>

//                         <div className="d-flex justify-content-end gap-2">
//                             <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
//                             <Button variant="primary" type="submit" disabled={loading}>
//                                 {loading ? 'Saving...' : (id ? 'Update Inspection' : 'Create Inspection')}
//                             </Button>
//                         </div>
//                     </Form>
//                 </Card.Body>
//             </Card>
//         </Container>
//     );
// };

// export default InspectionForm;



//////////////////////////////////////////////////







import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { inspectionApi, turbineApi, authApi } from '../api/rest';
import { toast } from 'react-toastify';

interface Turbine {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    role: string;
}

const InspectionForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // If ID exists, we are editing
    const [searchParams] = useSearchParams();
    const specificTurbineId = searchParams.get('turbineId'); // If this exists, we are creating for a specific turbine

    const [turbines, setTurbines] = useState<Turbine[]>([]);
    const [inspectors, setInspectors] = useState<User[]>([]); // State for inspectors
    
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default to today
        turbineId: specificTurbineId || '',
        inspectorId: '', //Added inspectorId
        dataSource: 'DRONE',
        rawPackageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTurbines();
        loadInspectors();
        if (id) {
            loadInspection(id);
        }
    }, [id]);

    const loadTurbines = async () => {
        try {
            const res = await turbineApi.getAll();
            setTurbines(res.data.data);
        } catch (e) {
            toast.error('Failed to load turbines list');
        }
    };

    const loadInspectors = async () => {
        try {
            const res = await authApi.getUsersByRole('ENGINEER');
            // Optional: Filter for specific roles if needed, e.g., only 'ENGINEER' or 'ADMIN'
            // const validInspectors = res.data.data.filter((u: User) => u.role !== 'VIEWER');
            setInspectors(res.data.data);
        } catch (e) {
            toast.error('Failed to load inspectors list');
        }
    };

    const loadInspection = async (inspectionId: string) => {
        try {
            const res = await inspectionApi.getById(inspectionId);
            const data = res.data.data;
            setFormData({
                date: new Date(data.date).toISOString().split('T')[0],
                turbineId: data.turbineId,
                inspectorId: data.inspectorId || '', // Populate inspectorId
                dataSource: data.dataSource,
                rawPackageUrl: data.rawPackageUrl || ''
            });
        } catch (e) {
            setError('Could not fetch inspection details.');
            toast.error('Failed to load inspection');
        }
    };

    const validateForm = () => {
        if (!formData.turbineId) return "Please select a turbine.";
        if (!formData.inspectorId) return "Please select an inspector.";
        if (!formData.date) return "Date is required.";
        
        // Simple URL validation if rawPackageUrl is provided
        if (formData.rawPackageUrl) {
            try {
                new URL(formData.rawPackageUrl);
            } catch (_) {
                return "Raw Package URL must be a valid URI (e.g., https://example.com).";
            }
        }
        return null;
    };

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
            if (id) {
                await inspectionApi.update(id, formData);
                toast.success('Inspection updated successfully');
            } else {
                await inspectionApi.create(formData);
                toast.success('Inspection created successfully');
            }
            navigate('/inspections');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Operation failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-4">
            <Card style={{ width: '600px' }}>
                <Card.Header>
                    <h3>{id ? 'Edit Inspection' : 'New Inspection'}</h3>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        {/* Turbine Selection */}
                        <Form.Group className="mb-3">
                            <Form.Label>Turbine</Form.Label>
                            <Form.Select
                                value={formData.turbineId}
                                onChange={e => setFormData({ ...formData, turbineId: e.target.value })}
                                required
                                disabled={!!specificTurbineId || !!id} // Lock if editing or created via specific turbine link
                            >
                                <option value="">Select a Turbine</option>
                                {turbines.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </Form.Select>
                            {specificTurbineId && <Form.Text className="text-muted">Locked to specific turbine.</Form.Text>}
                        </Form.Group>

                        {/* Inspector Selection - NEW */}
                        <Form.Group className="mb-3">
                            <Form.Label>Inspector</Form.Label>
                            <Form.Select
                                value={formData.inspectorId}
                                onChange={e => setFormData({ ...formData, inspectorId: e.target.value })}
                                required
                            >
                                <option value="">Select an Inspector</option>
                                {inspectors.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.role})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Date */}
                        <Form.Group className="mb-3">
                            <Form.Label>Inspection Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </Form.Group>

                        {/* Data Source */}
                        <Form.Group className="mb-3">
                            <Form.Label>Data Source</Form.Label>
                            <Form.Select
                                value={formData.dataSource}
                                onChange={e => setFormData({ ...formData, dataSource: e.target.value })}
                            >
                                <option value="DRONE">DRONE</option>
                                <option value="MANUAL">MANUAL</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Raw Package URL */}
                        <Form.Group className="mb-3">
                            <Form.Label>Raw Package URL (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="https://..."
                                value={formData.rawPackageUrl}
                                onChange={e => setFormData({ ...formData, rawPackageUrl: e.target.value })}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (id ? 'Update Inspection' : 'Create Inspection')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default InspectionForm;