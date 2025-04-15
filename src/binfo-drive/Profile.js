import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import Sidebar from './Sidebar';
import SkeletonLoader from './SkeletonLoader';
import './Profile.css';

export default function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [storageStats, setStorageStats] = useState({
    used: 0,
    total: 15 * 1024 * 1024 * 1024, // 15GB in bytes
    filesCount: 0,
    foldersCount: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          // Simulate loading time
          setTimeout(async () => {
            // In a real app, you would fetch this data from Firestore
            const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
            
            if (userDoc.exists) {
              setUserData(userDoc.data());
            } else {
              // Create a default user profile if it doesn't exist
              const defaultUserData = {
                displayName: currentUser.displayName || 'User',
                email: currentUser.email,
                photoURL: currentUser.photoURL || 'https://via.placeholder.com/150',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
              };
              
              await firestore.collection('users').doc(currentUser.uid).set(defaultUserData);
              setUserData(defaultUserData);
            }
            
            // Fetch storage stats
            const filesSnapshot = await firestore.collection('files')
              .where('userId', '==', currentUser.uid)
              .get();
              
            const foldersSnapshot = await firestore.collection('folders')
              .where('userId', '==', currentUser.uid)
              .get();
              
            let totalSize = 0;
            filesSnapshot.forEach(doc => {
              const fileData = doc.data();
              totalSize += fileData.size || 0;
            });
            
            setStorageStats({
              used: totalSize,
              total: 15 * 1024 * 1024 * 1024, // 15GB in bytes
              filesCount: filesSnapshot.size,
              foldersCount: foldersSnapshot.size
            });
            
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateStoragePercentage = () => {
    return Math.min(100, Math.round((storageStats.used / storageStats.total) * 100));
  };

  return (
    <div className="app-container">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content-with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="profile-container">
          <div className="profile-header">
            <h1>Profile</h1>
          </div>
          
          {loading ? (
            <div className="profile-content">
              <SkeletonLoader type="list" count={3} />
            </div>
          ) : (
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-avatar">
                  <img src={userData?.photoURL} alt={userData?.displayName} />
                </div>
                <div className="profile-info">
                  <h2>{userData?.displayName}</h2>
                  <p className="profile-email">{userData?.email}</p>
                  <p className="profile-joined">Joined {new Date(userData?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="storage-card">
                <h3>Storage</h3>
                <div className="storage-bar-container">
                  <div 
                    className="storage-bar" 
                    style={{ width: `${calculateStoragePercentage()}%` }}
                  ></div>
                </div>
                <div className="storage-details">
                  <p>{formatBytes(storageStats.used)} of {formatBytes(storageStats.total)} used</p>
                  <p>{storageStats.filesCount} files, {storageStats.foldersCount} folders</p>
                </div>
              </div>
              
              <div className="activity-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">📁</div>
                    <div className="activity-content">
                      <p className="activity-title">Created a new folder</p>
                      <p className="activity-time">Today</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📄</div>
                    <div className="activity-content">
                      <p className="activity-title">Uploaded a document</p>
                      <p className="activity-time">Yesterday</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">🔄</div>
                    <div className="activity-content">
                      <p className="activity-title">Shared a file</p>
                      <p className="activity-time">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 