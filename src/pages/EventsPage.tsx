import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MdEdit } from "react-icons/md";
import EventCreate from '../components/EventCreate';


interface Event {
  description: { en: string; ar: string };
  eventTime: Timestamp;
  img: string;
  locationLink: string;
  locationText: { en: string; ar: string };
  title: { en: string; ar: string };
}

const EventPage = () => {
  const [events, setEvents] = useState<{ id: string; data: Event }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any | null>(null);

  const getEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const fetchedEvents: { id: string; data: Event }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Event; 
        const id = doc.id; 
        fetchedEvents.push({ id, data });
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    getEvents().catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const handleCreate = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: any) => {
    setEventToEdit({...event}); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventToEdit(null); 
    getEvents();
  };
  return (
    <div>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Events</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Event
        </button>
      </header>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event.id}
              image={event.data.img}
              title={event.data.title.en}
              date={event.data.eventTime.toDate().toLocaleString()}
              icon={<MdEdit className="mr-1 text-yellow-400" />}
              description={<div className="default-styles" dangerouslySetInnerHTML={{ __html: event.data.description.en}}></div>} 
              onViewDetails={() => handleEdit(event)}
            />
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
      <EventCreate
        isOpen={isModalOpen} 
        onClose={closeModal} 
        eventToEdit={eventToEdit} 
      />
    </div>
  );
};

export default EventPage;
