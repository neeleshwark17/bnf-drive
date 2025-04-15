import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import Sidebar from './Sidebar';
import SkeletonLoader from './SkeletonLoader';
import './Trash.css';

export default function Trash() {
  const { currentUser } = useAuth();
  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchTrashItems = async () => {
      if (currentUser) {
        try {
          // Simulate loading time
          setTimeout(async () => {
            // In a real app, you would fetch this data from Firestore
            // For now, we'll use mock data
            const mockTrashItems = [
              {
                id: '1',
                name: 'Document.pdf',
                type: 'file',
                deletedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                size: 1024 * 1024 * 2.5, // 2.5MB
                icon: '📄'
              },
              {
                id: '2',
                name: 'Project Folder',
                type: 'folder',
                deletedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                icon: '📁'
              },
              {
                id: '3',
                name: 'Presentation.pptx',
                type: 'file',
                deletedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                size: 1024 * 1024 * 5, // 5MB
                icon: '📊'
              },
              {
                id: '4',
                name: 'Image.jpg',
                type: 'file',
                deletedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
                size: 1024 * 1024 * 1.2, // 1.2MB
                icon: '🖼️'
              }
            ];
            
            setTrashItems(mockTrashItems);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching trash items:', error);
          setLoading(false);
        }
      }
    };
    
    fetchTrashItems();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleRestore = (id) => {
    // In a real app, you would restore the item from trash
    console.log('Restoring item:', id);
    // For now, we'll just remove it from the list
    setTrashItems(trashItems.filter(item => item.id !== id));
  };

  const handleDeleteForever = (id) => {
    // In a real app, you would permanently delete the item
    console.log('Deleting item forever:', id);
    // For now, we'll just remove it from the list
    setTrashItems(trashItems.filter(item => item.id !== id));
  };

  const handleEmptyTrash = () => {
    // In a real app, you would empty the trash
    console.log('Emptying trash');
    // For now, we'll just clear the list
    setTrashItems([]);
  };

  return (
    <div className="app-container">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content-with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="trash-container">
          <div className="trash-header">
            <h1>Trash</h1>
            {trashItems.length > 0 && (
              <button className="empty-trash-button" onClick={handleEmptyTrash}>
                Empty trash
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="trash-content">
              <SkeletonLoader type="list" count={4} />
            </div>
          ) : (
            <div className="trash-content">
              {trashItems.length > 0 ? (
                <div className="trash-list">
                  {trashItems.map(item => (
                    <div key={item.id} className="trash-item">
                      <div className="trash-item-icon">{item.icon}</div>
                      <div className="trash-item-details">
                        <div className="trash-item-name">{item.name}</div>
                        <div className="trash-item-info">
                          {item.type === 'file' && <span>{formatBytes(item.size)}</span>}
                          <span>Deleted {formatDate(item.deletedAt)}</span>
                        </div>
                      </div>
                      <div className="trash-item-actions">
                        <button 
                          className="restore-button"
                          onClick={() => handleRestore(item.id)}
                        >
                          Restore
                        </button>
                        <button 
                          className="delete-forever-button"
                          onClick={() => handleDeleteForever(item.id)}
                        >
                          Delete forever
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-trash-state">
                  <div className="empty-trash-icon">🗑️</div>
                  <h2>Trash is empty</h2>
                  <p>Items you delete will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 