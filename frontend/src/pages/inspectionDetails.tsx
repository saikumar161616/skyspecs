// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Button, Row, Col, Table, Badge, Container, Spinner, Tab, Tabs, Alert } from 'react-bootstrap';
// import { inspectionApi, repairPlanApi, findingApi } from '../api/rest';
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/authContext';
// import AddFindingModal from '../components/addFindingModal';

// // --- Types ---
// interface Finding {
//     id: string;
//     category: string;
//     severity: number;
//     estimatedCost?: number; // Marked as optional
//     notes: string;
//     status: string;
// }

// interface RepairPlan {
//     id: string;
//     priority: 'HIGH' | 'MEDIUM' | 'LOW';
//     totalEstimatedCost?: number; // Marked as optional
//     status: string;
//     createdAt: string;
// }

// interface Inspection {
//     id: string;
//     date: string;
//     dataSource: string;
//     rawPackageUrl?: string;
//     status: string;
//     turbine: {
//         id: string;
//         name: string;
//         manufacturer: string;
//         mwRating: number;
//         lat: number;
//         lng: number;
//     };
//     inspector: {
//         id: string;
//         name: string;
//     };
//     findings?: Finding[];
// }

// const InspectionDetails: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const { user } = useAuth();

//     const [inspection, setInspection] = useState<Inspection | null>(null);
//     const [finding, setFinding] = useState<Finding[]>([]);
//     const [repairPlan, setRepairPlan] = useState<RepairPlan | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('findings');
//     const [showAddFinding, setShowAddFinding] = useState(false);

//     // --- Data Loading ---
//     useEffect(() => {
//         if (id) {
//             loadData();
//         }
//     }, [id]);

//     const loadData = async () => {
//         setLoading(true);
//         try {
//             if (!id) return;

//             // 0. Fetch Inspection Details
//             const inspData = await inspectionApi.getById(id);
//             setInspection(inspData.data.data);

//             // 2. Fetch Findings Details
//             const inspRes = await findingApi.getFindingsById(id);
//             setFinding(inspRes.data.data);

//             console.log('Findings Data:', inspRes.data.data);

//             // 3. Fetch Repair Plan
//             try {
//                 const planRes = await repairPlanApi.getByInspectionId(id);
//                 if (planRes.data && planRes.data.data) {
//                     setRepairPlan(planRes.data.data);
//                 }
//             } catch (err) {
//                 setRepairPlan(null);
//             }

//         } catch (error) {
//             toast.error('Failed to load inspection details');
//             navigate('/inspections');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --- Actions ---
//     const handleGeneratePlan = async () => {
//         if (!id) return;
//         try {
//             await repairPlanApi.create({ inspectionId: id });
//             toast.success('Repair Plan generated successfully!');
//             loadData();
//             setActiveTab('repair-plan');
//         } catch (error: any) {
//             toast.error(error.response?.data?.message || 'Failed to generate repair plan');
//         }
//     };

//     if (loading) {
//         return (
//             <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                 <Spinner animation="border" variant="primary" />
//             </Container>
//         );
//     }

//     if (!inspection) return <Alert variant="danger">Inspection not found</Alert>;

//     return (
//         <Container className="mt-4">
//             {/* Header Section */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div>
//                     <h1>{inspection.turbine.name} Inspection</h1>
//                     <span className="text-muted">
//                         Date: {new Date(inspection.date).toLocaleDateString()} |
//                         Inspector: <strong>{inspection.inspector?.name || 'N/A'}</strong>
//                     </span>
//                 </div>
//                 <div className="d-flex gap-2">
//                     <Button variant="secondary" onClick={() => navigate('/inspections')}>Back to List</Button>
//                     {/* {(user?.role === 'ADMIN' || user?.role === 'ENGINEER') && (
//                         <Button variant="primary" onClick={() => navigate(`/inspections/${id}/edit`)}>Edit Details</Button>
//                     )} */}
//                 </div>
//             </div>

//             {/* Overview Card */}
//             <Card className="mb-4 shadow-sm">
//                 <Card.Body>
//                     <Row>
//                         <Col md={3}>
//                             <strong>Data Source:</strong> <Badge bg="info">{inspection.dataSource}</Badge>
//                         </Col>
//                         <Col md={3}>
//                             <strong>Manufacturer:</strong> {inspection.turbine.manufacturer}
//                         </Col>
//                         <Col md={3}>
//                             <strong>Location:</strong> {inspection.turbine.lat}, {inspection.turbine.lng}
//                         </Col>
//                         <Col md={3}>
//                             <strong>Raw Data:</strong>
//                             {inspection.rawPackageUrl ? (
//                                 <a href={inspection.rawPackageUrl} target="_blank" rel="noreferrer" className="ms-1">Open Link</a>
//                             ) : <span className="text-muted ms-1">None</span>}
//                         </Col>
//                     </Row>
//                 </Card.Body>
//             </Card>

//             {/* Tabs */}
//             <Tabs
//                 activeKey={activeTab}
//                 onSelect={(k) => setActiveTab(k || 'findings')}
//                 className="mb-3"
//             >
//                 {/* --- FINDINGS TAB --- */}
//                 <Tab eventKey="findings" title={`Findings (${finding?.length || 0})`}>
//                     <Card>
//                         <Card.Header className="d-flex justify-content-between align-items-center bg-white">
//                             <h5 className="mb-0">Detected Issues</h5>
//                             {user?.role !== 'VIEWER' && (
//                                 <Button size="sm" variant="outline-success"
//                                     onClick={() => setShowAddFinding(true)}
//                                 >
//                                     + Add Finding
//                                 </Button>
//                             )}
//                         </Card.Header>
//                         <Card.Body className="p-0">
//                             <Table striped hover responsive className="mb-0">
//                                 <thead className="bg-light">
//                                     <tr>
//                                         <th>Category</th>
//                                         <th>Severity (1-5)</th>
//                                         <th>Est. Cost</th>
//                                         <th>Notes</th>
//                                         <th>Created By </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {finding && finding.length > 0 ? (
//                                         finding.map((finding: any) => (
//                                             <tr key={finding.id}>
//                                                 <td>{finding.category}</td>
//                                                 <td>
//                                                     <Badge bg={
//                                                         finding.severity >= 4 ? 'danger' :
//                                                             finding.severity === 3 ? 'warning' : 'success'
//                                                     }>
//                                                         {finding.severity}
//                                                     </Badge>
//                                                 </td>
//                                                 {/* FIX: Safe check for null cost */}
//                                                 <td>${(finding.estimatedCost || 0).toLocaleString()}</td>
//                                                 <td>{finding.notes}</td>
//                                                 <td>{finding?.creator.name}</td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={4} className="text-center py-4 text-muted">
//                                                 No findings recorded for this inspection yet.
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </Table>
//                         </Card.Body>
//                     </Card>
//                 </Tab>

//                 {/* --- REPAIR PLAN TAB --- */}
//                 <Tab eventKey="repair-plan" title="Repair Plan">
//                     {repairPlan ? (
//                         <Card border={repairPlan.priority === 'HIGH' ? 'danger' : 'success'}>
//                             <Card.Header className="d-flex justify-content-between align-items-center">
//                                 <h5 className="mb-0">Current Plan</h5>
//                                 <Badge bg={repairPlan.priority === 'HIGH' ? 'danger' : 'success'}>
//                                     {repairPlan.priority} PRIORITY
//                                 </Badge>
//                             </Card.Header>
//                             <Card.Body>
//                                 <Row className="mb-3">
//                                     <Col md={6}>
//                                         {/* FIX: Safe check for null totalEstimatedCost */}
//                                         <h3>${(repairPlan.totalEstimatedCost || 0).toLocaleString()}</h3>
//                                         <p className="text-muted">Total Estimated Cost</p>
//                                     </Col>
//                                     <Col md={6}>
//                                         <h6>Generated On:</h6>
//                                         <p>{new Date(repairPlan.createdAt).toLocaleString()}</p>
//                                     </Col>
//                                 </Row>
//                                 <Alert variant="info">
//                                     This plan aggregates all findings. High severity issues (Blade Damage + Cracks) have escalated the priority.
//                                 </Alert>
//                             </Card.Body>
//                         </Card>
//                     ) : (
//                         <Card className="text-center p-5">
//                             <Card.Body>
//                                 <h4>No Repair Plan Generated</h4>
//                                 <p className="text-muted">
//                                     A repair plan summarizes findings and calculates total costs.
//                                 </p>
//                                 {(user?.role === 'ADMIN' || user?.role === 'ENGINEER') ? (
//                                     <Button size="lg" variant="primary" onClick={handleGeneratePlan}>
//                                         Generate Repair Plan
//                                     </Button>
//                                 ) : (
//                                     <Alert variant="warning">Waiting for an Engineer to generate the plan.</Alert>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     )}
//                 </Tab>
//             </Tabs>

//             {/* 4. Render the Modal at the bottom */}
//             {id && (
//                 <AddFindingModal
//                     show={showAddFinding}
//                     handleClose={() => setShowAddFinding(false)}
//                     inspectionId={id}
//                     onSuccess={loadData} // Reloads the page data after success
//                 />
//             )}
//         </Container>
//     );
// };

// export default InspectionDetails;



//////////////////////////////////


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Table, Badge, Container, Spinner, Tab, Tabs, Alert } from 'react-bootstrap';
import { inspectionApi, repairPlanApi, findingApi } from '../api/rest';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';
import AddFindingModal from '../components/addFindingModal';

// --- Types ---
interface Finding {
    id: string;
    category: string;
    severity: number;
    estimatedCost?: number; // Marked as optional
    notes: string;
    status: string;
}

interface RepairPlan {
    id: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    totalEstimatedCost?: number; // Marked as optional
    status: string;
    createdAt: string;
}

interface Inspection {
    id: string;
    date: string;
    dataSource: string;
    rawPackageUrl?: string;
    status: string;
    turbine: {
        id: string;
        name: string;
        manufacturer: string;
        mwRating: number;
        lat: number;
        lng: number;
    };
    inspector: {
        id: string;
        name: string;
    };
    findings?: Finding[];
}

const InspectionDetails: React.FC = () => {
    // ... (state and hooks remain the same)
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [inspection, setInspection] = useState<Inspection | null>(null);
    const [finding, setFinding] = useState<Finding[]>([]);
    const [repairPlan, setRepairPlan] = useState<RepairPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('findings');
    const [showAddFinding, setShowAddFinding] = useState(false);


    // ... (useEffect and loadData remain the same)
    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (!id) return;

            // 0. Fetch Inspection Details
            const inspData = await inspectionApi.getById(id);
            setInspection(inspData.data.data);

            // 2. Fetch Findings Details
            const inspRes = await findingApi.getFindingsById(id);
            setFinding(inspRes.data.data);

            console.log('Findings Data:', inspRes.data.data);

            // 3. Fetch Repair Plan
            try {
                const planRes = await repairPlanApi.getByInspectionId(id);
                if (planRes.data && planRes.data.data) {
                    setRepairPlan(planRes.data.data);
                }
            } catch (err) {
                setRepairPlan(null);
            }

        } catch (error) {
            toast.error('Failed to load inspection details');
            navigate('/inspections');
        } finally {
            setLoading(false);
        }
    };


    // ... (handleGeneratePlan remains the same)
    const handleGeneratePlan = async () => {
        if (!id) return;
        try {
            await repairPlanApi.generateRepairPlan(id);
            toast.success('Repair Plan generated successfully!');
            loadData();
            setActiveTab('repair-plan');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to generate repair plan');
        }
    };

    // NEW: Handle Generate Report
    const handleGenerateReport = async () => {
        if (!repairPlan) return;
        // In a real app, this would likely call an API to get a PDF URL or trigger a download
        // For now, we'll just show a success message or log it.
        try {
            // Example: await repairPlanApi.generateReport(repairPlan.id);
            toast.info("Report generation started...");
            // You might want to redirect to a download link if the API returns one
            // window.open(reportUrl, '_blank');
        } catch (error) {
            toast.error("Failed to generate report.");
        }
    };


    if (loading) {
        // ... (loading spinner)
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!inspection) return <Alert variant="danger">Inspection not found</Alert>;

    return (
        <Container className="mt-4">
            {/* Header Section ... (remains the same) */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>{inspection.turbine.name} Inspection</h1>
                    <span className="text-muted">
                        Date: {new Date(inspection.date).toLocaleDateString()} |
                        Inspector: <strong>{inspection.inspector?.name || 'N/A'}</strong>
                    </span>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={() => navigate('/inspections')}>Back to List</Button>
                </div>
            </div>


            {/* Overview Card ... (remains the same) */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <strong>Data Source:</strong> <Badge bg="info">{inspection.dataSource}</Badge>
                        </Col>
                        <Col md={3}>
                            <strong>Manufacturer:</strong> {inspection.turbine.manufacturer}
                        </Col>
                        <Col md={3}>
                            <strong>Location:</strong> {inspection.turbine.lat}, {inspection.turbine.lng}
                        </Col>
                        <Col md={3}>
                            <strong>Raw Data:</strong>
                            {inspection.rawPackageUrl ? (
                                <a href={inspection.rawPackageUrl} target="_blank" rel="noreferrer" className="ms-1">Open Link</a>
                            ) : <span className="text-muted ms-1">None</span>}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>


            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'findings')}
                className="mb-3"
            >
                {/* --- FINDINGS TAB --- (remains the same) */}
                <Tab eventKey="findings" title={`Findings (${finding?.length || 0})`}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                            <h5 className="mb-0">Detected Issues</h5>
                            {user?.role !== 'VIEWER' && (
                                <Button size="sm" variant="outline-success"
                                    onClick={() => setShowAddFinding(true)}
                                >
                                    + Add Finding
                                </Button>
                            )}
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table striped hover responsive className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Category</th>
                                        <th>Severity (1-5)</th>
                                        <th>Est. Cost</th>
                                        <th>Notes</th>
                                        <th>Created By </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finding && finding.length > 0 ? (
                                        finding.map((finding: any) => (
                                            <tr key={finding.id}>
                                                <td>{finding.category}</td>
                                                <td>
                                                    <Badge bg={
                                                        finding.severity >= 4 ? 'danger' :
                                                            finding.severity === 3 ? 'warning' : 'success'
                                                    }>
                                                        {finding.severity}
                                                    </Badge>
                                                </td>
                                                {/* FIX: Safe check for null cost */}
                                                <td>${(finding.estimatedCost || 0).toLocaleString()}</td>
                                                <td>{finding.notes}</td>
                                                <td>{finding?.creator.name}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4 text-muted">
                                                No findings recorded for this inspection yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* --- REPAIR PLAN TAB --- */}
                <Tab eventKey="repair-plan" title="Repair Plan">
                    {repairPlan ? (
                        <Card border={repairPlan.priority === 'HIGH' ? 'danger' : 'success'}>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Current Plan</h5>
                                <div className="d-flex gap-2 align-items-center">
                                    <Badge bg={repairPlan.priority === 'HIGH' ? 'danger' : 'success'}>
                                        {repairPlan.priority} PRIORITY
                                    </Badge>

                                    <Button size='sm' variant='outline-primary' onClick={handleGeneratePlan}>Re-generate repair plan</Button>
                                    
                                    {/* NEW: Generate Report Button */}
                                    <Button
                                        variant="outline-dark"
                                        size="sm"
                                        onClick={handleGenerateReport}
                                    >
                                        Download Report
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <h3>${(repairPlan.totalEstimatedCost || 0).toLocaleString()}</h3>
                                        <p className="text-muted">Total Estimated Cost</p>
                                    </Col>
                                    <Col md={6}>
                                        <h6>Generated On:</h6>
                                        <p>{new Date(repairPlan.createdAt).toLocaleString()}</p>
                                    </Col>
                                </Row>
                                <Alert variant="info">
                                    This plan aggregates all findings. High severity issues (Blade Damage + Cracks) have escalated the priority.
                                </Alert>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="text-center p-5">
                            {/* ... (remains the same) */}
                            <Card.Body>
                                <h4>No Repair Plan Generated</h4>
                                <p className="text-muted">
                                    A repair plan summarizes findings and calculates total costs.
                                </p>
                                {(user?.role === 'ADMIN' || user?.role === 'ENGINEER') ? (
                                    <Button size="lg" variant="primary" onClick={handleGeneratePlan}>
                                        Generate Repair Plan
                                    </Button>
                                ) : (
                                    <Alert variant="warning">Waiting for an Engineer to generate the plan.</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Tab>
            </Tabs>

            {/* ... (AddFindingModal remains the same) */}
            {id && (
                <AddFindingModal
                    show={showAddFinding}
                    handleClose={() => setShowAddFinding(false)}
                    inspectionId={id}
                    onSuccess={loadData} // Reloads the page data after success
                />
            )}
        </Container>
    );
};

export default InspectionDetails;