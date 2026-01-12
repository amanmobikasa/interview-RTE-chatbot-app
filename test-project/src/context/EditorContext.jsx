import React, { createContext, useContext, useState } from 'react';

const EditorContext = createContext({
  editor: null,
  setEditor: () => {},
});

export const useEditorContext = () => useContext(EditorContext);

export const EditorProvider = ({ children }) => {
  const [editor, setEditor] = useState(null);

  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  );
};
