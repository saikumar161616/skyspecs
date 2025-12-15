// import React, { useEffect, useState } from 'react';
// import { Table, Button, Modal, Form } from 'react-bootstrap';
// import { turbineApi } from '../api/rest';
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/authContext';

// interface Turbine {
//   id: string;
//   name: string;
//   manufacturer: string;
//   mwRating: number;
//   lat: number;
//   lng: number;
//   status: string;
// }

// const Turbines: React.FC = () => {
//   const [turbines, setTurbines] = useState<Turbine[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newTurbine, setNewTurbine] = useState({ name: '', manufacturer: '', mwRating: 0, lat: 0, lng: 0, status: '' });
//   const { user } = useAuth();

//   const fetchTurbines = async () => {
//     try {
//       const res = await turbineApi.getAll(); // Route: router.get('/', ...) mounted at /api/turbine
//       setTurbines(res.data.data);
//     } catch (error) {
//       toast.error('Failed to load turbines');
//     }
//   };

//   useEffect(() => {
//     fetchTurbines();
//   }, []);

//   const handleCreate = async () => {
//     try {
//       await turbineApi.create(newTurbine);
//       toast.success('Turbine created successfully');
//       setShowModal(false);
//       fetchTurbines();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to create turbine');
//     }
//   };

//   const handleEdit = (turbine: Turbine) => {
//     setNewTurbine(turbine);
//     setShowModal(true);
//   }


//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1>Turbines</h1>
//         {user?.role !== 'VIEWER' && (
//           <Button onClick={() => setShowModal(true)}>+ Add Turbine</Button>
//         )}
//       </div>

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Manufacturer</th>
//             <th>Capacity (MW)</th>
//             <th>Location (Lat, Lng)</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {turbines.map((t) => (
//             <tr key={t.id}>
//               <td>{t.name}</td>
//               <td>{t.manufacturer}</td>
//               <td>{t.mwRating}</td>
//               <td>{t.lat}, {t.lng}</td>
//               <td>{t.status}</td>
//               {user?.role == 'ADMIN' && (
//                 <td>
//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     onClick={() => handleEdit(t)}
//                   >
//                     Edit
//                   </Button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton><Modal.Title>Add Turbine</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control onChange={e => setNewTurbine({ ...newTurbine, name: e.target.value })} /></Form.Group>
//             <Form.Group className="mb-2"><Form.Label>Manufacturer</Form.Label><Form.Control onChange={e => setNewTurbine({ ...newTurbine, manufacturer: e.target.value })} /></Form.Group>
//             <Form.Group className="mb-2"><Form.Label>MW Rating</Form.Label><Form.Control type="number" onChange={e => setNewTurbine({ ...newTurbine, mwRating: parseFloat(e.target.value) })} /></Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Status</Form.Label>
//               <Form.Select
//                 value={newTurbine.status}
//                 onChange={e => setNewTurbine({ ...newTurbine, status: e.target.value })}
//               >
//                 <option value="">Select Status</option>
//                 <option value="ACTIVE">ACTIVE</option>
//                 <option value="INACTIVE">INACTIVE</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-2"><Form.Label>Latitude</Form.Label><Form.Control type="number" onChange={e => setNewTurbine({ ...newTurbine, lat: parseFloat(e.target.value) })} /></Form.Group>
//             <Form.Group className="mb-2"><Form.Label>Longitude</Form.Label><Form.Control type="number" onChange={e => setNewTurbine({ ...newTurbine, lng: parseFloat(e.target.value) })} /></Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="primary" onClick={handleCreate}>Save</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Turbines;


import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { turbineApi } from '../api/rest';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

interface Turbine {
  id?: string;
  name: string;
  manufacturer: string;
  mwRating: number;
  lat: number;
  lng: number;
  status: string;
}

const Turbines: React.FC = () => {
  const [turbines, setTurbines] = useState<Turbine[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Initial state for the form
  const [newTurbine, setNewTurbine] = useState<Turbine>({
    name: '',
    manufacturer: '',
    mwRating: 0,
    lat: 0,
    lng: 0,
    status: ''
  });

  const { user } = useAuth();

  const fetchTurbines = async () => {
    try {
      const res = await turbineApi.getAll();
      setTurbines(res.data.data);
    } catch (error) {
      toast.error('Failed to load turbines');
    }
  };

  const validateForm = () => {
    if (newTurbine.name.length < 3) {
      return "Name must be at least 3 characters long.";
    }
    if (!newTurbine.manufacturer) {
      return "Manufacturer is required.";
    }
    if (newTurbine.mwRating <= 0) {
      return "MW Rating must be a positive number.";
    }
    if (newTurbine.lat < -90 || newTurbine.lat > 90) {
      return "Latitude must be between -90 and 90.";
    }
    if (newTurbine.lng < -180 || newTurbine.lng > 180) {
      return "Longitude must be between -180 and 180.";
    }
    if (!newTurbine.status) {
      return "Status is required.";
    }
    return null;
  };

  useEffect(() => {
    fetchTurbines();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setNewTurbine({ name: '', manufacturer: '', mwRating: 0, lat: 0, lng: 0, status: '' });
    setFormError('');
  };

  const handleEdit = (turbine: Turbine) => {
    setEditingId(turbine.id || null);
    setNewTurbine({
      name: turbine.name,
      manufacturer: turbine.manufacturer,
      mwRating: turbine.mwRating,
      lat: turbine.lat,
      lng: turbine.lng,
      status: turbine.status || 'ACTIVE'
    });
    setShowModal(true);
    setFormError('');
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }
    try {
      if (editingId) {
        // Update existing turbine
        await turbineApi.update(editingId, newTurbine);
        toast.success('Turbine updated successfully');
      } else {
        // Create new turbine
        await turbineApi.create(newTurbine);
        toast.success('Turbine created successfully');
      }
      handleClose();
      fetchTurbines();
    } catch (error: any) {
      const msg = error.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} turbine`;
      setFormError(msg);
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Turbines</h1>
        {user?.role === 'ADMIN' && (
          <Button onClick={() => setShowModal(true)}>+ Add Turbine</Button>
        )}
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Manufacturer</th>
            <th>Capacity (MW)</th>
            <th>Location (Lat, Lng)</th>
            <th>Status</th>
            {user?.role === 'ADMIN' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {turbines.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.manufacturer}</td>
              <td>{t.mwRating}</td>
              <td>{t.lat}, {t.lng}</td>
              <td>{t.status}</td>
              {user?.role === 'ADMIN' && (
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
          <Modal.Title>{editingId ? 'Edit Turbine' : 'Add Turbine'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newTurbine.name}
                onChange={e => setNewTurbine({ ...newTurbine, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                value={newTurbine.manufacturer}
                onChange={e => setNewTurbine({ ...newTurbine, manufacturer: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>MW Rating</Form.Label>
              <Form.Control
                type="number"
                value={newTurbine.mwRating}
                onChange={e => setNewTurbine({ ...newTurbine, mwRating: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newTurbine.status}
                onChange={e => setNewTurbine({ ...newTurbine, status: e.target.value })}
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                value={newTurbine.lat}
                onChange={e => setNewTurbine({ ...newTurbine, lat: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                value={newTurbine.lng}
                onChange={e => setNewTurbine({ ...newTurbine, lng: parseFloat(e.target.value) })}
              />
            </Form.Group>
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

export default Turbines;