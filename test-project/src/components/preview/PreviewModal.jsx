import React from 'react';
import { X, FileDown, FileType } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PreviewModal({ isOpen, onClose, content }) {
  if (!isOpen) return null;

  const handleDownloadWord = () => {
    // Simulation of Word download
    console.log("Downloading as Word...");
    alert("Simulating download: document.docx");
  };

  const handleDownloadPDF = () => {
     // Simulation of PDF download
     console.log("Downloading as PDF...");
     alert("Simulating download: document.pdf");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Document Preview</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div 
            className="bg-white shadow-sm p-8 min-h-[500px] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto rounded border border-gray-200"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex items-center justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
                Close
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1" />
            <button 
                onClick={handleDownloadWord}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
                <FileType size={16} />
                Download Word
            </button>
            <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
                <FileDown size={16} />
                Download PDF
            </button>
        </div>
      </div>
    </div>
  );
}
