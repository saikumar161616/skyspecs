import client from './client';


// --- Auth ---
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    client.post('/user/login', credentials),

  register: (userData: any) =>
    client.post('/user', userData),

  getAllUsers: () => {
    return client.get('/user');
  },

  getUsersByRole: (role: string) => {
    return client.get(`/user/role/${role}`);
  },

  updateUser: (id: string, data: any) => {
    return client.patch(`/user/${id}`, data);
  }

};




// --- Turbines ---
export const turbineApi = {
  getAll: () => client.get('/turbine'),
  create: (data: { name: string; manufacturer?: string; mwRating?: number; lat?: number; lng?: number }) => client.post('/turbine', data),
  update: (id: string, data: any) => client.patch(`/turbine/${id}`, data),
};

// --- Inspections ---
export const inspectionApi = {
  getAll: (filters?: { turbineId?: string; date?: string; startDate?: string, endDate?:string, dataSource?: string }) => { const params = new URLSearchParams(filters as any).toString(); return client.get(`/inspection?${params}`); },
  getById: (id: string) => client.get(`/inspection/${id}`),
  create: (data: any) => client.post('/inspection', data),
  update: (id: string, data: any) => client.patch(`/inspection/${id}`, data),
};

// --- Findings ---
export const findingApi = {
  create: (data: any, inspectionId: any) => client.post(`/finding/${inspectionId}`, data),
  update: (id: string, data: any) => client.patch(`/finding/${id}`, data),
  getFindingsById: (inspectionId: any, search: any = null) => client.get(`/finding/${inspectionId}?search=${search}`), // Usually filtered by inspectionId in real apps
};

// --- Repair Plans ---
export const repairPlanApi = {
  getByInspectionId: (inspectionId: string) => client.get(`/repair-plan/${inspectionId}?fetch=${true}`),
  create: (data: { inspectionId: string }) => client.post('/repair-plan', data),
  generateRepairPlan: (inspectionId: string) => client.get(`/repair-plan/${inspectionId}`),
};


export const logApi = {
  getByInspectionId: (id: string) => client.get(`/inspection-log/${id}`),
};