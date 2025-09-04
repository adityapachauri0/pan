import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaUsers, 
  FaChartLine, 
  FaCheckCircle,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaClock,
  FaTrash,
  FaEdit,
  FaEye,
  FaDownload,
  FaSync,
  FaExclamationCircle
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Submission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'contacted' | 'converted' | 'archived';
  createdAt: string;
  timeAgo: string;
  ipAddress?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
  notes?: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSubmissions();
  }, [navigate, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5010'}/api/contact/submissions`,
        {
          params: { status: statusFilter, search: searchTerm },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        setSubmissions(response.data.submissions);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5010'}/api/contact/submissions/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Status updated successfully');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5010'}/api/contact/submissions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Submission deleted');
        fetchSubmissions();
      } catch (error) {
        toast.error('Failed to delete submission');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setNotes(submission.notes || '');
    setShowModal(true);
    
    // Mark as read if it's new
    if (submission.status === 'new') {
      handleStatusChange(submission._id, 'read');
    }
  };

  const handleSaveNotes = async () => {
    if (selectedSubmission) {
      try {
        await axios.patch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5010'}/api/contact/submissions/${selectedSubmission._id}/notes`,
          { notes },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Notes saved');
        fetchSubmissions();
        setShowModal(false);
      } catch (error) {
        toast.error('Failed to save notes');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5010'}/api/contact/submissions/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Convert to CSV
      const csvContent = convertToCSV(response.data.data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      toast.error('Failed to export submissions');
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date', 'IP', 'Location'];
    const rows = data.map(item => [
      item.name,
      item.email,
      item.subject,
      item.message,
      item.status,
      new Date(item.createdAt).toLocaleString(),
      item.ipAddress || '',
      item.location ? `${item.location.city || ''}, ${item.location.country || ''}` : ''
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return '#ef4444';
      case 'read': return '#f59e0b';
      case 'contacted': return '#3b82f6';
      case 'converted': return '#10b981';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(submissions.map(s => s._id)));
    } else {
      setSelectedIds(new Set());
    }
    setShowBulkActions(checked);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
    setShowBulkActions(newSelectedIds.size > 0);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} submission(s)?`)) {
      try {
        const promises = Array.from(selectedIds).map(id =>
          axios.delete(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5010'}/api/contact/submissions/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
        );
        
        await Promise.all(promises);
        toast.success(`Successfully deleted ${selectedIds.size} submission(s)`);
        setSelectedIds(new Set());
        setShowBulkActions(false);
        fetchSubmissions();
      } catch (error) {
        console.error('Error deleting submissions:', error);
        toast.error('Failed to delete some submissions');
      }
    }
  };

  const handleBulkExport = () => {
    const selectedSubmissions = submissions.filter(s => selectedIds.has(s._id));
    if (selectedSubmissions.length === 0) return;
    
    const csv = convertToCSV(selectedSubmissions);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-submissions-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${selectedSubmissions.length} submission(s)`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            Dashboard
          </h1>
          <p style={{ color: '#718096', marginTop: '4px' }}>
            Manage your contact submissions
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            style={{
              padding: '10px 20px',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaDownload /> Export
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchSubmissions}
            style={{
              padding: '10px 20px',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaSync /> Refresh
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </div>
      </header>

      {/* Stats Cards */}
      <div style={{
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px'
      }}>
        {[
          { label: 'Total Submissions', value: stats.total, icon: FaEnvelope, color: '#667eea' },
          { label: 'New', value: stats.new, icon: FaExclamationCircle, color: '#ef4444' },
          { label: 'Contacted', value: stats.contacted, icon: FaUsers, color: '#3b82f6' },
          { label: 'Converted', value: stats.converted, icon: FaCheckCircle, color: '#10b981' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: `linear-gradient(135deg, ${stat.color}22 0%, ${stat.color}11 100%)`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon style={{
                fontSize: '28px',
                color: stat.color
              }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a202c',
                margin: 0
              }}>
                {stat.value}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
            {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleBulkExport}
              style={{
                padding: '8px 16px',
                background: 'white',
                border: 'none',
                borderRadius: '6px',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaDownload /> Export Selected
            </button>
            <button
              onClick={handleBulkDelete}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaTrash /> Delete Selected
            </button>
            <button
              onClick={() => {
                setSelectedIds(new Set());
                setShowBulkActions(false);
              }}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid white',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div style={{
        padding: '0 40px 20px',
        display: 'flex',
        gap: '16px'
      }}>
        <div style={{
          flex: 1,
          position: 'relative'
        }}>
          <FaSearch style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#a0aec0'
          }} />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && fetchSubmissions()}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            border: '2px solid #e2e8f0',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Submissions Table */}
      <div style={{
        padding: '0 40px 40px',
        overflowX: 'auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
        }}>
          {loading ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#718096'
            }}>
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#718096'
            }}>
              No submissions found
            </div>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568', width: '50px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === submissions.length && submissions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#667eea'
                      }}
                    />
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Subject</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Time</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>IP Address</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Location</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <motion.tr
                    key={submission._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f7fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(submission._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectOne(submission._id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#667eea'
                        }}
                      />
                    </td>
                    <td style={{ padding: '16px', color: '#2d3748' }}>
                      {submission.name}
                    </td>
                    <td style={{ padding: '16px', color: '#718096' }}>
                      {submission.email}
                    </td>
                    <td style={{ padding: '16px', color: '#718096' }}>
                      {submission.subject}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select
                        value={submission.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(submission._id, e.target.value);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: getStatusBadgeColor(submission.status),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', color: '#718096', fontSize: '14px' }}>
                      <FaClock style={{ marginRight: '6px', fontSize: '12px' }} />
                      {submission.timeAgo}
                    </td>
                    <td style={{ padding: '16px', color: '#718096', fontSize: '13px', fontFamily: 'monospace' }}>
                      {submission.ipAddress || 'Unknown'}
                    </td>
                    <td style={{ padding: '16px', color: '#718096', fontSize: '14px' }}>
                      {submission.location?.city || 'Local'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(submission);
                          }}
                          style={{
                            padding: '8px',
                            background: '#3b82f6',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(submission._id);
                          }}
                          style={{
                            padding: '8px',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedSubmission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '40px'
            }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '24px'
            }}>
              Submission Details
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                Name
              </label>
              <p style={{ fontSize: '16px', color: '#2d3748' }}>{selectedSubmission.name}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                Email
              </label>
              <p style={{ fontSize: '16px', color: '#2d3748' }}>{selectedSubmission.email}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                Subject
              </label>
              <p style={{ fontSize: '16px', color: '#2d3748' }}>{selectedSubmission.subject}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                Message
              </label>
              <p style={{
                fontSize: '16px',
                color: '#2d3748',
                background: '#f7fafc',
                padding: '12px',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedSubmission.message}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                IP Address
              </label>
              <p style={{
                fontSize: '16px',
                color: '#2d3748',
                fontFamily: 'monospace',
                background: '#f7fafc',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                {selectedSubmission.ipAddress || 'Unknown'}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                Location
              </label>
              <p style={{ fontSize: '16px', color: '#2d3748' }}>
                {selectedSubmission.location ? 
                  `${selectedSubmission.location.city}, ${selectedSubmission.location.region}, ${selectedSubmission.location.country}` : 
                  'Unknown'}
              </p>
              {selectedSubmission.location?.lat && (
                <p style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
                  Coordinates: {selectedSubmission.location.lat}, {selectedSubmission.location.lng}
                </p>
              )}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '14px',
                  minHeight: '100px',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#4a5568',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Notes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;