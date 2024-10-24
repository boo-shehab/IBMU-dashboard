import React, { useState, useEffect } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from './Button';

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

const NewsCreate = ({ isOpen, onClose, newsToEdit }: NewsCreateProps) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [categoryAr, setCategoryAr] = useState('');
  const [categoryEn, setCategoryEn] = useState('');
  const [date, setDate] = useState('');
  const [img, setImg] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isImageURL, setIsImageURL] = useState(true); 
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
  const handleChange = (bool: boolean) => {
    setIsImageURL(bool)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = img;
    try {
        setIsLoading(true)
        if (file) {
        const storageRef = ref(storage, `images/news/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        }
        
        
        if(newsToEdit && newsToEdit.data.img !== imageUrl && newsToEdit.data.img.includes('firebasestorage')) {
            const oldImageRef = ref(storage, newsToEdit.data.img);
            await deleteObject(oldImageRef);
        }


        const newsData = {
        title: { en: titleEn, ar: titleAr },
        content: { en: contentEn, ar: contentAr },
        category: { ar: categoryAr, en: categoryEn },
        createdAt: newsToEdit? newsToEdit.data.createdAt : Timestamp.fromDate(new Date(date)),
        date: Timestamp.fromDate(new Date(date)),
        img: imageUrl,
        };

      if (newsToEdit) {
        await setDoc(doc(db, 'news', newsToEdit.id), newsData);
      } else {
        await setDoc(doc(db, 'news', Date.now().toString()), newsData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving news:', error);
    }finally{
        setIsLoading(false)
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
          <div className='flex items-center'>
                <p>add image by </p>
                <div className="ml-3 inline-flex p-1 bg-gray-200 rounded-full">
                    <button type='button' onClick={() => {handleChange(true) }} className={` rounded-full cursor-pointer hover:bg-gray-400 text-gray-700 font-bold py-1 px-5 ${!isImageURL? 'bg-gray-200' : 'bg-gray-300'}`}>
                        URL
                    </button>
                    <button type='button' onClick={() => {handleChange(false) }} className={`rounded-full cursor-pointer hover:bg-gray-400 text-gray-700 font-bold py-1 px-5 ${isImageURL? 'bg-gray-200' : 'bg-gray-300'}`}>
                        file
                    </button>
                </div>
            </div>
          <div className="mb-4">
            {isImageURL? (
                <>
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
                </>
            ): (
                <>
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
                    className="w-full resize-none overflow-y-auto border p-2 mb-2"
                    />
                </>
            )}
          </div>
          <div className="flex justify-end">
            <button disabled={isLoading} type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <Button isLoading={isLoading} type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {newsToEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsCreate;
