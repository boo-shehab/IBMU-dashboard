import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaCalendarAlt, FaEnvelope, FaNewspaper } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [eventsCount, setEventsCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [newsData, setNewsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      setEventsCount(eventsSnapshot.size);
      const eventsArray = eventsSnapshot.docs.map((doc) => doc.data());
      setEventsData(eventsArray);
    };

    const fetchNews = async () => {
      const newsSnapshot = await getDocs(collection(db, 'news'));
      setNewsCount(newsSnapshot.size);
      const newsArray = newsSnapshot.docs.map((doc) => doc.data());
      setNewsData(newsArray);
    };

    const fetchMessages = async () => {
      const messagesSnapshot = await getDocs(collection(db, 'Message'));
      setMessagesCount(messagesSnapshot.size);
    };

    fetchEvents();
    fetchNews();
    fetchMessages();
  }, []);

  const eventsGroupedByDate = eventsData.reduce((acc, event) => {
    const eventTime = event.eventTime;

    const eventDate = eventTime instanceof Date ? eventTime : eventTime.toDate();

    const formattedDate = eventDate.toLocaleDateString();

    acc[formattedDate] = (acc[formattedDate] || 0) + 1;
    return acc;
  }, {});

  const eventsLineChartData = {
    labels: Object.keys(eventsGroupedByDate),
    datasets: [
      {
        label: 'Events Over Time',
        data: Object.values(eventsGroupedByDate),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const newsBarChartData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
    ],
    datasets: [
      {
        label: 'News per Month',
        data: newsData.reduce((acc, newsItem) => {
          const createdAt = newsItem.createdAt;
          const newsDate = createdAt instanceof Date ? createdAt : createdAt.toDate();
          const month = newsDate.getMonth();
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, Array(12).fill(0)),
        backgroundColor: 'rgba(255,99,132,0.6)',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="info-section grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="icon mb-2 text-blue-500">
            <FaCalendarAlt className="w-8 h-8" /> 
          </div>
          <div className="text-2xl font-bold">{eventsCount}</div>
          <div className="text-gray-600">Total Events</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="icon mb-2 text-green-500">
            <FaNewspaper className="w-8 h-8" />
          </div>
          <div className="text-2xl font-bold">{newsCount}</div>
          <div className="text-gray-600">Total News & Research</div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="icon mb-2 text-red-500">
            <FaEnvelope className="w-8 h-8" />
          </div>
          <div className="text-2xl font-bold">{messagesCount}</div>
          <div className="text-gray-600">Total Messages</div>
        </div>
      </div>

      <div className="charts-section grid grid-cols-1 gap-6">
        <div className="chart">
          <h3 className="text-xl font-semibold mb-4">Events Over Time</h3>
          <Line data={eventsLineChartData} />
        </div>
        <div className="chart">
          <h3 className="text-xl font-semibold mb-4">News per Month</h3>
          <Bar data={newsBarChartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
