import { ClipLoader } from 'react-spinners';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean; 
}

const Button = ({ isLoading = false, children, disabled, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center 
        ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} 
        ${props.className}`} 
    >
      {isLoading ? (
        <ClipLoader color="#fff" size={20} />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
