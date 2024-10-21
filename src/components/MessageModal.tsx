// src/components/MessageModal.tsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  message: {
    title: string;
    email: string;
    name: string;
    phone: string;
    content: string;
    timestamp: string;
  } | null; 
}

const MessageModal = ({ isOpen, onClose, message, children }: MessageModalProps) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
        <div className="flex justify-between items-start	 mb-4">
            <div>
              <h2 className="text-xl font-semibold">send by {message.name}</h2>
              <p className='text-gray-500'>{message.timestamp}</p>
            </div>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-4">
            <div className='flex justify-between items-center mb-4 flex-wrap'>
                <p><strong>Email:</strong> {message.email}</p>
                <p><strong>Phone:</strong> {message.phone}</p>

            </div>
          <p><strong>{message.title}</strong></p>
          <p>{message.content}</p>
        </div>

        <div className="flex justify-end space-x-2">
            {children}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
