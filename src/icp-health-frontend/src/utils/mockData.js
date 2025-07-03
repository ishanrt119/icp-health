export const currentUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  role: 'patient'
};

export const users = [
  currentUser,
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'dr.chen@hospital.com',
    role: 'provider'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'e.rodriguez@research.edu',
    role: 'researcher'
  }
];

export const healthRecords = [
  {
    id: '1',
    patientId: '1',
    type: 'lab',
    title: 'Blood Panel - Complete',
    date: '2024-01-15',
    status: 'monetized',
    value: 45.00,
    description: 'Comprehensive metabolic panel and CBC',
    provider: 'City Medical Center'
  },
  {
    id: '2',
    patientId: '1',
    type: 'imaging',
    title: 'Chest X-Ray',
    date: '2024-01-10',
    status: 'shared',
    value: 125.00,
    description: 'Routine chest imaging for annual physical',
    provider: 'Radiology Associates'
  },
  {
    id: '3',
    patientId: '1',
    type: 'prescription',
    title: 'Medication History',
    date: '2024-01-08',
    status: 'active',
    value: 30.00,
    description: 'Current prescriptions and medication adherence',
    provider: 'Primary Care Clinic'
  },
  {
    id: '4',
    patientId: '1',
    type: 'vitals',
    title: 'Vital Signs Monitoring',
    date: '2024-01-20',
    status: 'active',
    value: 20.00,
    description: 'Blood pressure, heart rate, temperature readings',
    provider: 'Wellness Center'
  }
];

export const dataRequests = [
  {
    id: '1',
    requesterName: 'Stanford Medical Research',
    requesterType: 'researcher',
    dataType: 'Cardiovascular Data',
    purpose: 'Heart disease prevention research',
    compensation: 150.00,
    status: 'pending',
    date: '2024-01-18'
  },
  {
    id: '2',
    requesterName: 'Dr. Sarah Wilson',
    requesterType: 'provider',
    dataType: 'Lab Results',
    purpose: 'Treatment optimization',
    compensation: 75.00,
    status: 'approved',
    date: '2024-01-16'
  },
  {
    id: '3',
    requesterName: 'Diabetes Research Institute',
    requesterType: 'researcher',
    dataType: 'Glucose Monitoring',
    purpose: 'Diabetes management study',
    compensation: 200.00,
    status: 'pending',
    date: '2024-01-19'
  }
];

export const transactions = [
  {
    id: '1',
    type: 'earning',
    amount: 150.00,
    description: 'Data sharing - Stanford Research',
    date: '2024-01-17',
    status: 'completed'
  },
  {
    id: '2',
    type: 'earning',
    amount: 75.00,
    description: 'Provider data access - Dr. Wilson',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '3',
    type: 'earning',
    amount: 45.00,
    description: 'Lab data monetization',
    date: '2024-01-12',
    status: 'pending'
  }
];

export const researchStudies = [
  {
    id: '1',
    title: 'Cardiovascular Health Study',
    organization: 'Stanford Medical Center',
    participants: 1250,
    compensation: 500.00,
    duration: '6 months',
    status: 'recruiting',
    description: 'Longitudinal study on heart disease prevention through lifestyle interventions.'
  },
  {
    id: '2',
    title: 'Diabetes Management Research',
    organization: 'Mayo Clinic',
    participants: 800,
    compensation: 350.00,
    duration: '4 months',
    status: 'active',
    description: 'Investigating new approaches to diabetes management and glucose monitoring.'
  },
  {
    id: '3',
    title: 'Mental Health & Wellness',
    organization: 'Johns Hopkins',
    participants: 2000,
    compensation: 250.00,
    duration: '3 months',
    status: 'recruiting',
    description: 'Understanding the relationship between physical health data and mental wellness.'
  }
];

// Add this to the bottom or appropriate place in mockData.js

export const doctors = [
  {
    name: "Dr. Ishan Toraskar",
    specialty: "Cardiology"
  },
  {
    name: "Dr. Aarti Sharma",
    specialty: "Dermatology"
  },
  {
    name: "Dr. Nikhil Desai",
    specialty: "Neurology"
  },
  // Add more mock entries as needed
];

export const researcherDataRequests = [
  {
    id: 'req-001',
    requesterName: 'Dr. Emily Rodriguez',
    requesterType: 'researcher',
    dataSourcesRequested: ['Blood Panel - Complete', 'Chest X-Ray'],
    dataSourcesReceived: ['Chest X-Ray'],
    status: 'partially completed',
    compensation: 150,
    date: '2025-07-01'
  },
  {
    id: 'req-002',
    requesterName: 'Dr. Emily Rodriguez',
    requesterType: 'researcher',
    dataSourcesRequested: ['Medication History', 'Vital Signs Monitoring'],
    dataSourcesReceived: [],
    status: 'incomplete',
    compensation: 200,
    date: '2025-06-28'
  },
  {
    id: 'req-003',
    requesterName: 'Dr. Emily Rodriguez',
    requesterType: 'researcher',
    dataSourcesRequested: ['Vital Signs Monitoring'],
    dataSourcesReceived: ['Vital Signs Monitoring'],
    status: 'completed',
    compensation: 75,
    date: '2025-06-25'
  }
];

