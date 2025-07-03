// User object
export const exampleUser = {
  id: '',
  name: '',
  email: '',
  role: 'patient', // or 'provider' or 'researcher'
  avatar: '',      // optional
};

// Health record example
export const exampleHealthRecord = {
  id: '',
  patientId: '',
  type: 'lab', // or 'imaging', 'prescription', 'vitals', 'visit'
  title: '',
  date: '',
  status: 'active', // or 'shared', 'monetized'
  value: 0,
  description: '',
  provider: '',     // optional
};

// Data request example
export const exampleDataRequest = {
  id: '',
  requesterName: '',
  requesterType: 'provider', // or 'researcher'
  dataType: '',
  purpose: '',
  compensation: 0,
  status: 'pending', // or 'approved', 'rejected'
  date: '',
};

// Transaction example
export const exampleTransaction = {
  id: '',
  type: 'earning', // or 'payment'
  amount: 0,
  description: '',
  date: '',
  status: 'completed', // or 'pending'
};

// Research study example
export const exampleResearchStudy = {
  id: '',
  title: '',
  organization: '',
  participants: 0,
  compensation: 0,
  duration: '',
  status: 'recruiting', // or 'active', 'completed'
  description: '',
};
