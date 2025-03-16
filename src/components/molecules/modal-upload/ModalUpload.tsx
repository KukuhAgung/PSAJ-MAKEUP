import { useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ModalProps {
  videoId: number;
  closeModal: () => void;
}

const ModalUpload: React.FC<ModalProps> = ({ videoId, closeModal }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    console.log(`Upload Video ID: ${videoId}`);
    console.log("File:", file);
    closeModal();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg p-8 w-[400px] relative">
        <button className="absolute top-3 right-3" onClick={closeModal}>
          <FiX />
        </button>
        <h2 className="text-lg font-medium mb-4">Upload Video Baru</h2>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button
          className="mt-4 bg-primary-500 px-6 py-2 text-white rounded-lg"
          onClick={handleSubmit}
        >
          Upload
        </button>
      </div>
    </motion.div>
  );
};

export default ModalUpload;
