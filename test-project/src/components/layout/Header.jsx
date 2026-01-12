import React, { useState } from 'react';
import { ChevronLeft, FileText, Eye, Save } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEditorContext } from '../../context/EditorContext';
import PreviewModal from '../preview/PreviewModal';

export default function Header() {
  const { editor } = useEditorContext();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      console.log('Saved Content:', content);
      alert('Document saved successfully!');
    }
  };

  const handlePreview = () => {
    if (editor) {
      setPreviewContent(editor.getHTML());
      setIsPreviewOpen(true);
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">License Agreement</h1>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">New Document</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
           onClick={handlePreview}
           className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
            <Eye className="w-4 h-4" />
            Preview
        </button>
        <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
        >
            <Save className="w-4 h-4" />
            Save
        </button>
      </div>

      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        content={previewContent} 
      />
    </header>
  );
}
