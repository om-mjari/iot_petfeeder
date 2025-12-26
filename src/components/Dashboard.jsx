import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Replace the old API import with Firestore service
import { subscribeToSchedules, subscribeToFeedingLogs, createSchedule, deleteSchedule, updateSchedule } from '../services/firestoreService';
import { feedingAPI } from '../services/api';
import './Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  // Update state to handle real-time data
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('control');
  
  // State for editing schedules
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editScheduleData, setEditScheduleData] = useState({
    feedingTime: '',
    portionSize: 'medium',
    isActive: true
  });

  const [newSchedule, setNewSchedule] = useState({
    feedingTime: '',
    portionSize: 'medium'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Set up real-time listeners for schedules and logs
    let unsubscribeSchedules = null;
    let unsubscribeLogs = null;
    
    if (userData) {
      const userId = JSON.parse(userData).id;
      
      // Subscribe to real-time schedule updates
      unsubscribeSchedules = subscribeToSchedules(userId, (updatedSchedules) => {
        console.log('Received schedules:', updatedSchedules);
        setSchedules(updatedSchedules);
      });
      
      // Subscribe to real-time log updates
      unsubscribeLogs = subscribeToFeedingLogs(userId, (updatedLogs) => {
        console.log('Received logs:', updatedLogs);
        setLogs(updatedLogs);
      });
    }
    
    // Clean up subscriptions on unmount
    return () => {
      if (unsubscribeSchedules) unsubscribeSchedules();
      if (unsubscribeLogs) unsubscribeLogs();
    };
  }, []);

  // Mock function for fetching status (would be replaced with real implementation)
  const fetchStatus = async () => {
    // In a real implementation, this would fetch from Firestore or API
    setStatus({
      activeSchedules: schedules.filter(s => s.isActive).length,
      currentTime: new Date().toLocaleTimeString(),
      lastActivity: logs.length > 0 ? logs[0] : null
    });
  };

  // Effect to update status when schedules or logs change
  useEffect(() => {
    fetchStatus();
  }, [schedules, logs]);

  const handleActivateFeeding = async (portionSize = 'medium') => {
    setLoading(true);
    try {
      // Send command to backend API (logging is handled by backend)
      const response = await feedingAPI.activateFeeding({
        portionSize: portionSize
      });
      
      alert(response.message || '🎉 Food dispensed successfully!');
    } catch (error) {
      alert('❌ Failed to activate feeding: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopFeeding = async () => {
    setLoading(true);
    try {
      // Send command to backend API (logging is handled by backend)
      const response = await feedingAPI.stopFeeding();
      
      alert(response.message || '🛑 Feeding stopped');
    } catch (error) {
      alert('❌ Failed to stop feeding: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user && user.id) {
        const scheduleData = {
          ...newSchedule,
          userId: user.id,
          isActive: true,
          repeatDaily: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await createSchedule(scheduleData);
        alert('✅ Schedule created successfully!');
        setNewSchedule({ feedingTime: '', portionSize: 'medium' });
      }
    } catch (error) {
      alert('❌ Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    setLoading(true);
    try {
      await deleteSchedule(id);
      alert('🗑️ Schedule deleted');
    } catch (error) {
      alert('❌ Failed to delete schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSchedule = async (schedule) => {
    setLoading(true);
    try {
      await updateSchedule(schedule.id, {
        isActive: !schedule.isActive,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      alert('❌ Failed to toggle schedule');
    } finally {
      setLoading(false);
    }
  };

  const startEditingSchedule = (schedule) => {
    setEditingSchedule(schedule.id);
    setEditScheduleData({
      feedingTime: schedule.feedingTime,
      portionSize: schedule.portionSize,
      isActive: schedule.isActive
    });
  };

  const cancelEditingSchedule = () => {
    setEditingSchedule(null);
    setEditScheduleData({
      feedingTime: '',
      portionSize: 'medium',
      isActive: true
    });
  };

  const saveEditedSchedule = async () => {
    if (!editingSchedule) return;
    
    setLoading(true);
    try {
      await updateSchedule(editingSchedule, {
        ...editScheduleData,
        updatedAt: new Date().toISOString()
      });
      
      alert('✅ Schedule updated successfully!');
      setEditingSchedule(null);
    } catch (error) {
      alert('❌ Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      // Handle both string and Firestore Timestamp objects
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo">🐾</span>
            <div>
              <h1>Pet Feeder IoT</h1>
              <p>Smart Automated Pet Care</p>
            </div>
          </div>
          
          <div className="user-section">
            <div className="user-info">
              <span className="user-name">👋 {user?.username}</span>
              <span className="pet-name">🐕 {user?.petName || 'My Pet'}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">System Status</span>
          <span className="status-value online">
            <span className="pulse-dot"></span> Online
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Active Schedules</span>
          <span className="status-value">{schedules.filter(s => s.isActive).length}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Current Time</span>
          <span className="status-value">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'control' ? 'active' : ''}`}
          onClick={() => setActiveTab('control')}
        >
          🎮 Control
        </button>
        <button 
          className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedules
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 History
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'control' && (
          <div className="control-section">
            <div className="card control-card">
              <h2>🎯 Manual Control</h2>
              <p>Dispense food immediately with custom portion size</p>
              
              <div className="portion-buttons">
                <button 
                  className="btn-portion small"
                  onClick={() => handleActivateFeeding('small')}
                  disabled={loading}
                >
                  <span className="portion-icon">🍖</span>
                  <span>Small (2s)</span>
                </button>
                <button 
                  className="btn-portion medium"
                  onClick={() => handleActivateFeeding('medium')}
                  disabled={loading}
                >
                  <span className="portion-icon">🍗</span>
                  <span>Medium (4s)</span>
                </button>
                <button 
                  className="btn-portion large"
                  onClick={() => handleActivateFeeding('large')}
                  disabled={loading}
                >
                  <span className="portion-icon">🍔</span>
                  <span>Large (6s)</span>
                </button>
              </div>

              {/* <button 
                className="btn-stop"
                onClick={handleStopFeeding}
                disabled={loading}
              >
                🛑 Emergency Stop
              </button> */}
            </div>

            <div className="card status-card">
              <h2>📡 Real-Time Status</h2>
              {logs.length > 0 ? (
                <div className="last-activity">
                  <div className="activity-item">
                    <span className="activity-label">Last Action:</span>
                    <span className="activity-value">{logs[0].action}</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-label">Status:</span>
                    <span className={`activity-value ${logs[0].status}`}>
                      {logs[0].status}
                    </span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-label">Time:</span>
                    <span className="activity-value">
                      {formatTimestamp(logs[0].timestamp)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="no-data">No recent activity</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-section">
            <div className="card create-schedule-card">
              <h2>➕ Create New Schedule</h2>
              <form onSubmit={handleCreateSchedule} className="schedule-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Feeding Time</label>
                    <input
                      type="time"
                      value={newSchedule.feedingTime}
                      onChange={(e) => setNewSchedule({
                        ...newSchedule,
                        feedingTime: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Portion Size</label>
                    <select
                      value={newSchedule.portionSize}
                      onChange={(e) => setNewSchedule({
                        ...newSchedule,
                        portionSize: e.target.value
                      })}
                    >
                      <option value="small">Small (2s)</option>
                      <option value="medium">Medium (4s)</option>
                      <option value="large">Large (6s)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-create" disabled={loading}>
                  Create Schedule
                </button>
              </form>
            </div>

            <div className="card schedules-list-card">
              <h2>📋 Your Schedules</h2>
              {schedules.length > 0 ? (
                <div className="schedules-list">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="schedule-item">
                      {editingSchedule === schedule.id ? (
                        // Edit mode
                        <div className="schedule-edit-form">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Feeding Time</label>
                              <input
                                type="time"
                                value={editScheduleData.feedingTime}
                                onChange={(e) => setEditScheduleData({
                                  ...editScheduleData,
                                  feedingTime: e.target.value
                                })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Portion Size</label>
                              <select
                                value={editScheduleData.portionSize}
                                onChange={(e) => setEditScheduleData({
                                  ...editScheduleData,
                                  portionSize: e.target.value
                                })}
                              >
                                <option value="small">Small (2s)</option>
                                <option value="medium">Medium (4s)</option>
                                <option value="large">Large (6s)</option>
                              </select>
                            </div>
                          </div>
                          <div className="schedule-edit-actions">
                            <button
                              onClick={saveEditedSchedule}
                              className="btn-save"
                              disabled={loading}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditingSchedule}
                              className="btn-cancel"
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="schedule-info-container">
                          <div className="schedule-info">
                            <span className="schedule-time">⏰ {schedule.feedingTime}</span>
                            <span className="schedule-portion">
                              {schedule.portionSize} portion
                            </span>
                            <span className={`schedule-status ${schedule.isActive ? 'active' : 'inactive'}`}>
                              {schedule.isActive ? '✅ Active' : '⏸️ Paused'}
                            </span>
                          </div>
                          <div className="schedule-actions">
                            <button
                              onClick={() => startEditingSchedule(schedule)}
                              className="btn-edit"
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleSchedule(schedule)}
                              className="btn-toggle"
                              disabled={loading}
                            >
                              {schedule.isActive ? 'Pause' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="btn-delete"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No schedules created yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="card history-card">
              <h2>📜 Feeding History</h2>
              {logs.length > 0 ? (
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Action</th>
                        <th>Portion</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>{formatTimestamp(log.timestamp)}</td>
                          <td>{log.action}</td>
                          <td>{log.portionSize || '-'}</td>
                          <td>
                            <span className={`status-badge ${log.status}`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No feeding history available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;