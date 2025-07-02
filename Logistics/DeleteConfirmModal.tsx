import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Card, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { LogisticsPartner } from 'app/logistics/types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  partner: LogisticsPartner | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  partner,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !partner) return null;

  const is961Captains = partner.id === '961_captains';

  // Don't allow deletion of 961 Captains
  if (is961Captains) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cannot Delete</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium mb-2">
                  961 Captains cannot be deleted
                </p>
                <p className="text-gray-600 text-sm">
                  This is the core driver network for 961. You can manage drivers and zones 
                  through the partner details page, but the network itself cannot be removed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Delete Partner</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">
                Are you sure you want to delete "{partner.name}"?
              </p>
              <p className="text-gray-600 text-sm mb-4">
                This action cannot be undone. All partner data, including zones, 
                documents, and delivery history will be permanently removed.
              </p>
              
              {/* Partner Info */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Deliveries:</span>
                      <span className="font-medium">{partner.totalDeliveries.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage Zones:</span>
                      <span className="font-medium">{partner.zones.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{partner.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Partner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;