import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { inspectionApi } from '../api/rest';
import { toast } from 'react-toastify';

interface Inspection {
    id: string;
    date: string;
    dataSource: string;
    turbine: { name: string };
    inspector: { name: string };
}

const Inspections: React.FC = () => {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [filters, setFilters] = useState({ turbineId: '', date: '', dataSource: '' });

    const fetchInspections = async () => {
        try {
            // Pass filters as query params
            const params = new URLSearchParams(filters as any).toString();
            const res = await inspectionApi.getAll();
            setInspections(res.data.data);
        } catch (error) {
            toast.error('Failed to load inspections');
        }
    };

    useEffect(() => {
        fetchInspections();
    }, [filters]); // Re-fetch when filters change

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Inspections</h1>
                <Link to="/inspections/new" className="btn btn-primary">+ New Inspection</Link>
            </div>

            <Row className="mb-3 bg-light p-3 rounded">
                <Col md={3}>
                    <Form.Control
                        type="date"
                        placeholder="Filter by Date"
                        onChange={e => setFilters({ ...filters, date: e.target.value })}
                    />
                </Col>
                <Col md={3}>
                    <Form.Select onChange={e => setFilters({ ...filters, dataSource: e.target.value })}>
                        <option value="">All Data Sources</option>
                        <option value="DRONE">Drone</option>
                        <option value="MANUAL">Manual</option>
                    </Form.Select>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Turbine</th>
                        <th>Source</th>
                        <th>Inspector</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inspections.map((i) => (
                        <tr key={i.id}>
                            <td>{new Date(i.date).toLocaleDateString()}</td>
                            <td>{i.turbine?.name}</td>
                            <td><Badge bg={i.dataSource === 'DRONE' ? 'info' : 'secondary'}>{i.dataSource}</Badge></td>
                            <td>{i.inspector?.name}</td>
                            <td>
                                <Link to={`/inspections/${i.id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Inspections;