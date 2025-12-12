import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileProcess: (file: File) => Promise<void>;
  isLoading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileProcess, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileProcess(file);
      } else {
        alert("Por favor, envie apenas arquivos PDF.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileProcess(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="mb-8">
      <div 
        className={`relative w-full h-48 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-4
          ${dragActive ? 'border-senai-blue bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${isLoading ? 'opacity-70 pointer-events-none' : 'hover:border-senai-blue hover:bg-gray-100'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleChange}
        />

        {isLoading ? (
          <div className="flex flex-col items-center text-senai-blue animate-pulse">
            <Loader2 className="w-12 h-12 mb-3 animate-spin" />
            <p className="font-semibold">Processando PDF com IA...</p>
            <p className="text-sm text-gray-500 mt-1">Isso pode levar alguns segundos.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <UploadCloud className={`w-12 h-12 mb-3 ${dragActive ? 'text-senai-blue' : 'text-gray-400'}`} />
            <p className="text-lg font-medium text-gray-700">
              Arraste a Programação de Cursos (PDF) aqui
            </p>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              ou clique para selecionar do computador
            </p>
            <button
              onClick={onButtonClick}
              className="bg-white text-senai-blue border border-senai-blue font-semibold py-2 px-6 rounded-full hover:bg-senai-blue hover:text-white transition-colors text-sm"
            >
              Selecionar Arquivo
            </button>
          </div>
        )}
      </div>
      
      {!isLoading && (
         <div className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
           <AlertCircle className="w-3 h-3" />
           A IA extrairá automaticamente nome, valores e datas dos cursos.
         </div>
      )}
    </div>
  );
};

export default UploadZone;