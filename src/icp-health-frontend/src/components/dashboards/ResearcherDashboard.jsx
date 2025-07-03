// ResearcherDashboard.jsx
import React, { useState, useEffect } from 'react';
import './researcher.css';
import {
  Database, Users, TrendingUp, Award,
  Download, Plus
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { researchStudies, healthRecords, users, dataRequests, researcherDataRequests } from '../../utils/mockData';
import Modal from '../shared/Modal';

const ResearcherDashboard = () => {
  const [modal, setModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [compensation, setCompensation] = useState('');

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = healthRecords.filter(rec =>
        rec.title.toLowerCase().includes(query) ||
        rec.provider.toLowerCase().includes(query) ||
        rec.description.toLowerCase().includes(query) ||
        rec.type.toLowerCase().includes(query)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const toggleSourceSelection = (id) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmitRequest = () => {
    if (!compensation || selectedSources.length === 0) return alert('Fill all fields');
    const newRequest = {
      id: Date.now().toString(),
      requesterName: 'Current Researcher',
      requesterType: 'researcher',
      dataSourcesRequested: selectedSources.map(id => healthRecords.find(r => r.id === id).title),
      dataSourcesReceived: [],
      status: 'pending',
      compensation,
      date: new Date().toISOString().split('T')[0]
    };
    console.log('Submitting request:', newRequest);
    alert('Request submitted!');
    setModal(null);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedSources([]);
    setCompensation('');
  };

  const activeStudies = researchStudies.filter(s => s.status === 'active').length;
  const totalParticipants = researchStudies.reduce((sum, s) => sum + s.participants, 0);
  const recruitingStudies = researchStudies.filter(s => s.status === 'recruiting').length;

  return (
    <div className="space-y-6 researcher-dashboard">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Research Analytics Portal</h2>
        <p className="opacity-90">Access anonymized health data for groundbreaking medical research.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Studies" value={activeStudies} icon={Database} trend={{ value: '+2 this quarter', isPositive: true }} color="purple" />
        <StatCard title="Total Participants" value={totalParticipants.toLocaleString()} icon={Users} trend={{ value: '+15.2%', isPositive: true }} color="blue" />
        <StatCard title="Recruiting" value={recruitingStudies} icon={Users} color="green" />
        <StatCard title="Data Points" value="2.1M" icon={TrendingUp} trend={{ value: '+8.7%', isPositive: true }} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Research Studies</h3>
            <button className="icon-btn flex items-center space-x-1" onClick={() => alert('Add study modal coming soon!')}>
              <Plus />
              <span className="text-sm font-medium">New Research</span>
            </button>
          </div>
          {researchStudies.map((study) => (
            <div key={study.id} className="p-4 border rounded-lg mb-4 hover:bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{study.title}</h4>
                <span className={`status-badge ${study.status}`}>{study.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{study.description}</p>
              <div className="flex justify-between text-sm text-gray-500 items-center">
                <div className="flex space-x-4">
                  <span><Users className="inline mr-1 h-4 w-4" />{study.participants.toLocaleString()} participants</span>
                  <span>{study.duration}</span>
                </div>
                <span className="text-green-600 font-medium">{study.compensation} ICP</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Access</h3>
            <button className="market-request-btn" onClick={() => setModal('dataSearch')}>Request Data Access</button>
          </div>
          <ul className="text-sm space-y-2">
            <li>• Search for records from doctors, keywords, or document types</li>
            <li>• Submit compensation in ICP tokens</li>
            <li>• Download accepted documents instantly</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">My Data Requests</h3>
        <div className="space-y-4">
          {researcherDataRequests.map((req, index) => (
            <React.Fragment key={req.id}>
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{req.requesterName} — {req.date}</h4>
                  <span className={`status-badge ${req.status.replace(/\s+/g, '-')}`}>{req.status}</span>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Requested:</strong> {req.dataSourcesRequested.join(', ')}<br />
                  <strong>Received:</strong> {req.dataSourcesReceived.length > 0 ? req.dataSourcesReceived.join(', ') : 'None'}<br />
                  <strong>Compensation:</strong> {req.compensation} ICP
                </p>
                {req.dataSourcesReceived.length > 0 && (
                  <button className="mt-2 text-blue-600 hover:underline text-sm">
                    📥 Download Documents
                  </button>
                )}
              </div>
              {index !== researcherDataRequests.length - 1 && (
                <hr className="border-t border-gray-300 my-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {modal === 'dataSearch' && (
        <div className="modal-overlay">
          <div className="modal-content wide">
            <button className="modal-close-icon" onClick={() => setModal(null)}>×</button>
            <h2 className="modal-title">Search Health Records</h2>
            <div className="modal-body space-y-4">
              <input
                type="text"
                className="input w-full"
                placeholder="Search by doctor name, keyword, or document type"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <label key={item.id} className="block border-b py-2 text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedSources.includes(item.id)}
                      onChange={() => toggleSourceSelection(item.id)}
                    />
                    <strong>{item.title}</strong> — {item.type}, Provider: {item.provider}
                  </label>
                ))}
              </div>
              <input
                type="number"
                className="input"
                placeholder="Compensation (ICP Tokens)"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                required
              />
              <button className="submit-btn w-full" onClick={handleSubmitRequest}>Submit Request for Approval</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard;
