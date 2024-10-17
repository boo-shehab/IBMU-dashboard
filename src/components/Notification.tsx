interface NotificationProps {
  message: string;
}

const Notification = ({ message }: NotificationProps) => {
  return (
    <div className="fixed top-0 right-0 m-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
};

export default Notification;
