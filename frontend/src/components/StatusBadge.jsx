import React from 'react';

const statusMap = {
  'Filed': 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  'Hearing': 'bg-purple-50 text-purple-700',
  'Closed': 'bg-gray-100 text-gray-600',
  'pending': 'bg-amber-50 text-amber-700',
  'confirmed': 'bg-emerald-50 text-emerald-700',
  'rejected': 'bg-red-50 text-red-600',
  'completed': 'bg-blue-50 text-blue-700',
  'cancelled': 'bg-gray-100 text-gray-600',
  'active': 'bg-emerald-50 text-emerald-700',
  'blocked': 'bg-red-50 text-red-600',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge-status ${statusMap[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
