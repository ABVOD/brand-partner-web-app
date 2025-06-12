import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  lastUpdated: Date;
}

export default function Support() {
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets'>('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      subject: 'Issue with campaign creation',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date(),
      lastUpdated: new Date(),
    },
    {
      id: '2',
      subject: 'Billing question',
      status: 'open',
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000),
      lastUpdated: new Date(Date.now() - 86400000),
    },
  ]);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate support response
      setTimeout(() => {
        const supportResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Thank you for your message. Our team will get back to you shortly.',
          sender: 'support',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, supportResponse]);
      }, 1000);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicket.subject) {
      const ticket: Ticket = {
        id: Date.now().toString(),
        subject: newTicket.subject,
        status: 'open',
        priority: newTicket.priority,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
      setTickets([ticket, ...tickets]);
      setNewTicket({
        subject: '',
        priority: 'medium',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'in-progress':
        return 'bg-blue-900/50 text-blue-300';
      case 'resolved':
        return 'bg-green-900/50 text-green-300';
      default:
        return 'bg-gray-600 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900/50 text-red-300';
      case 'medium':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'low':
        return 'bg-green-900/50 text-green-300';
      default:
        return 'bg-gray-600 text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
            Support
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Get help from our support team
          </p>
        </div>

        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`${
                activeTab === 'chat'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`${
                activeTab === 'tickets'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Support Tickets
            </button>
          </nav>
        </div>

        {activeTab === 'chat' ? (
          <div className="rounded-lg bg-gray-800 border border-gray-700 shadow">
            <div className="p-6">
              <div className="h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="mt-1 text-xs opacity-75">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="mt-4">
                <div className="flex gap-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="block w-full rounded-md border-0 py-1.5 bg-gray-700 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-purple-600 p-2 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-800 border border-gray-700 shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-100">
                  Create New Ticket
                </h3>
                <form onSubmit={handleCreateTicket} className="mt-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-300">
                        Subject
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          value={newTicket.subject}
                          onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                          className="block w-full rounded-md border-0 py-1.5 bg-gray-700 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-300">
                        Priority
                      </label>
                      <div className="mt-2">
                        <select
                          id="priority"
                          name="priority"
                          value={newTicket.priority}
                          onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'low' | 'medium' | 'high' })}
                          className="block w-full rounded-md border-0 py-1.5 bg-gray-700 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <button
                        type="submit"
                        className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      >
                        Create Ticket
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="rounded-lg bg-gray-800 border border-gray-700 shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-100">
                  Your Tickets
                </h3>
                <div className="mt-6">
                  <ul role="list" className="divide-y divide-gray-700">
                    {tickets.map((ticket) => (
                      <li key={ticket.id} className="flex items-center justify-between gap-x-6 py-5">
                        <div className="min-w-0">
                          <div className="flex items-start gap-x-3">
                            <p className="text-sm font-semibold leading-6 text-gray-100">
                              {ticket.subject}
                            </p>
                            <p className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </p>
                            <p className={`rounded-md px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-400">
                            <p className="whitespace-nowrap">
                              Created {ticket.createdAt.toLocaleDateString()}
                            </p>
                            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                              <circle cx={1} cy={1} r={1} />
                            </svg>
                            <p className="truncate">
                              Last updated {ticket.lastUpdated.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-none items-center gap-x-4">
                          <button
                            type="button"
                            className="rounded-md bg-gray-700 px-2.5 py-1.5 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600"
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 