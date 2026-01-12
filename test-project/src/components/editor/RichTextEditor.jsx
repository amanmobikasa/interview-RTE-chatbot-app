import React, { useEffect } from 'react';
import { useEditorContext } from '../../context/EditorContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';

const CONTENT_TO_STREAM = `
<h2>COPYRIGHT LICENSING AGREEMENT</h2>
<p><strong>1. Preamble and Purpose</strong></p>
<p>This Copyright Licensing Agreement ("Agreement") is made and entered into on [DATE] ("Effective Date") by and between [LICENSEE NAME] ("Licensee") and [LICENSOR NAME] ("Licensor"). The parties agree to be bound by the terms and conditions of this Agreement.</p>
<p><strong>2. Definitions</strong></p>
<p>For the purpose of this Agreement, the following terms shall have the following meanings:</p>
<ul>
    <li>"Copyrighted Materials" means all literary, dramatic, musical, and artistic works, including but not limited to, texts, images, audio, and video recordings, in any format or medium, that are protected by copyright law.</li>
    <li>"Derivative Works" means any work that is based on or derived from the Copyrighted Materials, including but not limited to, translations, adaptations, and modifications.</li>
    <li>"Licensed Territory" means the territory specified in Schedule A.</li>
    <li>"License Fee" means the fee specified in Schedule B.</li>
</ul>
<p><strong>3. Grant and Scope of License</strong></p>
<p>Licensor hereby grants to Licensee a non-exclusive license to use, reproduce, and distribute the Copyrighted Materials in the Licensed Territory during the term of this Agreement.</p>
`;


export default function RichTextEditor() {
  const { setEditor } = useEditorContext();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8',
      },
    },
  });

  useEffect(() => {
    setEditor(editor);
  }, [editor, setEditor]);

  // Simulation of streaming content
  useEffect(() => {
    if (!editor) return;

    // Reset content initially
    editor.commands.setContent('');

    let currentIndex = 0;
    const fullText = CONTENT_TO_STREAM;
    
    // Function to find the next safe index (skipping html tags locally to appear instant)
    const getNextIndex = (curr) => {
        if (curr >= fullText.length) return curr;
        
        let next = curr;
        // If start of tag, jump to end of tag
        if (fullText[next] === '<') {
            const closing = fullText.indexOf('>', next);
            if (closing !== -1) {
                return closing + 1; // Return index after '>'
            }
        }
        
        // Otherwise advance by small random amount for typing effect
        return Math.min(next + Math.floor(10 * 3) + 1, fullText.length);
    };

    const streamContent = () => {
        if (currentIndex < fullText.length) {
            // Calculate next safe chunk
            let nextIndex = getNextIndex(currentIndex);
            
            // If we just jumped over a tag, we might want to continue immediately to finding text
            // But for simplicity, we just reveal up to that point.
            // If multiple tags are adjacent, our loop next frame will handle next one.
            
            // However, to avoid "pause" on tags, we can loop until we hit text or end
            while (nextIndex < fullText.length && fullText.substring(currentIndex, nextIndex).trim() === '') {
                 // It was just whitespace or we started at a tag and just finished it
                 // Let's check if there is another tag immediately
                 const potentialNext = getNextIndex(nextIndex);
                 if (potentialNext > nextIndex && fullText[nextIndex] === '<') {
                     nextIndex = potentialNext;
                 } else {
                     break;
                 }
            }

            const currentContent = fullText.slice(0, nextIndex);
            
            // We use setContent which handles unclosed tags gracefully (browser auto-close)
            // This ensures structure is maintained even during streaming
            // We maintain selection at the end to simulate typing
            editor.commands.setContent(currentContent, false, { preserveWhitespace: 'full' });
            
            // Scroll to bottom
            window.scrollTo(0, document.body.scrollHeight);
            
            currentIndex = nextIndex;
            requestAnimationFrame(streamContent);
        }
    };

    // Delay start slightly
    const timeout = setTimeout(() => {
        streamContent();
    }, 500);

    return () => clearTimeout(timeout);
  }, [editor]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  );
}
