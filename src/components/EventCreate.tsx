import React, { useState, useEffect } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from './Button';

interface EventCreateProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: { id: string; data: any }; // Pass the event to edit if available
}


const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    [{ 'direction': 'rtl' }],
    [{
      'color': ['#F00', '#0F0', '#00F', '#000', '#FFF']
    }]
  ],
}

const EventCreate = ({ isOpen, onClose, eventToEdit }: EventCreateProps) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [locationTextEn, setLocationTextEn] = useState('');
  const [locationTextAr, setLocationTextAr] = useState('');
  const [isLoading, setIsLoading ] = useState<boolean>(false)
  const [img, setImg] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      console.log(eventToEdit);
      setTitleEn(eventToEdit.data.title.en);
      setTitleAr(eventToEdit.data.title.ar);
      setDescriptionEn(eventToEdit.data.description.en);
      setDescriptionAr(eventToEdit.data.description.ar);
      setEventTime(eventToEdit.data.eventTime.toDate().toISOString().slice(0, 16));
      setLocationLink(eventToEdit.data.locationLink);
      setLocationTextEn(eventToEdit.data.locationText.en);
      setLocationTextAr(eventToEdit.data.locationText.ar);
      setImg(eventToEdit.data.img);
    } else {
      setTitleEn('');
      setTitleAr('');
      setDescriptionEn('');
      setDescriptionAr('');
      setEventTime('');
      setLocationLink('');
      setLocationTextEn('');
      setLocationTextAr('');
      setImg('');
    }
  }, [eventToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true)
      const eventData = {
        title: { en: titleEn, ar: titleAr },
        description: { en: descriptionEn, ar: descriptionAr },
        eventTime: Timestamp.fromDate(new Date(eventTime)),
        locationLink,
        locationText: { en: locationTextEn, ar: locationTextAr },
        img,
      };

      if (eventToEdit) {
        await setDoc(doc(db, 'events', eventToEdit.id), eventData);
      } else {
        await setDoc(doc(db, 'events', Date.now().toString()), eventData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }finally {
      setIsLoading(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-9/12 h-3/4 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">{eventToEdit ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-4">
            <div className='w-full'>
              <label className="block text-gray-700">Title (English)</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
            <div className='w-full'>
              <label className="block text-gray-700">Title (Arabic)</label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
          </div>
          <div className='mb-4 flex gap-4'>
            <div className="w-full">
              <label className="block text-gray-700">Event Time</label>
              <input
                type="datetime-local"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Location Link</label>
              <input
                type="url"
                value={locationLink}
                onChange={(e) => setLocationLink(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-full">
              <label className="block text-gray-700">Location Text (English)</label>
              <input
                type="text"
                value={locationTextEn}
                onChange={(e) => setLocationTextEn(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Location Text (Arabic)</label>
              <input
                type="text"
                value={locationTextAr}
                onChange={(e) => setLocationTextAr(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description (English)</label>
            <ReactQuill
              value={descriptionEn}
              modules={modules}
              onChange={setDescriptionEn}
              className="w-full h-[10rem]  pb-10"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description (Arabic)</label>
            <ReactQuill
              value={descriptionAr}
              modules={modules}
              onChange={setDescriptionAr}
              className="w-full h-[10rem] pb-10"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="w-full resize-none overflow-y-auto border p-2"
            />
          </div>
          <div className="flex justify-end">
            <button disabled={isLoading} type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <Button isLoading={isLoading} type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {eventToEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreate;
