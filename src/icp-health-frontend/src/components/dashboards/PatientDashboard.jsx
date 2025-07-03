import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Clock,
  X,
  Image,
  FileSpreadsheet,
  Search
} from 'lucide-react';
import { healthRecords, dataRequests } from '../../utils/mockData';
import './patient.css';
import MyUploadsTable from './MyUploadsTable';
import { HttpAgent } from '@dfinity/agent';
import { createActor } from '../../../../declarations/icp-health-backend';
import { AuthClient } from '@dfinity/auth-client';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const PatientDashboard = ({ viewMode = 'dashboard', onBackToDashboard }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [doctorQuery, setDoctorQuery] = useState('');
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const MAX_FILE_SIZE_MB = 1.9;

 useEffect(() => {
  const fetchUploadsAndEarnings = async () => {
    try {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();

      const agent = new HttpAgent({ identity });

      // ⚠️ Only fetch root key in development
      if (window.location.hostname === 'localhost') {
        await agent.fetchRootKey();
      }

      const actor = createActor(canisterId, { agent });

      const uploads = await actor.get_my_uploads();
      const total = uploads.reduce((sum, item) => sum + Number(item.earning_icp || 0), 0);
      setTotalEarnings(total);
    } catch (err) {
      console.error("Error fetching uploads for earnings:", err);
      setTotalEarnings(0);
    }
  };
  fetchUploadsAndEarnings();
}, []);



 useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();

      const agent = new HttpAgent({ identity });

      if (window.location.hostname === 'localhost') {
        await agent.fetchRootKey();
      }

      const actor = createActor(canisterId, { agent });

      const doctors = await actor.get_all_doctors();
      setAllDoctors(doctors);
      setFilteredDoctors(doctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };
  fetchDoctors();
}, []);

console.log("All Doctors:", allDoctors);

  const pendingRequests = dataRequests.filter(r => r.status === 'pending').length;
  const sharedRecords = healthRecords.filter(r => r.status === 'shared' || r.status === 'monetized').length;
  

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files).filter(f => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return <FileText className="file-icon red" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Image className="file-icon blue" />;
      case 'xlsx':
      case 'xls':
      case 'csv': return <FileSpreadsheet className="file-icon green" />;
      default: return <FileText className="file-icon gray" />;
    }
  };

  const handleDoctorSearch = () => {
    const q = doctorQuery.trim().toLowerCase();
    if (!q) return setFilteredDoctors(allDoctors);
    setFilteredDoctors(allDoctors.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
    ));
  };

  const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result?.split(',')[1];
      if (!base64) {
        reject(new Error("Base64 conversion failed or result is empty."));
      } else {
        resolve(base64);
      }
    };
    reader.onerror = reject;
  });
};


  const handleSubmit = async () => {
  if (!uploadedFiles.length || !category || !keywords || !selectedDoctor) {
    alert("Please fill in all fields and select at least one file.");
    return;
  }

  if (!canisterId) {
    alert("Canister ID is missing. Check your .env file.");
    return;
  }

  try {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (window.location.hostname === "localhost") {
      await agent.fetchRootKey();
    }

    const actor = createActor(canisterId, { agent });

    let successCount = 0;

    for (const file of uploadedFiles) {
      try {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          alert(`File too large: ${file.name}. Max allowed is ${MAX_FILE_SIZE_MB}MB.`);
          continue;
        }

        const base64Content = await fileToBase64(file);

        if (!base64Content || typeof base64Content !== "string") {
          console.warn(`⚠️ Skipping ${file.name}: Invalid base64 content.`);
          continue;
        }

        

        const res = await actor.upload_document(
          file.name,
          category,
          keywords,
          base64Content,
          selectedDoctor.name // or selectedDoctor.principal if backend expects principal
        );

        if (res?.ok) {
          console.log(`✅ Uploaded: ${file.name}, hash: ${res.ok.hash}`);
          successCount++;
        } else {
          console.warn(`❌ Upload failed for ${file.name}:`, res.err || res);
        }
      } catch (uploadErr) {
        console.error(`Error uploading ${file.name}:`, uploadErr);
      }
    }

    alert(`${uploadedFiles.length} of ${uploadedFiles.length} file(s) uploaded.`);
    setUploadedFiles([]);
    setCategory('');
    setKeywords('');
    setSelectedDoctor(null);
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Upload failed. Check console for details.");
  }
};


  if (viewMode === 'uploads') {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-card">
          <div className="uploads-header">
            <button className="back-btn" onClick={onBackToDashboard}>
              ← Back to Dashboard
            </button>
          </div>
          <MyUploadsTable />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-greybox">
        <div className="stat-card-row horizontal">
          <div className="stat-card">
            <span className="stat-icon icp-symbol" title="ICP">♾</span>
            <h3>Total Earnings</h3>
            <p><span style={{ fontSize: '20px', marginRight: '4px' }}>♾</span>{totalEarnings}</p>
          </div>
          <div className="stat-card">
            <Clock className="stat-icon yellow" />
            <h3>Pending Requests</h3>
            <p>{pendingRequests}</p>
          </div>
          <div className="stat-card">
            <Upload className="stat-icon blue" />
            <h3>Records Shared</h3>
            <p>{sharedRecords}</p>
          </div>
        </div>

        {/* Upload form */}
        <div className="upload-form-section">
          <h3>Upload New Record</h3>

          <div className="upload-input-row">
            <div className="upload-input-group">
              <label>Category</label>
              <select className="upload-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">-- Choose --</option>
                <option value="Scan">Scan</option>
                <option value="Prescription">Prescription</option>
                <option value="Reports">Reports</option>
                <option value="Medical Test">Medical Test</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="upload-input-group">
              <label>Keywords</label>
              <input
                className="upload-input"
                type="text"
                placeholder="e.g. diabetes, MRI"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          <div className="upload-input-group">
            <label>Doctor Name</label>
            <div className="doctor-search-bar">
              <input
                type="text"
                placeholder="Enter doctor name"
                value={doctorQuery}
                onChange={(e) => {
                  setDoctorQuery(e.target.value);
                  setSelectedDoctor(null);
                }}
              />
              <button onClick={handleDoctorSearch}><Search size={18} /></button>
            </div>
            <div className="doctor-results">
              {filteredDoctors.map((doc, i) => (
                <div
                  key={i}
                  className={`doctor-card${selectedDoctor?.principal === doc.principal ? ' selected' : ''}`}
                  onClick={() => {
  console.log("Doctor selected:", doc);
  setSelectedDoctor(doc);
}}
                >
                  <strong>{doc.name}</strong>
                  
                </div>
              ))}
              {doctorQuery && filteredDoctors.length === 0 && (
                <p className="no-result">No doctor found</p>
              )}
              {selectedDoctor && (
  <p className="selected-doctor">
    Selected Doctor: <strong>{selectedDoctor.name}</strong>
  </p>
)}

            </div>
          </div>

          <div
            className={`upload-box ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={32} className="upload-icon" />
            <p>Drag & drop files here or click to upload (Max {MAX_FILE_SIZE_MB}MB)</p>
            <input type="file" multiple onChange={handleFileInput} />
          </div>

          <div className="uploaded-files">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="uploaded-file">
                <div className="file-info">
                  {getFileIcon(file.name)}
                  <span>{file.name}</span>
                </div>
                <button onClick={() => removeFile(index)} className="remove-btn">
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <button className="upload-submit-btn" onClick={handleSubmit}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
