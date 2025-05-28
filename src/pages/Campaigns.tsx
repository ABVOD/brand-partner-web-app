import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'weekend' | 'event' | 'holiday';
  status: 'scheduled' | 'active' | 'completed';
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    type: 'weekend',
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.description) {
      const campaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaign.name,
        description: newCampaign.description,
        type: newCampaign.type as 'weekend' | 'event' | 'holiday',
        startDate: newCampaign.startDate as Date,
        endDate: newCampaign.endDate as Date,
        status: 'scheduled',
      };
      setCampaigns([...campaigns, campaign]);
      setIsCreating(false);
      setNewCampaign({
        name: '',
        description: '',
        type: 'weekend',
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Campaign Scheduling
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Schedule and manage time-sensitive campaigns
            </p>
          </div>
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Campaign
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Create New Campaign
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Campaign Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={newCampaign.description}
                      onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                    Campaign Type
                  </label>
                  <div className="mt-2">
                    <select
                      id="type"
                      name="type"
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as 'weekend' | 'event' | 'holiday' })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="weekend">Weekend Discount</option>
                      <option value="event">Event Based</option>
                      <option value="holiday">Holiday Special</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Start Date
                  </label>
                  <div className="mt-2">
                    <DatePicker
                      selected={newCampaign.startDate}
                      onChange={(date) => setNewCampaign({ ...newCampaign, startDate: date as Date })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    End Date
                  </label>
                  <div className="mt-2">
                    <DatePicker
                      selected={newCampaign.endDate}
                      onChange={(date) => setNewCampaign({ ...newCampaign, endDate: date as Date })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateCampaign}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Scheduled Campaigns
            </h3>
            <div className="mt-6">
              <ul role="list" className="divide-y divide-gray-100">
                {campaigns.map((campaign) => (
                  <li key={campaign.id} className="flex items-center justify-between gap-x-6 py-5">
                    <div className="min-w-0">
                      <div className="flex items-start gap-x-3">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{campaign.name}</p>
                        <p className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p className="whitespace-nowrap">
                          <CalendarIcon className="mr-1 inline h-4 w-4" />
                          {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
                        </p>
                        <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                          <circle cx={1} cy={1} r={1} />
                        </svg>
                        <p className="truncate">Type: {campaign.type}</p>
                      </div>
                      <p className="mt-1 truncate text-sm leading-6 text-gray-500">
                        {campaign.description}
                      </p>
                    </div>
                    <div className="flex flex-none items-center gap-x-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
                {campaigns.length === 0 && (
                  <li className="py-4">
                    <p className="text-sm text-gray-500 text-center">
                      No campaigns scheduled. Create one to get started.
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 