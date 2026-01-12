import React from 'react';
import Layout from './components/layout/Layout';
import RichTextEditor from './components/editor/RichTextEditor';
import ChatSidebar from './components/chat/ChatSidebar'
import TestChat from './TestChat';;
import { EditorProvider } from './context/EditorContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <EditorProvider>
      <ChatProvider>
        <Layout rightPanel={<ChatSidebar />}>
          <RichTextEditor />
        </Layout>
      </ChatProvider>
    </EditorProvider>
  )
}

export default App
