import React from 'react';
import Header from './Header';

export default function Layout({ children, rightPanel }) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-4xl bg-white min-h-[calc(100vh-8rem)] shadow-sm rounded-lg border border-gray-200">
                {children}
            </div>
        </main>
        {rightPanel && (
            <aside className="w-[400px] border-l border-gray-200 bg-white shadow-xl z-20 flex flex-col">
                {rightPanel}
            </aside>
        )}
      </div>
    </div>
  );
}
