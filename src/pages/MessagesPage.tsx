import { useEffect, useState } from 'react';
import Card from '../components/Card';
import MessageModal from '../components/MessageModal';
import { collection, getDocs, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Messages {
  email: string;
  name: string;
  phone: string;
  title: string;
  content: string;
  timestamp: Timestamp;
  status?: 'new' | 'read' | 'responded';
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<{ id: string; data: Messages }[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<{ id: string; data: Messages } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getMessages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Message'));
      const fetchedMessages: { id: string; data: Messages }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Messages; 
        const id = doc.id; 
        fetchedMessages.push({ id, data });
      });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    getMessages().catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const handleViewDetails = (message: { id: string; data: Messages }) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Handler for Respond action
  const handleRespond = async () => {
    if (selectedMessage) {
      try {
        // Logic to respond to the message (replace with your implementation)
        alert(`Responding to ${selectedMessage.data.name}`);

        // Update the message document to set status to "responded"
        await updateDoc(doc(db, 'Message', selectedMessage.id), { 
          status: 'responded' // Update status to responded
        });

        // Update local state to reflect the change
        setMessages((prevMessages) =>
          prevMessages.map(msg =>
            msg.id === selectedMessage.id ? { ...msg, data: { ...msg.data, status: 'responded' } } : msg
          )
        );

        closeModal();
      } catch (error) {
        console.error('Error responding to message:', error);
      }
    }
  };

  // Handler for Mark as Read action
  const handleMarkAsRead = async () => {
    if (selectedMessage) {
      try {
        // Update the message document to set status to "read"
        await updateDoc(doc(db, 'Message', selectedMessage.id), { 
          status: 'read' // Update status to read
        });

        // Update local state to reflect the change
        setMessages((prevMessages) =>
          prevMessages.map(msg =>
            msg.id === selectedMessage.id ? { ...msg, data: { ...msg.data, status: 'read' } } : msg
          )
        );

        alert(`Marked ${selectedMessage.data.title} as read`);
        closeModal();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  // Handler for Delete action
  const handleDelete = async () => {
    if (selectedMessage) {
      try {
        await deleteDoc(doc(db, 'Message', selectedMessage.id));
        setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== selectedMessage.id));
        alert(`Deleted message from ${selectedMessage.data.name}`);
        closeModal();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <div>
      <div className="pageHeader flex items-center justify-between">
        <h1>{messages.length} messages</h1>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {messages.length > 0 ? (
          messages.map((message) => (
            <Card
              key={message.id}
              image={undefined}
              title={message.data.title}
              date={message.data.timestamp.toDate().toLocaleString()}
              description={message.data.content}
              onViewDetails={() => handleViewDetails(message)} // Pass the function
            />
          ))
        ) : (
          <p>No messages found.</p>
        )}
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={selectedMessage ? { ...selectedMessage.data, timestamp: selectedMessage.data.timestamp.toDate().toLocaleString() } : null}
      >
        <button onClick={handleRespond} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Respond
        </button>
        <button onClick={handleMarkAsRead} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Mark as Read
        </button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Delete
        </button>
      </MessageModal>
    </div>
  );
};

export default MessagesPage;
