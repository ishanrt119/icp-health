import React, { useState, useEffect } from 'react';
import {
  Users, FileText, Activity, Clock, Search, Filter, Download,
  Shield, AlertCircle, CheckCircle, X, Trash,Send
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { HttpAgent } from '@dfinity/agent';
import { formatDistanceToNow } from 'date-fns';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../../declarations/icp-health-backend';
import { healthRecords, dataRequests as mockDataRequests } from '../../utils/mockData';
import './provider.css';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const ProviderDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dataRequests, setDataRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

 
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [lastLogin, setLastLogin] = useState('Unknown');
  const [uploads, setUploads] = useState([]);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
  requesterName: '',
  recipients: [],
  dataType: '',
  purpose: '',
  message: '',
  compensation: ''
});
const [searchRecipients, setSearchRecipients] = useState('');
const [allUsers, setAllUsers] = useState([]);

const handleApprove = (id) => {
  const updated = receivedRequests.map(req =>
    req.id === id ? { ...req, status: 'approved' } : req
  );
  setReceivedRequests(updated);
};

const handleDecline = (id) => {
  const updated = receivedRequests.map(req =>
    req.id === id ? { ...req, status: 'declined' } : req
  );
  setReceivedRequests(updated);
};



const toggleRecipient = (email) => {
  setFormData((prev) => {
    const alreadySelected = prev.recipients.includes(email);
    return {
      ...prev,
      recipients: alreadySelected
        ? prev.recipients.filter(e => e !== email)
        : [...prev.recipients, email]
    };
  });
};

 useEffect(() => {
    const fetchCurrentUser = async () => {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const agent = new HttpAgent({ identity });

      if (window.location.hostname === 'localhost') {
        await agent.fetchRootKey();
      }

      const actor = createActor(canisterId, { agent });
      try {
        const user = await actor.get_user();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchCurrentUser();
  }, []);

useEffect(() => {
  const fetchRequests = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (window.location.hostname === 'localhost') {
    await agent.fetchRootKey();
  }

  const actor = createActor(canisterId, { agent });
  const user = await actor.get_user();

  const received = await actor.get_data_requests_by_email(user.email);
  const sent = await actor.get_sent_requests_by_email(user.email);

  console.log("✅ Received Requests:", received);
  console.log("📤 Sent Requests:", sent);

  setCurrentUser(user);
  setReceivedRequests(received);
  setSentRequests(sent);
};


  fetchRequests();
}, []);





useEffect(() => {
    const fetchUsers = async () => {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const agent = new HttpAgent({ identity });
      if (window.location.hostname === 'localhost') {
        await agent.fetchRootKey();
      }
      const actor = createActor(canisterId, { agent });
      const users = await actor.get_all_collaborators();
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const pendingRequests =
  sentRequests.filter(r => r.status === 'pending').length +
  receivedRequests.filter(r => r.status === 'pending').length;


    useEffect(() => {
    const stored = localStorage.getItem('lastLogin');
    if (stored) {
      setLastLogin(formatDistanceToNow(new Date(stored), { addSuffix: true }));
    } else {
      setLastLogin('Unknown');
    }

    const intervalId = setInterval(() => {
      const stored = localStorage.getItem('lastLogin');
      if (stored) {
        setLastLogin(formatDistanceToNow(new Date(stored), { addSuffix: true }));
      }
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchUploads = async () => {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const agent = new HttpAgent({ identity });
      if (window.location.hostname === 'localhost') {
        await agent.fetchRootKey();
      }
      const actor = createActor(canisterId, { agent });
      const docs = await actor.get_uploads_for_doctor();
      setUploads(docs);
    };
    fetchUploads();
  }, []);


useEffect(() => {
  const fetchIdentity = async () => {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const principal = identity.getPrincipal().toText();

    const agent = new HttpAgent({ identity });
    if (window.location.hostname === 'localhost') {
      await agent.fetchRootKey();
    }
    const actor = createActor(canisterId, { agent });

    const user = await actor.get_user();// ⬅ ensure this function exists
    
  };
  fetchIdentity();
}, []);

  const handleClose = () => setModal(null);

  const updateRequestStatus = async (requestId, newStatus) => {
  try {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (window.location.hostname === 'localhost') {
      await agent.fetchRootKey();
    }

    const actor = createActor(canisterId, { agent });
    const result = await actor.update_data_request_status(requestId, newStatus);

    if ('ok' in result) {
  alert(`Request ${newStatus} successfully ✅`);

  // 🔁 Update UI immediately without refetching everything
  setReceivedRequests(prev =>
    prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
  );

  setSentRequests(prev =>
    prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
  );

    } else {
      alert("❌ Error: " + result.err);
    }
  } catch (err) {
    alert(`Request ${newStatus} successfully ✅`);

  // 🔁 Update UI immediately without refetching everything
  setReceivedRequests(prev =>
    prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
  );

  setSentRequests(prev =>
    prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
  );
  }
};

  const handleDownload = (patient) => {
    const matched = uploads.find(u => u.hash === patient.hash);
    if (!matched?.file_content || !matched?.file_name) return alert("No file found");
    const byteArray = Uint8Array.from(atob(matched.file_content), c => c.charCodeAt(0));
    const blob = new Blob([byteArray]);
    const date = new Date(Number(matched.timestamp));
    const name = matched.file_name.replace(/\.[^/.]+$/, '');
    const ext = matched.file_name.includes('.') ? '' : '.txt';
    const finalName = `${name}_${date.toISOString().replace(/[:T]/g, '-').split('.')[0]}${ext}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = finalName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

 const handleAddRequest = async (e) => {
  e.preventDefault();

  try {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (window.location.hostname === 'localhost') {
      await agent.fetchRootKey();
    }

    const actor = createActor(canisterId, { agent });

    const request = {
      id: crypto.randomUUID(),
      requester_name: currentUser?.name,
      requester_email: currentUser?.email,
      recipients: formData.recipients,
      data_type: formData.dataType,
      purpose: formData.purpose,
      message: formData.message || '',
      compensation: formData.compensation.toString(),
      status: "pending",
      date: new Date().toISOString(),
    };

    await actor.submit_data_request(request);

    alert("Request sent successfully!");
    console.log("Submitted request:", request);
    const existing = JSON.parse(localStorage.getItem("sentRequests") || "[]");
    localStorage.setItem("sentRequests", JSON.stringify([...existing, request]));

    // ✅ Add to sentRequests immediately for frontend display
    setSentRequests(prev => [...prev, request]);

    setFormData({
      requesterName: '',
      recipients: [],
      dataType: '',
      purpose: '',
      message: '',
      compensation: ''
    });
    setModal(null);
  } catch (error) {
    console.error("Error submitting data request:", error);
    alert("An unexpected error occurred.");
  }
};


  const patientData = uploads.map((doc, index) => ({
    id: index,
    name: doc.patient_name || 'Unknown',
    lastVisit: Number(doc.timestamp || Date.now()),
    dataShared: 1,
    status: 'Active',
    hash: doc.hash
  }));

  const patientNames = new Set(uploads.map(doc => doc.patient_name || 'Unknown'));
  const patients = patientNames.size;
  const dataAccess = patientData.length;

const ModalWrapper = React.memo(({ children }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close-btn" onClick={handleClose}><X /></button>
      {children}
    </div>
  </div>
));






  return (
    <div className='p-4'>
      {!currentUser ? (
        <div>Loading user data...</div>
      ) : (
        <div className="space-y-6 provider-dashboard">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Healthcare Provider Portal</h2>
            <p className="opacity-90">Access patient data securely with proper consent and compensation.</p>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ justifyContent: 'space-evenly' }}>
        <StatCard title="Active Patients" value={patients} icon={Users} color="green" />
        <StatCard title="Data Access Granted" value={dataAccess} icon={FileText} color="blue" />
        <StatCard title="Pending Requests" value={pendingRequests} icon={Clock} color="yellow" />
        <StatCard title="Recent Activity" value={lastLogin || "Unknown"} icon={Activity} color="purple" />
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
                  <th className="pb-3">Data Shared</th>
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
          <h4 className="text-sm font-semibold text-gray-700 mb-2 mt-4">Sent Requests</h4>
{sentRequests.length > 0 ? (
  sentRequests.map((req, index) => (
    <div key={index} className="border border-gray-100 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{req.data_type}</h4>
        <span className={`badge ${req.status === 'pending' ? 'yellow' : 'green'}`}>{req.status}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        To: {req.recipients.join(', ')} - {req.purpose}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Requested on {req.date}</span>
        <span className="text-green-600 font-medium">{req.compensation} tokens</span>
      </div>
     
    </div>
  ))
) : (
  <p className="text-sm text-gray-500 italic">No sent requests.</p>
)}


          <h4 className="text-sm font-semibold text-gray-700 mb-2">Received Requests</h4>
  {receivedRequests.length > 0 ? (
    receivedRequests.map((req,index) => (
      <div key={index} className="border border-gray-100 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900">{req.dataType}</h4>
          <span className={`badge ${req.status === 'pending' ? 'yellow' : 'green'}`}>{req.status}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          From: {req.requester_name} - {req.purpose}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Requested on {req.date}</span>
          <span className="text-green-600 font-medium">{req.compensation} tokens</span>
        </div>

        {req.status === 'pending' && (
          <div className="flex gap-2 mt-2">
    <button
      onClick={() => updateRequestStatus(req.id, "accepted")}
      className="px-3 py-1 bg-green-600 text-white rounded-md"
    >
      Accept
    </button>
    <button
      onClick={() => updateRequestStatus(req.id, "declined")}
      className="px-3 py-1 bg-red-600 text-white rounded-md"
    >
      Decline
    </button>
  </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500 italic">No received requests.</p>
  )}


        </div>
      </div>

      {/* Modals */}
      {modal && <div className="modal-backdrop" onClick={handleClose}></div>}
{modal === 'request' && (
  <div className="modal-overlay">
    <div className="modal modal-medium">
      <div className="modal-header">
        <h2>Send Data Request</h2>
        <button onClick={() => setModal(null)} className="modal-close">
          <X className="close-icon" />
        </button>
      </div>

      <div className="modal-body">
        <form className="space-y-4" onSubmit={handleAddRequest}>

          <div className="form-group">
  <label className="form-label">Requester Name</label>
  <input
    type="text"
    className="form-input"
    value={currentUser?.name || ''}
    readOnly
  />
</div>


          <div className="form-group">
            <label className="form-label">Select Recipients (Providers or Researchers)</label>
            <input
              type="text"
              value={searchRecipients}
              onChange={(e) => setSearchRecipients(e.target.value)}
              placeholder="Search users by name..."
              className="form-input"
            />
            <div className="collaborator-list">
              {allUsers
                .filter(user =>
                  user &&
                  ['provider', 'researcher'].includes(user.role) &&
                  user.name.toLowerCase().includes(searchRecipients.toLowerCase())
                )
                .map(user => (
                  <label key={user.email} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.recipients.includes(user.email)}
                      onChange={() => toggleRecipient(user.email)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-label">{user.name} ({user.role})</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Data Type</label>
            <select
              className="form-input"
              value={formData.dataType}
              onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
              required
            >
              <option value="">Select Data Type</option>
              <option value="Cardiovascular Data">Cardiovascular Data</option>
              <option value="Glucose Monitoring">Glucose Monitoring</option>
              <option value="MRI Scans">MRI Scans</option>
              <option value="Blood Reports">Blood Reports</option>
              <option value="Genomic Sequences">Genomic Sequences</option>
              <option value="X-Ray Records">X-Ray Records</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Purpose</label>
            <input
              type="text"
              className="form-input"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Describe the reason for this data request..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Compensation (ICP Tokens)</label>
            <input
              type="number"
              min="0"
              className="form-input"
              value={formData.compensation}
              onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-with-icon">
              <Send className="btn-icon" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
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
      )}
      </div>
    
  );
};

export default ProviderDashboard;