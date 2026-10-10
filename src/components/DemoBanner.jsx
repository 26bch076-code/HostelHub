import React from 'react';
import { Info, RotateCcw } from 'lucide-react';

export default function DemoBanner({ onResetData }) {
  return (
    <div className="demo-top-bar">
      <div className="demo-badge-wrap">
        <span className="demo-chip">DEMO MODE</span>
        <span>
          Sample data loaded in browser <code>localStorage</code>. All changes persist locally on refresh.
        </span>
      </div>
      <button
        onClick={onResetData}
        className="demo-btn-reset"
        title="Reset mock data to initial defaults"
      >
        <RotateCcw size={13} />
        <span>Reset Demo Data</span>
      </button>
    </div>
  );
}
