import React, { useState,useEffect } from 'react';
import {
  Users, FileText, Activity, Clock, Search, Filter, Download,
  Shield, AlertCircle, CheckCircle, X
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { HttpAgent } from '@dfinity/agent';

import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../../declarations/icp-health-backend';
import { healthRecords, dataRequests } from '../../utils/mockData';
import './provider.css';
const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const ProviderDashboard = () => {



  const pendingRequests = dataRequests.filter(r => r.status === 'pending').length;

  const [modal, setModal] = useState(null); // 'download', 'request', 'search', 'filter'

  const handleClose = () => setModal(null);

  const [uploads, setUploads] = useState([]);
  useEffect(() => {
  const fetchUploads = async () => {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    
    const agent = new HttpAgent({ identity });

    if (window.location.hostname === "localhost") {
      await agent.fetchRootKey(); 
    }

    const actor = createActor(canisterId, { agent });
    const docs = await actor.get_uploads_for_doctor();
    console.log(docs);
    setUploads(docs);
  };

  fetchUploads();
}, []);


 const handleDownload = (patient) => {
  const matchedUpload = uploads.find((u) => u.hash === patient.hash);
  if (!matchedUpload || !matchedUpload.file_content || !matchedUpload.file_name) {
    alert("No file found");
    return;
  }

  const byteArray = Uint8Array.from(atob(matchedUpload.file_content), c => c.charCodeAt(0));
  const blob = new Blob([byteArray]);

  // Format timestamp as YYYY-MM-DD_HH-MM
  const timestamp = new Date(Number(matchedUpload.timestamp));
  const formattedTimestamp = timestamp.toISOString().replace(/[:T]/g, '-').split('.')[0]; // e.g., "2025-07-02-21-00-00"

  // Construct download filename with timestamp
  const extension = matchedUpload.file_name.includes('.') ? '' : '.txt';
  const baseName = matchedUpload.file_name.replace(/\.[^/.]+$/, ''); 
  const finalName = `${baseName}_${formattedTimestamp}${extension}`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = finalName;
  link.click();
  URL.revokeObjectURL(link.href);
};



  const ModalWrapper = ({ children }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={handleClose}><X /></button>
        {children}
      </div>
    </div>
  );

  const patientData = uploads.map((doc, index) => ({
  id: index,
  name: doc.patient_name || 'Unknown',
  lastVisit: Number(doc.timestamp || Date.now()),
  dataShared: 1,
  status: 'Active'
}));
 const patientNames = new Set(uploads.map(doc => doc.patient_name || 'Unknown'));
const patients = patientNames.size;
const dataAccess = patientData.length;

  return (
    <div className="space-y-6 provider-dashboard">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Healthcare Provider Portal</h2>
        <p className="opacity-90">Access patient data securely with proper consent and compensation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Patients" value={patients} icon={Users} color="green" />
        <StatCard title="Data Access Granted" value={dataAccess} icon={FileText} color="blue" />
        <StatCard title="Pending Requests" value={pendingRequests} icon={Clock} color="yellow" />
        <StatCard title="Research Collaborations" value={5} icon={Activity} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient Data Access</h3>
            <div className="flex space-x-2">
              <button className="icon-btn" onClick={() => setModal('search')}><Search /></button>
              <button className="icon-btn" onClick={() => setModal('filter')}><Filter /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Last Visit</th>
                  <th className="pb-3" style={{ minWidth: '100px', maxWidth: '250px' }}>Data Shared</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {patientData.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{patient.name}</span>
                      </div>
                    </td>
                   <td className="py-4 text-gray-600">
                      {new Date(patient.lastVisit * 1000).toLocaleString()}
                    </td>



                    <td className="py-4"><span className="badge blue">{patient.dataShared} records</span></td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        {patient.status === 'Active' ? <CheckCircle className="icon green" /> : <Clock className="icon yellow" />}
                        <span className={`text-sm ${patient.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{patient.status}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <button className="icon-btn" onClick={() => handleDownload(patient)} title="Download file">
                        <Download />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Requests */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Requests</h3>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium" onClick={() => setModal('request')}>New Request</button>
          </div>

          {dataRequests.map((req) => (
            <div key={req.id} className="border border-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{req.dataType}</h4>
                <span className={`badge ${req.status === 'pending' ? 'yellow' : 'green'}`}>{req.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{req.requesterName} - {req.purpose}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{req.status === 'pending' ? 'Requested' : 'Approved'} on {req.date}</span>
                <span className="text-green-600 font-medium">${req.compensation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      

      {/* Modals */}
      {modal === 'download' && (
        <ModalWrapper>
          <h2 className="text-lg font-bold mb-2">Download Patient Records</h2>
          <ul className="text-sm list-disc pl-4">
            {healthRecords.map((r) => (
              <li key={r.id}>
                {r.title} - {r.provider} - ${r.value.toFixed(2)}
              </li>
            ))}
          </ul>
        </ModalWrapper>
      )}

      {modal === 'request' && (
        <ModalWrapper>
          <h2 className="text-lg font-bold mb-2">New Data Request</h2>
          <form className="space-y-3">
            <input type="text" placeholder="Data Type" className="input" />
            <input type="text" placeholder="Purpose" className="input" />
            <input type="number" placeholder="Compensation $" className="input" />
            <button type="submit" className="submit-btn">Send Request</button>
          </form>
        </ModalWrapper>
      )}

      {modal === 'search' && (
        <ModalWrapper>
          <h2 className="text-lg font-bold mb-2">Search Patients</h2>
          <input type="text" placeholder="Enter name or ID" className="input" />
          <p className="text-sm text-gray-600 mt-2">Search functionality is under development.</p>
        </ModalWrapper>
      )}

      {modal === 'filter' && (
        <ModalWrapper>
          <h2 className="text-lg font-bold mb-2">Filter By Status</h2>
          <select className="input">
            <option value="">-- Choose --</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
          <p className="text-sm text-gray-600 mt-2">Filtering is mock-only for now.</p>
        </ModalWrapper>
      )}
    </div>
  );
};

export default ProviderDashboard;
