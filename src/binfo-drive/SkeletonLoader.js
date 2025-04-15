import React from 'react';
import './SkeletonLoader.css';

export default function SkeletonLoader({ type, count = 1 }) {
  const renderSkeletonItems = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      if (type === 'folder') {
        items.push(
          <div key={`folder-skeleton-${i}`} className="skeleton-item folder-skeleton">
            <div className="skeleton-icon folder-icon-skeleton"></div>
            <div className="skeleton-text"></div>
          </div>
        );
      } else if (type === 'file') {
        items.push(
          <div key={`file-skeleton-${i}`} className="skeleton-item file-skeleton">
            <div className="skeleton-icon file-icon-skeleton"></div>
            <div className="skeleton-text"></div>
          </div>
        );
      } else if (type === 'list') {
        items.push(
          <div key={`list-skeleton-${i}`} className="skeleton-list-item">
            <div className="skeleton-icon list-icon-skeleton"></div>
            <div className="skeleton-list-content">
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
            </div>
          </div>
        );
      }
    }
    return items;
  };

  return (
    <div className={`skeleton-container ${type}-container`}>
      {renderSkeletonItems()}
    </div>
  );
} 