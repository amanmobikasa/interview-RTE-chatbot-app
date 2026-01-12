import React from 'react';
import Layout from './components/layout/Layout';
import RichTextEditor from './components/editor/RichTextEditor';
import ChatSidebar from './components/chat/ChatSidebar'
import TestChat from './TestChat';;
import { EditorProvider } from './context/EditorContext';

function App() {
  return (
    <EditorProvider>
      <Layout rightPanel={<ChatSidebar />}>
        <RichTextEditor />
      </Layout>
    </EditorProvider>
  )
}

export default App
