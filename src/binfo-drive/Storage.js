import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import Sidebar from './Sidebar';
import SkeletonLoader from './SkeletonLoader';
import './Storage.css';

export default function Storage() {
  const { currentUser } = useAuth();
  const [storageStats, setStorageStats] = useState({
    used: 0,
    total: 15 * 1024 * 1024 * 1024, // 15GB in bytes
    filesCount: 0,
    foldersCount: 0,
    fileTypes: {
      documents: 0,
      images: 0,
      videos: 0,
      audio: 0,
      other: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchStorageStats = async () => {
      if (currentUser) {
        try {
          // Simulate loading time
          setTimeout(async () => {
            // In a real app, you would fetch this data from Firestore
            // For now, we'll use mock data
            const mockStorageStats = {
              used: 3.2 * 1024 * 1024 * 1024, // 3.2GB
              total: 15 * 1024 * 1024 * 1024, // 15GB
              filesCount: 42,
              foldersCount: 8,
              fileTypes: {
                documents: 15,
                images: 12,
                videos: 5,
                audio: 3,
                other: 7
              }
            };
            
            setStorageStats(mockStorageStats);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching storage stats:', error);
          setLoading(false);
        }
      }
    };
    
    fetchStorageStats();
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

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'documents':
        return '#4285f4';
      case 'images':
        return '#34a853';
      case 'videos':
        return '#ea4335';
      case 'audio':
        return '#fbbc05';
      default:
        return '#5f6368';
    }
  };

  return (
    <div className="app-container">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content-with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="storage-container">
          <div className="storage-header">
            <h1>Storage</h1>
          </div>
          
          {loading ? (
            <div className="storage-content">
              <SkeletonLoader type="list" count={3} />
            </div>
          ) : (
            <div className="storage-content">
              <div className="storage-overview-card">
                <div className="storage-overview-header">
                  <h2>Storage Overview</h2>
                  <div className="storage-quota">
                    <span>{formatBytes(storageStats.used)}</span>
                    <span>of</span>
                    <span>{formatBytes(storageStats.total)}</span>
                  </div>
                </div>
                <div className="storage-bar-container">
                  <div 
                    className="storage-bar" 
                    style={{ width: `${calculateStoragePercentage()}%` }}
                  ></div>
                </div>
                <div className="storage-stats">
                  <div className="storage-stat">
                    <span className="storage-stat-value">{storageStats.filesCount}</span>
                    <span className="storage-stat-label">Files</span>
                  </div>
                  <div className="storage-stat">
                    <span className="storage-stat-value">{storageStats.foldersCount}</span>
                    <span className="storage-stat-label">Folders</span>
                  </div>
                </div>
              </div>
              
              <div className="storage-details-card">
                <h2>Storage by file type</h2>
                <div className="storage-file-types">
                  {Object.entries(storageStats.fileTypes).map(([type, count]) => (
                    <div key={type} className="storage-file-type">
                      <div 
                        className="storage-file-type-icon"
                        style={{ backgroundColor: getFileTypeColor(type) }}
                      >
                        {type === 'documents' && '📄'}
                        {type === 'images' && '🖼️'}
                        {type === 'videos' && '🎥'}
                        {type === 'audio' && '🎵'}
                        {type === 'other' && '📦'}
                      </div>
                      <div className="storage-file-type-info">
                        <span className="storage-file-type-name">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                        <span className="storage-file-type-count">{count} files</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="storage-tips-card">
                <h2>Storage tips</h2>
                <div className="storage-tips">
                  <div className="storage-tip">
                    <div className="storage-tip-icon">🗑️</div>
                    <div className="storage-tip-content">
                      <h3>Empty your trash</h3>
                      <p>Items in trash still count against your storage quota</p>
                    </div>
                  </div>
                  <div className="storage-tip">
                    <div className="storage-tip-icon">📤</div>
                    <div className="storage-tip-content">
                      <h3>Upload large files</h3>
                      <p>Consider uploading large files in smaller chunks</p>
                    </div>
                  </div>
                  <div className="storage-tip">
                    <div className="storage-tip-icon">🔍</div>
                    <div className="storage-tip-content">
                      <h3>Find large files</h3>
                      <p>Search for files larger than 100MB to free up space</p>
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