import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { inspectionApi, turbineApi } from '../api/rest';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';


interface Inspection {
    id: string;
    date: string;
    dataSource: string;
    turbine: { name: string };
    inspector: { name: string };
}

interface Turbine {
    id: string;
    name: string;
    manufacturer?: string;
    status: string;
}

const Inspections: React.FC = () => {
    const { user } = useAuth();
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [turbines, setTurbines] = useState<Turbine[]>([]);
    const [filters, setFilters] = useState({ turbineId: '', date: '', dataSource: '', startDate: '', endDate: '' });

    // Check if any filter is applied
    const hasActiveFilters = filters.turbineId !== '' || filters.date !== '' || filters.dataSource !== '' || filters.startDate !== '' || filters.endDate !== '';

    const fetchTurbines = async () => {
        try {
            const res = await turbineApi.getAll();
            setTurbines(res.data.data || []);
        } catch (error) {
            toast.error('Failed to load turbines');
            console.error('Error fetching turbines:', error);
        }
    };

    const fetchInspections = async () => {
        try {
            // Pass filters as query params
            const params = new URLSearchParams(filters as any).toString();
            const res = await inspectionApi.getAll(params ? { ...filters } : undefined);
            setInspections(res.data.data);
        } catch (error) {
            toast.error('Failed to load inspections');
        }
    };

    useEffect(() => {
        fetchTurbines();
    }, []);

    useEffect(() => {
        fetchInspections();
    }, [filters]); // Re-fetch when filters change

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Inspections</h1>
                {user?.role !== 'VIEWER' && (
                    <Link to="/inspections/new" className="btn btn-primary">
                        + New Inspection
                    </Link>
                )}
                {/* <Link to="/inspections/new" className="btn btn-primary">+ New Inspection</Link> */}
            </div>

            <Row className="mb-3 bg-light p-3 rounded">
                <Col md={2}>
                    <Form.Control
                        type="date"
                        placeholder="Filter by start Date"
                        value={filters.startDate}
                        onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                    />
                </Col>
                <Col md={2}>
                    <Form.Control
                        type="date"
                        placeholder="Filter by start date"
                        value={filters.endDate}
                        onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </Col>
                <Col md={2}>
                    <Form.Select
                        value={filters.dataSource}
                        onChange={e => setFilters({ ...filters, dataSource: e.target.value })}>
                        <option value="">All Data Sources</option>
                        <option value="DRONE">Drone</option>
                        <option value="MANUAL">Manual</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select
                        value={filters.turbineId}
                        onChange={e => setFilters({ ...filters, turbineId: e.target.value })}
                    >
                        <option value="">All Turbines</option>
                        {turbines.map(turbine => (
                            <option key={turbine.id} value={turbine.id}>
                                {turbine.name} {turbine.manufacturer ? `(${turbine.manufacturer})` : ''}
                            </option>
                        ))}
                    </Form.Select>
                </Col>


                {hasActiveFilters && (
                    <Col md={2}>
                        <Button
                            variant="outline-secondary"
                            onClick={() => setFilters({ turbineId: '', date: '', dataSource: '', startDate: '', endDate: '' })}
                        >
                            Clear Filters
                        </Button>
                    </Col>
                )}
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