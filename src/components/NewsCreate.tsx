import React, { useState, useEffect } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NewsCreateProps {
  isOpen: boolean;
  onClose: () => void;
  newsToEdit?: { id: string; data: any };
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
};

const NewsCreate: React.FC<NewsCreateProps> = ({ isOpen, onClose, newsToEdit }) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [categoryAr, setCategoryAr] = useState('');
  const [categoryEn, setCategoryEn] = useState('');
  const [date, setDate] = useState('');
  const [img, setImg] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (newsToEdit) {
      setTitleEn(newsToEdit.data.title.en);
      setTitleAr(newsToEdit.data.title.ar);
      setContentEn(newsToEdit.data.content.en);
      setContentAr(newsToEdit.data.content.ar);
      setCategoryAr(newsToEdit.data.category.ar);
      setCategoryEn(newsToEdit.data.category.en);
      setDate(newsToEdit.data.date.toDate().toISOString().slice(0, 16));
      setImg(newsToEdit.data.img);
    } else {
      resetForm();
    }
  }, [newsToEdit]);

  const resetForm = () => {
    setTitleEn('');
    setTitleAr('');
    setContentEn('');
    setContentAr('');
    setCategoryAr('');
    setCategoryEn('');
    setDate('');
    setImg('');
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = img;
    
    if (file) {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const newsData = {
      title: { en: titleEn, ar: titleAr },
      content: { en: contentEn, ar: contentAr },
      category: { ar: categoryAr, en: categoryEn },
      date: Timestamp.fromDate(new Date(date)),
      img: imageUrl,
    };

    try {
      if (newsToEdit) {
        if (img !== imageUrl) {
          const oldImageRef = ref(storage, img);
          await deleteObject(oldImageRef);
        }
        await setDoc(doc(db, 'news', newsToEdit.id), newsData);
      } else {
        await setDoc(doc(db, 'news', Date.now().toString()), newsData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-9/12 h-3/4 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">{newsToEdit ? 'Edit News' : 'Create News'}</h2>
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
          <div className="mb-4 flex gap-4">
            <div className="w-full">
              <label className="block text-gray-700">Category (English)</label>
              <input
                type="text"
                value={categoryEn}
                onChange={(e) => setCategoryEn(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Category (Arabic)</label>
              <input
                type="text"
                value={categoryAr}
                onChange={(e) => setCategoryAr(e.target.value)}
                className="w-full resize-none overflow-y-auto border p-2"
                required
              />
            </div>
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700">Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full resize-none overflow-y-auto border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Content (English)</label>
            <ReactQuill
              value={contentEn}
              modules={modules}
              onChange={setContentEn}
              className="w-full h-[10rem] pb-10"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Content (Arabic)</label>
            <ReactQuill
              value={contentAr}
              modules={modules}
              onChange={setContentAr}
              className="w-full h-[10rem] pb-10"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              value={img}
              onChange={(e) => {
                setImg(e.target.value);
                setFile(null);
              }}
              placeholder="Enter Image URL"
              className="w-full resize-none overflow-y-auto border p-2 mb-2"
            />
            <label className="block text-gray-700">Or Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                  setImg('');
                }
              }}
              className="border p-2"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {newsToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsCreate;
