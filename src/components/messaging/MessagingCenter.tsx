import React, { useState } from 'react';
import { Send, Search } from 'lucide-react';

export default function MessagingCenter() {
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'John Smith',
      lastMessage: 'Thanks for the update!',
      time: '2m ago',
      unread: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      lastMessage: 'When can you start?',
      time: '1h ago',
      unread: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'John Smith',
      content: 'Hi, I saw your proposal for the website redesign project.',
      time: '10:30 AM',
      isSender: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Yes, I would love to discuss the details further.',
      time: '10:32 AM',
      isSender: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow h-[calc(100vh-12rem)] flex">
        {/* Conversation List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {conversation.name}
                  </h3>
                  <p className="text-xs text-gray-500">{conversation.time}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">John Smith</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg rounded-lg px-4 py-2 ${
                    msg.isSender
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-75">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
