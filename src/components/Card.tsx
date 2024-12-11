import logo from '../assets/logo.jpg'

interface CardProps {
  image?: string;
  title?: string;
  date?: string;
  description?: any;
  onViewDetails: () => void;
  icon?: any
  children?: React.ReactNode;
}

const Card = ({ image, title, date, description, onViewDetails,icon, children}: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {image? (
        <img
          className="w-full h-48 object-cover"
          src={image}
          alt="Card Image"
        />
      ) : (
        <img
          className="w-full h-48 object-contain"
          src={logo}
          alt="Card Image"
        />
      )}
      <div className="p-4">
        {title && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {icon && (
              <button onClick={onViewDetails} >
                {icon}
              </button>
            )}
          </div>
        )}
        {date && (
          <p className="text-gray-500 text-sm">{date}</p>
        )}
        {description && (
          <p className="text-gray-700 mt-2 h-24 overflow-hidden pb-4">{description}</p>
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
