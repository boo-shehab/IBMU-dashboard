import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig.ts';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 
import Button from '../components/Button.tsx';
import { Bounce, toast } from 'react-toastify';
interface Headquarter {
  email: string;
  embedLocation: string;
  locationLink: string;
  locationText: {
    ar: string;
    en: string;
  };
  phone: string;
  workingTimes: {
    days: {
      ar: string;
      en: string;
    };
    time: {
      ar: string;
      en: string;
    };
  };
}

const ContactInfoPage = () => {
  const [aboutUsData, setAboutUsData] = useState<Headquarter | null>(null);
  const [originalData, setOriginalData] = useState<Headquarter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [docId, setDocId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | undefined>('964');
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); 

  const fetchAboutUsData = async () => {
    const querySnapshot = await getDocs(collection(db, 'Headquarter'));
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Headquarter;
      setAboutUsData(data);
      setOriginalData(data);
      setDocId(doc.id);
      setPhone(data.phone);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (aboutUsData) {
      setAboutUsData({ ...aboutUsData, [e.target.name]: e.target.value });
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' })); 
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhone(value);
    if (aboutUsData) {
      setAboutUsData({ ...aboutUsData, phone: value || '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!aboutUsData?.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(aboutUsData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!phone) {
      newErrors.phone = 'Phone number is required.';
    }
    if (!aboutUsData?.locationLink) {
      newErrors.locationLink = 'Location link is required.';
    }
    if (!aboutUsData?.embedLocation) {
      newErrors.embedLocation = 'Embed location is required.';
    }
    if (!aboutUsData?.workingTimes.days.en) {
      newErrors['workingTimes.days.en'] = 'Working days (EN) are required.';
    }
    if (!aboutUsData?.workingTimes.days.ar) {
      newErrors['workingTimes.days.ar'] = 'Working days (AR) are required.';
    }
    if (!aboutUsData?.workingTimes.time.en) {
      newErrors['workingTimes.time.en'] = 'Working time (EN) is required.';
    }
    if (!aboutUsData?.workingTimes.time.ar) {
      newErrors['workingTimes.time.ar'] = 'Working time (AR) is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault();
    try{
      if (validateForm()) {
        if (docId) {
          await updateDoc(doc(db, 'Headquarter', docId), aboutUsData);
        }
      }
      toast.success('Contact info updated successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
        });
      }catch(e){
        console.log(e);
        toast.error(`error ContactInfo hasn't be updated`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce
        });
      }finally{
        setIsLoading(false)
      }
  };

  useEffect(() => {
    fetchAboutUsData().catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  return (
    <div className="mx-auto mt-10 p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={aboutUsData?.email || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="phone">Phone</label>
          <PhoneInput
            international
            defaultCountry="IQ"
            value={phone}
            onChange={handlePhoneChange}
            className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
            required
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
        </div>

        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="locationLink">Location Link</label>
          <input
            type="url"
            id="locationLink"
            name="locationLink"
            value={aboutUsData?.locationLink || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.locationLink && <span className="text-red-500 text-sm">{errors.locationLink}</span>}
        </div>

        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="embedLocation">Embed Location</label>
          <textarea
            id="embedLocation"
            name="embedLocation"
            value={aboutUsData?.embedLocation || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
            rows={4}
          />
          {errors.embedLocation && <span className="text-red-500 text-sm">{errors.embedLocation}</span>}
        </div>

        <h3 className="text-xl font-semibold mb-4 text-center">Working Times</h3>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="workingTimes.days.en">Working Days (EN)</label>
          <input
            type="text"
            id="workingTimes.days.en"
            name="workingTimes.days.en"
            value={aboutUsData?.workingTimes.days.en || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors['workingTimes.days.en'] && <span className="text-red-500 text-sm">{errors['workingTimes.days.en']}</span>}
        </div>

        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="workingTimes.days.ar">Working Days (AR)</label>
          <input
            type="text"
            id="workingTimes.days.ar"
            name="workingTimes.days.ar"
            value={aboutUsData?.workingTimes.days.ar || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors['workingTimes.days.ar'] && <span className="text-red-500 text-sm">{errors['workingTimes.days.ar']}</span>}
        </div>

        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="workingTimes.time.en">Working Time (EN)</label>
          <input
            type="text"
            id="workingTimes.time.en"
            name="workingTimes.time.en"
            value={aboutUsData?.workingTimes.time.en || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors['workingTimes.time.en'] && <span className="text-red-500 text-sm">{errors['workingTimes.time.en']}</span>}
        </div>

        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="workingTimes.time.ar">Working Time (AR)</label>
          <input
            type="text"
            id="workingTimes.time.ar"
            name="workingTimes.time.ar"
            value={aboutUsData?.workingTimes.time.ar || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors['workingTimes.time.ar'] && <span className="text-red-500 text-sm">{errors['workingTimes.time.ar']}</span>}
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ContactInfoPage;
