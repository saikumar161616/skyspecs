// import React, { useEffect, useState } from 'react'

// type Turbine = { id: string; name: string }

// export const App: React.FC = () => {
//   const [turbines, setTurbines] = useState<Turbine[]>([])
//   const [name, setName] = useState('')

//   useEffect(() => {
//     fetch(import.meta.env.VITE_API_BASE + '/api/turbines')
//       .then(r => r.json())
//       .then(setTurbines)
//       .catch(() => setTurbines([]))
//   }, [])

//   const create = async () => {
//     if (!name) return
//     const r = await fetch(import.meta.env.VITE_API_BASE + '/api/turbines', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name })
//     })
//     const t = await r.json()
//     setTurbines(prev => [t, ...prev])
//     setName('')
//   }

//   return (
//     <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
//       <h1>TurbineOps Lite</h1>
//       <p>Starter UI – list/create turbines via REST. Extend with Inspections, Findings, and Repair Plans.</p>

//       <div style={{ marginBottom: 16 }}>
//         <input placeholder="New turbine name" value={name} onChange={e => setName(e.target.value)} />
//         <button onClick={create} style={{ marginLeft: 8 }}>Create</button>
//       </div>

//       <ul>
//         {turbines.map(t => <li key={t.id}>{t.name}</li>)}
//       </ul>
//     </div>
//   )
// }


//////////////////////////////////////////////////////////////


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/authContext';
import Layout from '../../src/components/layout';
import Login from '../pages/login';

import Turbines from '../pages/turbines';
import Inspections from '../pages/inspection';
import Users from '../pages/users';
import InspectionForm from '../pages/inspectionForm';
import InspectionDetails from './inspectionDetails';

// import InspectionDetails from './pages/InspectionDetails';

// Protect routes that require login
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />

        <Route path="users" element={
          <ProtectedRoute><Users /></ProtectedRoute>
        } />

        <Route path="turbines" element={
          <ProtectedRoute><Turbines /></ProtectedRoute>
        } />

        <Route path="inspections" element={
          <ProtectedRoute><Inspections /></ProtectedRoute>
        } />

         {/* Create New Inspection (General or Specific via ?turbineId=) */}
        <Route path="inspections/new" element={
          <ProtectedRoute><InspectionForm /></ProtectedRoute>
        } />

        {/* Edit Existing Inspection */}
        <Route path="inspections/:id" element={
          <ProtectedRoute><InspectionDetails /></ProtectedRoute>
        } />

        <Route index element={<Navigate to="/turbines" />} />
      </Route>
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
