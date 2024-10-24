import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { GrCloudUpload } from "react-icons/gr";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { db } from '../firebaseConfig.ts';
import Button from '../components/Button.tsx';
import { toast } from 'react-toastify';

interface AboutUsData {
  goals: {
    content: { ar: string; en: string };
    title: { ar: string; en: string };
  };
  img: string;
  message: {
    content: { ar: string; en: string };
    title: { ar: string; en: string };
  };
  pdf: string;
  subtitle: {
    ar: string;
    en: string;
  };
  title: { ar: string; en: string };
  values: {
    content: { ar: string; en: string };
    title: { ar: string; en: string };
  };
  vision: {
    content: { ar: string; en: string };
    title: { ar: string; en: string };
  };
}

const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [originalData, setOriginalData] = useState<AboutUsData | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [isEnglish, setIsEnglish] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newPdf, setNewPdf] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAboutUsData = async () => {
    const querySnapshot = await getDocs(collection(db, 'aboutUs'));
    querySnapshot.forEach((doc) => {
      setAboutUsData(doc.data() as AboutUsData);
      setOriginalData(doc.data() as AboutUsData);
      setDocId(doc.id);
      
    });
  };
  useEffect(() => {
    fetchAboutUsData().catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const toggleLanguage = () => setIsEnglish(!isEnglish);

  const handleEditToggle = () => setEditing(!editing);
  useEffect(() => {
      
      if (!editing && originalData) {
        setAboutUsData(originalData);
        setNewImage(null);
        setNewPdf(null);
    }
}, [editing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    section: string,
    lang: string
) => {
    if (aboutUsData) {
        setAboutUsData((prevData: any) => ({
            ...prevData,
            [section]: section === 'subtitle' 
                ? { ...prevData[section], [lang]: e.target.value }
                : {
                    ...prevData[section],
                    content: {
                        ...prevData[section].content,
                        [lang]: e.target.value,
                    },
                },
        }));
    }
};


  const storage = getStorage();

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };
  
  const uploadPdf = async (file: File) => {
    const storageRef = ref(storage, `pdfs/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImage(e.target.files[0]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPdf(e.target.files[0]);
    }
  };const handleSave = async () => {
    if (aboutUsData && docId) {
      setIsLoading(true)
        try {
            const updatedData = { ...aboutUsData };

            
            if (newImage) {
                await deleteFile(aboutUsData.img); 
                const imageUrl = await uploadImage(newImage);
                updatedData.img = imageUrl; 
            }

            
            if (newPdf) {
                await deleteFile(aboutUsData.pdf);
                const pdfUrl = await uploadPdf(newPdf);
                updatedData.pdf = pdfUrl; 
            }

            const docRef = doc(db, 'aboutUs', docId);
            await updateDoc(docRef, updatedData);

            setNewImage(null);
            setNewPdf(null);
            setEditing(false);

            await fetchAboutUsData();
            toast.success("About union has been updated successfully")

        } catch (error) {
            console.error('Error updating document: ', error);
            toast.error("error the About Union hasn't been updated")
        }finally{
          setIsLoading(false)
        }
    }
};
const deleteFile = async (fileUrl: string) => {
    const fileRef = ref(storage, fileUrl);
    try {
        await deleteObject(fileRef);
        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">About Union</h1>
        <div className="space-x-4">
          <button onClick={toggleLanguage} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Switch to {isEnglish ? 'Arabic' : 'English'}
          </button>
          <button onClick={handleEditToggle} className="px-4 py-2 bg-green-500 text-white rounded-md">
            {editing ? 'Cancel Edit' : 'Edit Information'}
          </button>
        </div>
      </div>

      {aboutUsData ? (
        <div className="space-y-8">
          
          <EditableSection
          title={isEnglish ? aboutUsData.title.en : aboutUsData.title.ar}
          content={isEnglish ? aboutUsData.subtitle.en : aboutUsData.subtitle.ar}
          img={aboutUsData.img}
          isEnglish={isEnglish}
          editing={editing}
          newImage={newImage}
          onChange={(e) => handleChange(e, 'subtitle', isEnglish ? 'en' : 'ar')}
          onImageChange={handleImageChange}
        />
        <EditableSection
        title={isEnglish ? aboutUsData.message.title.en : aboutUsData.message.title.ar}
        content={isEnglish ? aboutUsData.message.content.en : aboutUsData.message.content.ar}
        isEnglish={isEnglish}
        editing={editing}
        onChange={(e) => handleChange(e, 'message', isEnglish ? 'en' : 'ar')}
      />
        
          <EditableSection
            title={isEnglish ? 'Iraqi Businessmen Union Book' : 'كتاب اتحاد رجال الاعمال العراقيين'}
            editing={editing}
            isEnglish={isEnglish}
            pdf={aboutUsData.pdf}
            newPdf={newPdf}
            onPdfChange={handlePdfChange}
          />
          <EditableSection
            title={isEnglish ? aboutUsData.goals.title.en : aboutUsData.goals.title.ar}
            content={isEnglish ? aboutUsData.goals.content.en : aboutUsData.goals.content.ar}
            isEnglish={isEnglish}
            editing={editing}
            onChange={(e) => handleChange(e, 'goals', isEnglish ? 'en' : 'ar')}
          />
          <EditableSection
            title={isEnglish ? aboutUsData.values.title.en : aboutUsData.values.title.ar}
            content={isEnglish ? aboutUsData.values.content.en : aboutUsData.values.content.ar}
            isEnglish={isEnglish}
            editing={editing}
            onChange={(e) => handleChange(e, 'values', isEnglish ? 'en' : 'ar')}
          />
          <EditableSection
            title={isEnglish ? aboutUsData.vision.title.en : aboutUsData.vision.title.ar}
            content={isEnglish ? aboutUsData.vision.content.en : aboutUsData.vision.content.ar}
            isEnglish={isEnglish}
            editing={editing}
            onChange={(e) => handleChange(e, 'vision', isEnglish ? 'en' : 'ar')}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {editing && (
        <Button isLoading={isLoading} onClick={handleSave} className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-md">
          Save Changes
        </Button>
      )}
    </div>
  );
};
const EditableSection = ({
    title,
    content,
    img,
    pdf,
    isEnglish,
    newImage,
    newPdf,
    editing,
    onChange,
    onPdfChange,
    onImageChange,
  }: {
    title: string;
    content?: string;
    img?: string;
    pdf?: string;
    newImage?: File | null;
    newPdf?: File | null;
    isEnglish: boolean;
    editing: boolean;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onPdfChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {editing && content ? (
        <textarea
          className="w-full h-[10rem] resize-none overflow-y-auto border p-2"
          value={content}
          onChange={onChange}
        />
      ) : (
        <p className="text-gray-700 mb-4">{content}</p>
      )}
      {img && (
        <>
          <img src={img} alt={title} className="max-w-full h-auto mb-4 w-full" /> {}
          {editing && (<div className="flex items-center justify-center">
            <label
            className={`flex items-center px-4 py-2 rounded-full cursor-pointer ${
                newImage ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            } text-white`}
            >
            {newImage ? <AiOutlineCheckCircle className="mr-2" /> : <GrCloudUpload className="mr-2" />}
            <span>{newImage ? "image selected" : "Choose image"}</span>
            <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
            />
            </label>
        </div>
)}
        </>
      )}
      {pdf && (
        <>
          <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Open PDF
          </a>
          {editing && (
            <div className="flex items-center justify-center mt-2">
            <label
                className={`flex items-center px-4 py-2 rounded-full cursor-pointer ${
                    newPdf ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                } text-white`}
            >
                {newPdf ? <AiOutlineCheckCircle className="mr-2" /> : <GrCloudUpload className="mr-2" />}
                <span>{newPdf ? "PDF selected" : "Choose PDF"}</span>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={onPdfChange}
                    className="hidden"
                />
            </label>
        </div>
          )}
        </>
      )}
    </div>
  );
  
export default AboutUs;
