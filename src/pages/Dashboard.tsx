import DashboardLayout from '../components/DashboardLayout';
import { ChartBarIcon, MapPinIcon, PhotoIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const stats = [
  { name: 'Total Offers', value: '12', href: '/offers', icon: MapPinIcon },
  { name: 'Active Campaigns', value: '3', href: '/campaigns', icon: CalendarIcon },
  { name: 'Content Uploads', value: '24', href: '/content', icon: PhotoIcon },
  { name: 'Total Impressions', value: '10.2k', href: '/analytics', icon: ChartBarIcon },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Here's an overview of your brand's performance
          </p>
        </div>

        <div>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 hover:bg-gray-50"
              >
                <dt>
                  <div className="absolute rounded-md bg-indigo-600 p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                </dd>
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                      View details
                      <span className="sr-only"> {item.name} stats</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </dl>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
              <div className="mt-6">
                <ul role="list" className="divide-y divide-gray-100">
                  <li className="py-4">
                    <div className="flex gap-x-3">
                      <div className="flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">New offer created</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex gap-x-3">
                      <div className="flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">Campaign scheduled</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Quick Actions</h3>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link
                  to="/offers/new"
                  className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create New Offer
                </Link>
                <Link
                  to="/content/upload"
                  className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Upload Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 