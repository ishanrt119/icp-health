import React, { useState, useEffect,useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts';
import { 
  Database, 
  Users, 
  TrendingUp, 
  Award,
  Search,
  Filter,
  Download,
  Play,
  UserPlus,
  BarChart3,
  Globe,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Brain,
  Target,
  Zap,
  Eye,
  Settings,
  Share2,
  BookOpen,
  PieChart as PieChartIcon,

  Activity,
  Microscope,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  MessageSquare,
  Bell,
  Bookmark,
  Send,
  UserCheck,
  Building,
  Mail
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { researchStudies, healthRecords, researcherDataRequests } from '../../utils/mockData';
import './researcher.css';  
import { Principal } from '@dfinity/principal';
import { icp_health_backend } from '../../../../declarations/icp-health-backend';

const ResearcherDashboard = ({ currentUser, showModal, setShowModal }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modal, setModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [compensation, setCompensation] = useState('');
  const [collaborationRequest, setCollaborationRequest] = useState([]);
  const [researcherDataRequests, setResearcherDataRequests] = useState(() => {
  const stored = localStorage.getItem('researcherDataRequests');
  return stored ? JSON.parse(stored) : [];
});
const [expandedRequestId, setExpandedRequestId] = useState(null);

  function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


  const [filters, setFilters] = useState({
    ageRange: '',
    gender: '',
    condition: '',
    dateRange: '',
    dataQuality: ''
  });

const [collaborationForm, setCollaborationForm] = useState({
  institution: '',
  contactEmail: '',
  studyTitle: '',
  message: '',
  dataTypes: [],
  collaborators: []  // array of principals
});
const [collaborators, setCollaborators] = useState([]);
const [searchCollaborators, setSearchCollaborators] = useState('');

useEffect(() => {
  const fetchCollaborators = async () => {
    try {
      const collaborators = await icp_health_backend.get_all_collaborators();
      console.log("Fetched collaborators:", collaborators); // <== check this
      setCollaborators(collaborators);
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    }
  };
  fetchCollaborators();
}, []);



const toggleCollaborator = (email) => {
  setCollaborationForm((prevForm) => {
    const isSelected = prevForm.collaborators.includes(email);
    const updated = isSelected
      ? prevForm.collaborators.filter(e => e !== email)
      : [...prevForm.collaborators, email];

    return {
      ...prevForm,
      collaborators: updated,
    };
  });
};



  const [expandedStudy, setExpandedStudy] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'New cardiovascular dataset available', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Study "Diabetes Prevention" reached 80% completion', time: '4 hours ago' },
    { id: 3, type: 'warning', message: 'Data request approval pending for 3 days', time: '1 day ago' }
  ]);

  const [form, setForm] = useState({
  studyTitle: '',
  reason: '',
  ageRange: '',
  gender: '',
  dataQuality: '',
  format: '',
  deadline: '',
});

  const timeAgo = (timestamp) => {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  return diffHours > 0
    ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    : `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
};


  const [createdStudies, setCreatedStudies] = useState(() => {
  const stored = localStorage.getItem('createdStudies');
  return stored ? JSON.parse(stored) : [];
});
const [newStudyForm, setNewStudyForm] = useState({
  title: '',
  description: '',
  participants: '',
  duration: '3 months'
});

  // Collaboration state
  

  
  // Advanced search with filters
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      let results = healthRecords.filter(rec =>
        rec.title.toLowerCase().includes(query) ||
        rec.provider.toLowerCase().includes(query) ||
        rec.description.toLowerCase().includes(query) ||
        rec.type.toLowerCase().includes(query)
        
      );

      // Apply filters
      if (filters.condition) {
        results = results.filter(rec => 
          rec.description.toLowerCase().includes(filters.condition.toLowerCase())
        );
      }
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, filters]);

  const toggleSourceSelection = (id) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmitRequest = () => {
  const {
    studyTitle,
    reason,
    ageRange,
    gender,
    dataQuality,
    format,
    deadline
  } = form;

  if (!studyTitle || !reason || !format || !deadline) {
    alert('Please fill all required fields: Study Title, Reason, Format, and Deadline');
    return;
  }

  const newRequest = {
    id: Date.now().toString(),
    requesterName: 'Current Researcher',
    requesterType: 'researcher',
    studyTitle,
    reason,
    ageRange,
    gender,
    dataQuality,
    format,
    deadline,
    dataSourcesRequested: [],          // You can change this based on your flow
    dataSourcesReceived: [],
    status: 'pending',
    compensation: '5',                // Default or input-driven
    date: new Date().toISOString().split('T')[0]
  };

  const updatedRequests = [...researcherDataRequests, newRequest];
  setResearcherDataRequests(updatedRequests);
  localStorage.setItem('researcherDataRequests', JSON.stringify(updatedRequests));

  alert('Data request submitted successfully!');
  setModal(null);
  setForm({
    studyTitle: '',
    reason: '',
    ageRange: '',
    gender: '',
    dataQuality: '',
    format: '',
    deadline: ''
  });
};



  useEffect(() => {
  const fetchRequests = async () => {
    if (typeof icp_health_backend.get_all_requests_for_user !== 'function') {
      console.warn('get_all_requests_for_user not implemented');
      return;
    }

    const data = await icp_health_backend.get_all_requests_for_user(currentUser?.email);
    setCollaborationRequests(data);
  };

  fetchRequests();
}, []);




  const resetSearchForm = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedSources([]);
    setCompensation('');
    setFilters({
      ageRange: '',
      gender: '',
      condition: '',
      dateRange: '',
      dataQuality: ''
    });
  };

  useEffect(() => {
  const savedRequests = localStorage.getItem('collabRequests');
  if (savedRequests) {
    setCollaborationRequest(JSON.parse(savedRequests));
  }
}, []);

 const handleCollaborationSubmit = () => {
  if (!collaborationForm.institution || !collaborationForm.contactEmail || !collaborationForm.studyTitle) {
    alert('Please fill all required fields');
    return;
  }

  const newRequest = {
    id: Date.now(),
    from: currentUser?.name || 'Anonymous',
    to: collaborationForm.collaborators.join(', '), // <-- Add this line
    study: collaborationForm.studyTitle,
    message: collaborationForm.message || '',
    collaborators: collaborationForm.collaborators,
    institution: collaborationForm.institution,
    email: collaborationForm.contactEmail,
    dataTypes: collaborationForm.dataTypes,
    type: 'sent',
  };

  
  const updatedRequests = [...collaborationRequest, newRequest];
  setCollaborationRequest(updatedRequests);
  localStorage.setItem('collabRequests', JSON.stringify(updatedRequests));

  setCollaborationForm({
    institution: '',
    contactEmail: '',
    studyTitle: '',
    message: '',
    dataTypes: [],
    collaborators: [],
  });

  setShowModal(false);
  alert('Collaboration request sent successfully!');
};




  const toggleDataType = (dataType) => {
    setCollaborationForm(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataType)
        ? prev.dataTypes.filter(type => type !== dataType)
        : [...prev.dataTypes, dataType]
    }));
  };

  // Mock data for advanced features
  const activeStudies = researchStudies.filter(s => s.status === 'active').length;
  const totalParticipants = Array.isArray(createdStudies)
  ? createdStudies.reduce((sum, study) => sum + Number(study.participants || 0), 0)
  : 0;
  const recruitingStudies = researchStudies.filter(s => s.status === 'recruiting').length;

  const analyticsData = [
    { category: 'Cardiovascular', patients: 1250, avgAge: 52, completion: 78, quality: 'High' },
    { category: 'Diabetes', patients: 800, avgAge: 48, completion: 85, quality: 'High' },
    { category: 'Mental Health', patients: 2000, avgAge: 35, completion: 62, quality: 'Medium' },
    { category: 'Oncology', patients: 450, avgAge: 58, completion: 91, quality: 'High' },
    { category: 'Neurology', patients: 650, avgAge: 45, completion: 73, quality: 'High' },
    { category: 'Respiratory', patients: 920, avgAge: 41, completion: 68, quality: 'Medium' }
  ];

  const aiInsights = [
    {
      title: "Trending Research Opportunity",
      description: "Cardiovascular data shows 23% increase in availability this month",
      action: "Explore Dataset",
      priority: "high"
    },
    {
      title: "Participant Recruitment Alert",
      description: "Your diabetes study is 15% behind recruitment targets",
      action: "Adjust Criteria",
      priority: "medium"
    },
    {
      title: "Data Quality Improvement",
      description: "New validation algorithms available for your active studies",
      action: "Apply Updates",
      priority: "low"
    }
  ];

  

const renderOverviewTab = () => (
  <div className="tab-content">
    {/* Stats Grid */}
    <div className="stats-grid">
   <StatCard
  title="Active Studies"
  value={createdStudies.length}
  icon={Database}
  trend={`{ value: +${createdStudies.length} total, isPositive: true }`}
  color="purple"
/>

      <StatCard
        title="Total Participants"
        value={totalParticipants.toLocaleString()}
        icon={Users}
        color="blue"
      />
      
      <StatCard
        title="Collaborations"
        value={collaborationRequest.length.toLocaleString()}
        icon={UserPlus}
        trend={{ value: `+${collaborationRequest.length}`, isPositive: true }}
        color="yellow"
      />

      
    </div>

    {/* AI-Powered Insights */}
    <div className="card">
      <div className="card-header">
        <Brain className="icon-purple" />
        <h3>AI Research Assistant</h3>
        <span className="badge badge-purple">Beta</span>
      </div>
      <div className="insights-grid">
        {aiInsights.map((insight, index) => (
          <div
            key={index}
            className={`insight-card insight-${insight.priority}`}
          >
            <h4>{insight.title}</h4>
            <p className="insight-description">{insight.description}</p>
            <button className="insight-action">
              {insight.action} →
            </button>
          </div>
        ))}
      </div>
    </div>
    

    {/* Quick Actions */}
    <div className="quick-actions-grid">
      <button
        onClick={() => setModal('dataRequest')}
        className="action-btn action-btn-blue"
      >
        <Search className="action-icon" />
        <span>Data Request</span>
      </button>
      <button
        onClick={() => setModal('newStudy')}
        className="action-btn action-btn-green"
      >
        <Plus className="action-icon" />
        <span>New Study</span>
      </button>
      <button className="action-btn action-btn-purple">
        <BarChart3 className="action-icon" />
        <span>Analytics</span>
      </button>
      <button
        onClick={() => setModal('collaboration')}
        className="action-btn action-btn-orange"
      >
        <Share2 className="action-icon" />
        <span>Collaborate</span>
      </button>
    </div>

  {/* Recent Activity & My Research Studies */}
<div className="two-column-grid">
  {/* Recent Activity */}
  <div className="card">
    <h3></h3>
    <div className="activity-list">
      {/* Example activities */}
      <div className="activity-item">
        
      </div>
    </div>


  {/* ✅ My Research Studies Card */}
  <div className="card">
    <div className="card-header">
      <Microscope className="icon-green" />
      <h3>My Research Studies</h3>
    </div>
    <div className="studies-summary">
      {createdStudies.length === 0 ? (
        <p>No studies created yet. Click "New Study" to begin.</p>
      ) : (
        createdStudies.slice(0, 3).map((study) => (
          <div className="study-summary-item" key={study.id}>
            <div className="study-summary-header">
              <h4 className="study-summary-title">{study.title}</h4>
              <span className="study-summary-time">{timeAgo(study.createdAt)}</span>
            </div>
            <p className="study-summary-desc">
              {study.description.slice(0, 80)}...
            </p>
            <div className="study-summary-meta">
              <span>{study.participants} participants</span>
              <span>{study.duration}</span>
              <span>{study.compensation} ICP</span>
            </div>
          </div>
        ))
      )}
    </div>

   {/* ✅ View All Button */}
{createdStudies.length > 3 && (
  <div className="card-footer center-button">
    <button
      className="btn-view-all"
      onClick={() => setActiveTab('studies')}
    >
      View All
    </button>
  </div>
)}

  </div>
</div>
      

      {/* Collaboration Requests */}
      <div className="card">
  <h3>Collaboration Requests</h3>
  <div className="collaboration-list">
    {collaborationRequest.map((request) => (
      <div key={request.id} className="collaboration-item">
        <div className="collaboration-content">
          <p className="collaboration-from">
  {request.type === 'sent' 
    ? `To: ${request.to}` 
    : `From: ${request.from}`}
  <span className="request-type-tag">
    {request.type === 'sent' ? ' (Sent)' : ' (Received)'}
  </span>
</p>

          <p className="collaboration-study">{request.study}</p>
          <p className="collaboration-message">{request.message}</p>
        </div>

        {/* Only show buttons for "received" requests */}
        {request.type !== 'sent' && (
          <div className="collaboration-actions">
            <button className="collaboration-btn collaboration-btn-approve">
              <CheckCircle className="collaboration-icon" />
            </button>
            <button className="collaboration-btn collaboration-btn-reject">
              <X className="collaboration-icon" />
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</div>


    </div>
  </div>
);


  const renderStudiesTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Research Studies</h2>
        <button 
          onClick={() => setModal('newStudy')}
          className="btn-primary"
        >
          <Plus className="btn-icon" />
          <span>New Study</span>
        </button>
      </div>

     <div className="studies-container">
  <div className="card">
    <div className="studies-list">
{[...createdStudies, ...researchStudies].map((study) => (
  <div key={study.id} className="study-item">
    <div className="study-main">
      <div className="study-header">
        <button
          onClick={() =>
            setExpandedStudy(expandedStudy === study.id ? null : study.id)
          }
          className="expand-btn"
        >
          {expandedStudy === study.id ? (
            <ChevronDown className="expand-icon" />
          ) : (
            <ChevronRight className="expand-icon" />
          )}
        </button>
        <h4 className="study-title">{study.title}</h4>
        <span className={`status-badge status-${study.status}`}>
          {study.status}
        </span>
      </div>
      <p className="study-description">{study.description}</p>

      {expandedStudy === study.id && (
        <div className="study-expanded">
          <div className="study-metrics">
            <div className="metric">
              <p className="metric-label">Progress</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <p className="metric-value">65% Complete</p>
            </div>
            <div className="metric">
              <p className="metric-label">Data Quality</p>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`star ${i <= 4 ? 'star-filled' : 'star-empty'}`}
                  />
                ))}
              </div>
            </div>
            <div className="metric">
              <p className="metric-label">Last Updated</p>
              <p className="metric-value">2 hours ago</p>
            </div>
          </div>
          <div className="study-actions">
            <button className="study-action-btn study-action-blue">
              View Details
            </button>
            <button className="study-action-btn study-action-green">
              Export Data
            </button>
            <button className="study-action-btn study-action-purple">
              Analytics
            </button>

            {createdStudies.some(s => s.id === study.id) && (
              <button
                className="study-action-btn study-action-red"
                onClick={() => {
                  const updated = createdStudies.filter(s => s.id !== study.id);
                  setCreatedStudies(updated);
                  localStorage.setItem('createdStudies', JSON.stringify(updated));
                }}
              >
                Delete
              </button>
            )}

          </div>
        </div>
      )}
    </div>
    <div className="study-info">
      <div className="study-stats">
        <span className="study-stat">
          <Users className="study-stat-icon" />
          <span>{study.participants.toLocaleString()}</span>
        </span>
        <span className="study-duration">{study.duration}</span>
      </div>
      <p className="study-compensation">{study.compensation} ICP</p>
    </div>
  </div>
))}
    </div>
  </div>
</div>

    </div>
  );

  const renderAnalyticsTab = (analyticsData) => (
    
  <div className="tab-content">
    <h2>Data Analytics</h2>

    {/* Analytics Overview */}
    <div className="analytics-overview">

      {/* Data Distribution */}
      <div className="card">
        <div className="card-header">
          <PieChartIcon className="icon-blue" />
          <h3>Data Distribution</h3>
        </div>
        <div className="analytics-items">
          <PieChart width={300} height={250}>
            <Pie
              data={analyticsData.slice(0, 4)}
              dataKey="patients"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {analyticsData.slice(0, 4).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={['#2563eb', '#10b981', '#f59e0b', '#ef4444'][index % 4]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="card">
        <div className="card-header">
          <Activity className="icon-green" />
          <h3>Quality Metrics</h3>
        </div>
        <div className="analytics-items">
          <BarChart width={300} height={200} data={[
            { label: 'High', value: 78 },
            { label: 'Medium', value: 18 },
            { label: 'Low', value: 4 }
          ]}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              <Cell fill="#22c55e" />
              <Cell fill="#facc15" />
              <Cell fill="#ef4444" />
            </Bar>
          </BarChart>
        </div>
      </div>

      {/* Trends */}
      <div className="card">
        <div className="card-header">
          <TrendingUp className="icon-purple" />
          <h3>Trends</h3>
        </div>
        <div className="analytics-items">
          <LineChart width={300} height={200} data={[
            { metric: 'Data Requests', value: 23 },
            { metric: 'Participants', value: 15 },
            { metric: 'Completion Rate', value: 8 }
          ]}>
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      </div>

    </div>

    {/* Detailed Analytics */}
    <div className="card">
      <h3>Category Analysis</h3>
      <div className="category-analysis">
        {analyticsData.map((item, index) => (
          <div key={index} className="category-item">
            <div className="category-header">
              <h4>{item.category}</h4>
              <div className="category-stats">
                <span>{item.patients.toLocaleString()} patients</span>
                <span>Avg. Age: {item.avgAge}</span>
                <span className={`quality-badge quality-${item.quality.toLowerCase()}`}>
                  {item.quality} Quality
                </span>
              </div>
            </div>

            <div className="category-details">
              <span>Completion: {item.completion}%</span>
              <button className="view-details-btn">View Details →</button>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${item.completion}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const renderDataRequestTab = (researcherDataRequests, setModal) => (
  <div className="tab-content">
    <div className="tab-header">
      <h2>Data Requests</h2>
      <button 
        onClick={() => setModal('dataRequest')}
        className="btn-primary"
      >
        
        <span>New Request</span>
      </button>
    </div>

    <div className="card">
      <div className="requests-list">
        {researcherDataRequests.map((req) => (
          <React.Fragment key={req.id}>
            <div className="request-item">
              <div className="request-main">
                <div className="request-header">
                  <h4 className="request-name">{req.requesterName}</h4>
                  <span className={`status-badge status-${req.status.replace(' ', '-').toLowerCase()}`}>
                    {req.status}
                  </span>
                </div>
                <p className="request-detail">
                  <strong>Requested:</strong> {req.dataSourcesRequested.join(', ')}
                </p>
                {req.dataSourcesReceived.length > 0 && (
                  <p className="request-detail">
                    <strong>Received:</strong> {req.dataSourcesReceived.join(', ')}
                  </p>
                )}
                <div className="request-meta">
                  <span>{req.date}</span>
                  <span className="request-compensation">{req.compensation} ICP</span>
                </div>
              </div>

              <div className="request-actions">
                {req.dataSourcesReceived.length > 0 && (
                  <button className="request-action-btn">
                    <Download className="request-action-icon" />
                  </button>
                )}
                <button className="request-action-btn">
                  <Eye className="request-action-icon" />
                </button>
              </div>

              {req.status.toLowerCase() === 'pending' && (
                <div className="request-status">
                  <div className="request-status-content">
                    <Clock className="request-status-icon" />
                    <span>Waiting for patient approval</span>
                  </div>
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

const renderDataRequestsTab = () => (
  <div className="tab-content">
    <div className="tab-header">
      <h2>Data Requests</h2>
      <button 
  onClick={() => setModal('dataRequest')}
  className="btn btn-primary flex items-center gap-2"
>
  <Plus className="btn-icon" />
  <span>New Request</span>
</button>

    </div>

    <div className="card">
      <div className="requests-list">
        {researcherDataRequests.length === 0 ? (
          <p className="empty-state">No requests submitted yet.</p>
        ) : (
          researcherDataRequests.map((req) => {
            const isExpanded = expandedRequestId === req.id;

            return (
              <React.Fragment key={req.id}>
                <div className="request-item">
                  <div className="request-main">
                    <div className="request-header">
                      <h4 className="request-name">{req.studyTitle}</h4>
                      <span className={`status-badge status-${req.status.replace(' ', '-').toLowerCase()}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="request-meta">
                      <span>{req.date}</span>
                      <span className="request-compensation">{req.compensation || '—'} ICP</span>
                    </div>
                  </div>
                  
                  <div className="request-actions">
                    {req.dataSourcesReceived?.length > 0 && (
                      <button className="request-action-btn">
                        <Download className="request-action-icon" />
                      </button>
                    )}
                    <button
                      className="request-action-btn"
                      onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                    >
                      <Eye className="request-action-icon" />
                    </button>
                  </div>
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                  <div className="request-details-expanded">
                    <p><strong>Reason:</strong> {req.reason}</p>
                    <p><strong>Format:</strong> {req.format}</p>

                    {req.ageRange && <p><strong>Age Range:</strong> {req.ageRange}</p>}
                    {req.gender && <p><strong>Gender:</strong> {req.gender}</p>}
                    {req.dataQuality && <p><strong>Data Quality:</strong> {req.dataQuality}</p>}
                    
                    {req.dataSourcesRequested?.length > 0 && (
                      <p><strong>Requested Data:</strong> {req.dataSourcesRequested.join(', ')}</p>
                    )}
                    {req.dataSourcesReceived?.length > 0 && (
                      <p><strong>Received:</strong> {req.dataSourcesReceived.join(', ')}</p>
                    )}
                    {req.status.toLowerCase() === 'pending' && (
                      <div className="request-status">
                        <Clock className="request-status-icon" />
                        <span>Waiting for patient approval</span>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  </div>
);

  return (
    <div className="dashboard">
      {/* Header */}
      
      

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <div className="nav-tabs-container">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'studies', label: 'Studies', icon: Microscope },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
            { id: 'requests', label: 'Data Requests', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'nav-tab-active' : ''}`}
            >
              <tab.icon className="nav-tab-icon" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'studies' && renderStudiesTab()}
      {activeTab === 'analytics' && analyticsData && renderAnalyticsTab(analyticsData)}

      {activeTab === 'requests' && renderDataRequestsTab()}

      {/* Data Request Modal */}
{modal === 'dataRequest' && (
  <div className="modal-overlay">
    <div className="modal modal-large">
      <div className="modal-header">
        <h2>Request Data Access</h2>
        <button onClick={() => setModal(null)} className="modal-close">
          <X className="close-icon" />
        </button>
      </div>

      <div className="modal-body">
        {/* Request Form */}
        <div className="request-form">
          <div className="form-group">
            <label className="form-label">Request Title</label>
            <input
              type="text"
              value={form.studyTitle}
              onChange={(e) => setForm({ ...form, studyTitle: e.target.value })}
              placeholder="Enter the title of your request"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Request</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Explain why you're requesting this data"
              className="form-textarea"
            />
          </div>

          {/* Optional Filters */}
          <div className="form-group">
            <label className="form-label">Age Range</label>
            <select
              value={form.ageRange}
              onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
              className="form-select"
            >
              <option value="">All Ages</option>
              <option value="18-30">18-30</option>
              <option value="31-50">31-50</option>
              <option value="51-70">51-70</option>
              <option value="70+">70+</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="form-select"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Data Quality</label>
            <select
              value={form.dataQuality}
              onChange={(e) => setForm({ ...form, dataQuality: e.target.value })}
              className="form-select"
            >
              <option value="">Any Quality</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Format</label>
            <select
              value={form.format}
              onChange={(e) => setForm({ ...form, format: e.target.value })}
              className="form-select"
            >
              <option value="">Select format</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button
              onClick={handleSubmitRequest}
              className="btn btn-primary"
            >
              Submit Request
            </button>
            <button
              onClick={() => setModal(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
         </div>
          </div>
        </div>
      )}

      {/* Collaboration Modal */}
      {modal === 'collaboration' && (
        <div className="modal-overlay">
          <div className="modal modal-medium">
            <div className="modal-header">
              <h2>Research Collaboration</h2>
              <button
                onClick={() => setModal(null)}
                className="modal-close"
              >
                <X className="close-icon" />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="info-banner">
                <div className="info-banner-content">
                  <Share2 className="info-banner-icon" />
                  <div>
                    <h3>Collaborate with Global Researchers</h3>
                    <p>
                      Connect with research institutions worldwide to share data, insights, and advance medical science together.
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Building className="form-label-icon" />
                    Institution/Organization
                  </label>
                  <input
                    type="text"
                    value={collaborationForm.institution}
                    onChange={(e) => setCollaborationForm({...collaborationForm, institution: e.target.value})}
                    placeholder="e.g., Stanford Medical Center"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Mail className="form-label-icon" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={collaborationForm.contactEmail}
                    onChange={(e) => setCollaborationForm({...collaborationForm, contactEmail: e.target.value})}
                    placeholder="researcher@institution.edu"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Study Title</label>
                <input
                  type="text"
                  value={collaborationForm.studyTitle}
                  onChange={(e) => setCollaborationForm({...collaborationForm, studyTitle: e.target.value})}
                  placeholder="Enter the title of your collaborative study"
                  className="form-input"
                />
              </div>
              <div className="form-group">
  <label className="form-label">Select Collaborators</label>
  <input
    type="text"
    value={searchCollaborators}
    onChange={(e) => setSearchCollaborators(e.target.value)}
    placeholder="Search collaborators..."
    className="form-input"
  />

  <div className="collaborator-list">
    {collaborators
      .filter(user =>
        user &&
        user.name &&
        user.email &&
        user.role &&
        (user.role === 'provider' || user.role === 'researcher') &&
        user.name.toLowerCase().includes(searchCollaborators.trim().toLowerCase())
      )
      .map(user => {
        const { name, email, role } = user;

        return (
          <label key={email} className="checkbox-item">
           <input
  type="checkbox"
  name={`collab-${email}`}
  checked={(collaborationForm.collaborators || []).includes(user.email)}
  onChange={() => toggleCollaborator(email)}
  className="checkbox-input"
/>
            <span className="checkbox-label">{name} ({role})</span>
          </label>
        );
      })}
  </div>
</div>


              <div className="form-group">
                <label className="form-label">Data Types of Interest</label>
                <div className="checkbox-grid">
                  {['Cardiovascular', 'Diabetes', 'Mental Health', 'Oncology', 'Neurology', 'Respiratory'].map((type) => (
                    <label key={type} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={collaborationForm.dataTypes.includes(type)}
                        onChange={() => toggleDataType(type)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Collaboration Message</label>
                <textarea
                  rows={4}
                  value={collaborationForm.message}
                  onChange={(e) => setCollaborationForm({...collaborationForm, message: e.target.value})}
                  placeholder="Describe your research goals, collaboration objectives, and how this partnership would benefit both parties..."
                  className="form-textarea"
                />
              </div>

              <div className="info-box">
                <h4>What happens next?</h4>
                <ul>
                  <li>• Our team will review your collaboration request</li>
                  <li>• We'll connect you with relevant researchers in your field</li>
                  <li>• You'll receive a response within 2-3 business days</li>
                  <li>• Data sharing agreements will be established if approved</li>
                </ul>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setModal(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCollaborationSubmit}
                  disabled={!collaborationForm.institution || !collaborationForm.contactEmail || !collaborationForm.studyTitle}
                  className="btn-primary btn-with-icon"
                >
                  <Send className="btn-icon" />
                  <span>Send Collaboration Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* New Study Modal */}
{modal === 'newStudy' && (
  <div className="modal-overlay">
    <div className="modal modal-medium">
      <div className="modal-header">
        <h2>Create New Study</h2>
        <button
          onClick={() => setModal(null)}
          className="modal-close"
        >
          <X className="close-icon" />
        </button>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Study Title</label>
          <input
            id="study-title"
            type="text"
            placeholder="Enter study title"
            className="form-input"
            value={newStudyForm.title}
            onChange={(e) => setNewStudyForm({ ...newStudyForm, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            id="study-description"
            rows={4}
            placeholder="Describe your research study..."
            className="form-textarea"
            value={newStudyForm.description}
            onChange={(e) => setNewStudyForm({ ...newStudyForm, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Target Participants</label>
            <input
              id="study-participants"
              type="number"
              placeholder="1000"
              className="form-input"
              value={newStudyForm.participants}
              onChange={(e) => setNewStudyForm({ ...newStudyForm, participants: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <select
              id="study-duration"
              className="form-select"
              value={newStudyForm.duration}
              onChange={(e) => setNewStudyForm({ ...newStudyForm, duration: e.target.value })}
            >
              <option>3 months</option>
              <option>6 months</option>
              <option>1 year</option>
              <option>2 years</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => setModal(null)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={!newStudyForm.title || !newStudyForm.description}
            onClick={() => {
              const newStudy = {
                id: Date.now().toString(),
                title: newStudyForm.title,
                description: newStudyForm.description,
                participants: newStudyForm.participants,
                duration: newStudyForm.duration,
                compensation: Math.floor(Math.random() * 10 + 1),
                status: 'active',
                createdAt: new Date().toISOString()
              };

              const updatedStudies = [newStudy, ...createdStudies];
              setCreatedStudies(updatedStudies);
              localStorage.setItem('createdStudies', JSON.stringify(updatedStudies));

              // Reset form & close modal
              setNewStudyForm({
                title: '',
                description: '',
                participants: '',
                duration: '6 months'
              });
              setModal(null);
            }}
          >
            Create Study
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ResearcherDashboard;