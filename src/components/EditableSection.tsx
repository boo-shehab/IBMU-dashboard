import React from 'react';

interface EditableSectionProps {
  title: string;
  content?: string;
  img?: string;
  pdf?: string;
  isEnglish: boolean;
  editing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onPdfChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  content,
  img,
  pdf,
  isEnglish,
  editing,
  onChange,
  onPdfChange,
  onImageChange,
}) => (
  <div className="p-6 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    {editing && content ? (
      <textarea
        className="w-full h-[10rem] p-2 border border-gray-300 rounded-md"
        value={content}
        onChange={onChange}
      />
    ) : (
      <p className="text-gray-700">{content}</p>
    )}
    {img && <img src={img} alt="About Us" className="mt-4 w-full h-auto" />}
    {editing && (
      <input type="file" accept="image/*" onChange={onImageChange} className="mt-4" />
    )}
    {pdf && (
      <div className="mt-4">
        <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          {isEnglish ? 'Download PDF' : 'تحميل PDF'}
        </a>
        {editing && (
          <input type="file" accept="application/pdf" onChange={onPdfChange} className="mt-4" />
        )}
      </div>
    )}
  </div>
);

export default EditableSection;
