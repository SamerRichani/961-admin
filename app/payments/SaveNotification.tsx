import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SaveNotificationProps {
  isVisible: boolean;
  message: string;
  onHide: () => void;
}

const SaveNotification: React.FC<SaveNotificationProps> = ({
  isVisible,
  message,
  onHide
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-300">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SaveNotification; 