import { Heart, Star, Mail, Github } from 'lucide-react';

export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Tailwind CSS Test</h1>
        <p className="text-lg text-gray-600 mb-8">Your React project is ready to go!</p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Star className="text-yellow-500 mr-3" size={28} />
              <h2 className="text-2xl font-semibold text-gray-800">Feature One</h2>
            </div>
            <p className="text-gray-600">This is a beautiful card component built with Tailwind CSS utilities.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Heart className="text-red-500 mr-3" size={28} />
              <h2 className="text-2xl font-semibold text-gray-800">Feature Two</h2>
            </div>
            <p className="text-gray-600">Responsive design that works on all devices. Try resizing your browser!</p>
          </div>
        </div>

        {/* Button Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Interactive Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Success Button
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Danger Button
            </button>
            <button className="border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 font-bold py-2 px-6 rounded-lg transition-colors">
              Outline Button
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Form Elements</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                placeholder="Type your message..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { number: '100%', label: 'Responsive' },
            { number: '0ms', label: 'Load Time' },
            { number: '∞', label: 'Possibilities' }
          ].map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white text-center">
              <p className="text-4xl font-bold mb-2">{stat.number}</p>
              <p className="text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-4">Tailwind CSS is working perfectly! 🎉</p>
          <div className="flex justify-center gap-4">
            <Mail className="text-gray-400 hover:text-blue-500 cursor-pointer" />
            <Github className="text-gray-400 hover:text-gray-700 cursor-pointer" />
            <Heart className="text-gray-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}