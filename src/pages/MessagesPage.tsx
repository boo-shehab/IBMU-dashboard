import { useEffect, useState } from 'react';
import Card from '../components/Card';
import MessageModal from '../components/MessageModal';
import { collection, getDocs, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FaEye } from 'react-icons/fa';
import Button from '../components/Button';

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
  const [isRespondLoading, setIsRespondLoading] = useState(false)
  const [isMarkAsReadLoading, setIsMarkAsReadLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all');

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

  const handleRespond = async () => {
    if (selectedMessage) {
      setIsRespondLoading(true)
      try {
        await updateDoc(doc(db, 'Message', selectedMessage.id), { 
          status: 'responded'
        });

        setMessages((prevMessages) =>
          prevMessages.map(msg =>
            msg.id === selectedMessage.id ? { ...msg, data: { ...msg.data, status: 'responded' } } : msg
          )
        );

        closeModal();
      } catch (error) {
        console.error('Error responding to message:', error);
      }finally{
        setIsRespondLoading(false)
      }
    }
  };

  const handleMarkAsRead = async () => {
    if (selectedMessage) {
      setIsMarkAsReadLoading(true)
      try {
        await updateDoc(doc(db, 'Message', selectedMessage.id), { 
          status: 'read'
        });
        setMessages((prevMessages) =>
          prevMessages.map(msg =>
            msg.id === selectedMessage.id ? { ...msg, data: { ...msg.data, status: 'read' } } : msg
          )
        );

        alert(`Marked ${selectedMessage.data.title} as read`);
        closeModal();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }finally {
        setIsMarkAsReadLoading(false)
      }
    }
  };

  const handleDelete = async () => {
    if (selectedMessage) {
      setIsDeleteLoading(true)
      try {
        await deleteDoc(doc(db, 'Message', selectedMessage.id));
        setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== selectedMessage.id));
        alert(`Deleted message from ${selectedMessage.data.name}`);
        closeModal();
      } catch (error) {
        console.error('Error deleting message:', error);
      }finally {
        setIsDeleteLoading(false)
      }
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === 'all') return true;
    return message.data.status === filter;
  });

  return (
    <div>
      <div className="pageHeader flex items-center justify-between">
        <h1>{filteredMessages.length} messages</h1>
        <div>
          <label htmlFor="statusFilter" className="mr-2 font-bold">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'new' | 'read' | 'responded')}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <Card
              key={message.id}
              title={message.data.title}
              date={message.data.timestamp.toDate().toLocaleString()}
              icon={<FaEye className={`mr-1 ${message.data.status === 'new' ? 'text-blue-500' : message.data.status === 'read' ? 'text-green-500' : 'text-yellow-500'}`} />}
              description={message.data.content}
              onViewDetails={() => handleViewDetails(message)}
            />
          ))
        ) : (
          <p>No news found. You might want to check again later!</p>
        )}
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={selectedMessage ? { ...selectedMessage.data, timestamp: selectedMessage.data.timestamp.toDate().toLocaleString() } : null}
      >
          <Button isLoading={isRespondLoading} disabled={isMarkAsReadLoading || isDeleteLoading} onClick={handleRespond} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Respond
          </Button>
          <Button isLoading={isMarkAsReadLoading} disabled={isRespondLoading || isDeleteLoading} onClick={handleMarkAsRead} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Mark as Read
          </Button>
          <Button isLoading={isDeleteLoading} disabled={isRespondLoading || isMarkAsReadLoading} onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </Button>
      </MessageModal>
    </div>
  );
};

export default MessagesPage;
