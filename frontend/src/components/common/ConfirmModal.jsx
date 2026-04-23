import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertCircle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger, primary, success
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl flex-shrink-0 ${
            variant === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 
            variant === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-500' :
            'bg-brand-orange/10 text-brand-orange'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-semibold mb-1">
                Wait a moment
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {message}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1 bg-gray-50 dark:bg-gray-800 border-0" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant} 
            className="flex-1" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
