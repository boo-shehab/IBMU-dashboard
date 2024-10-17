import React from 'react';
import { FaEye } from 'react-icons/fa';

interface CardProps {
  image?: string;
  title?: string;
  date?: string;
  description?: string;
  onViewDetails: () => void;
  children?: React.ReactNode;
}

const Card = ({ image, title, date, description, onViewDetails, children }: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {image && (
        <img
          className="w-full h-48 object-cover"
          src={image}
          alt="Card Image"
        />
      )}
      <div className="p-4">
        {title && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={ onViewDetails} className="text-blue-400">
              <FaEye className="mr-1" />
            </button>

          </div>
        )}
        {date && (
          <p className="text-gray-500 text-sm">{date}</p>
        )}
        {description && (
          <p className="text-gray-700 mt-2">{description}</p>
        )}
        {children && (
          <div className="flex items-center mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
