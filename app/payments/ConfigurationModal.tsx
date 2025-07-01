import React from 'react';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSave: (item: any) => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ isOpen, onClose, item, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg min-w-[300px]">
        <h2 className="text-lg font-bold mb-4">Configure Payment Method</h2>
        <p className="mb-4">This is a placeholder modal for configuration.</p>
        <button className="mr-2 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => onSave(item)}>Save</button>
      </div>
    </div>
  );
};

export default ConfigurationModal; 