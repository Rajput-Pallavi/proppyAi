import React from "react";

const Library = () => {
  return (
    <div className="block animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl min-h-96 p-10 text-center shadow-lg">
        <div className="text-gray-600 text-lg">
          <h2 className="mb-2.5 text-gray-800">📚 Library</h2>
          <p>This is your library page. It's currently empty.</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default Library;