import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { collection, getDocs, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FaEye } from 'react-icons/fa';
import NewsCreate from '../components/NewsCreate';

interface News {
    content: {ar: string, en: string},
    title: {ar: string, en: string},
    date: Timestamp,
    img: string
    category: string
}
const NewsAndResearch = () => {
    const [news, setNews] = useState<{ id: string; data: News }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newsToEdit, setNewsToEdit] = useState<any | null>(null);
  
    const getNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const fetchedNews: { id: string; data: News }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as News; 
          const id = doc.id; 
          fetchedNews.push({ id, data });
        });
        setNews(fetchedNews);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    useEffect(() => {
      getNews().catch((error) => {
        console.error('Error fetching data:', error);
      });
    }, []);
    
  const handleCreate = () => {
    setNewsToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: any) => {
    setNewsToEdit({...event}); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewsToEdit(null); 
    getNews();
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'news', id));
        setNews((prevNews) => prevNews.filter((newsItem) => newsItem.id !== id));
    } catch (error) {
        console.error('Error deleting news:', error);
    }
};
    return (
      <div>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Events</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New News
        </button>
      </header>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {news.length > 0 ? (
            news.map((data) => (
              <Card
                key={data.id}
                title={data.data.title.en}
                image={data.data.img}
                date={data.data.date.toDate().toLocaleString()}
                icon={<FaEye className={`mr-1 text-yellow-500`} />}
                description={<div className="default-styles" dangerouslySetInnerHTML={{ __html: data.data.content.en}} />}
                onViewDetails={() => handleEdit(data)}
              >
                <button onClick={() => handleDelete(data.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Delete
                </button>
              </Card>
            ))
          ) : (
            <p>No messages found. You might want to check again later!</p>
          )}
        </div>
        
      <NewsCreate
        isOpen={isModalOpen} 
        onClose={closeModal} 
        newsToEdit={newsToEdit} 
      />
      </div>
    );
}

export default NewsAndResearch
