import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  MapIcon,
  PhotoIcon,
  ChartBarIcon,
  CalendarIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  TagIcon,
  MapPinIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, description: 'Overview & insights' },
  { name: 'Location Campaigns', href: '/location-campaigns', icon: MapPinIcon, description: 'Geo-targeted campaigns' },
  { name: 'Billing', href: '/billing', icon: CreditCardIcon, description: 'Payments & plans' },
  { name: 'Support', href: '/support', icon: ChatBubbleLeftRightIcon, description: 'Help & support' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  }

  const currentNavItem = navigation.find(item => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform" 
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/95 backdrop-blur-xl px-6 pb-4 shadow-2xl border-r border-gray-200">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-2">
                        <SparklesIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        BrandPartner
                      </span>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="space-y-2">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                  group flex items-center gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200
                                  ${location.pathname === item.href
                                    ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200 shadow-sm'
                                    : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                                  }
                                `}
                              >
                                <item.icon
                                  className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                                    location.pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                                  }`}
                                  aria-hidden="true"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-xl px-6 pb-4 shadow-xl border-r border-gray-200/50">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-2">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  BrandPartner
                </span>
                <div className="text-xs text-gray-500 font-medium">Location Marketing Platform</div>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex items-center gap-x-4 rounded-xl p-3 text-sm leading-6 transition-all duration-200
                          ${location.pathname === item.href
                            ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200 shadow-sm font-semibold'
                            : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50 font-medium'
                          }
                        `}
                      >
                        <div className={`rounded-lg p-2 transition-colors duration-200 ${
                          location.pathname === item.href 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                        {location.pathname === item.href && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* User Card at Bottom */}
              <li className="mt-auto">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-500 rounded-lg p-2">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {currentUser?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">Brand Manager</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-80">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="flex h-16 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Breadcrumb */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center">
                {currentNavItem && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 rounded-lg p-2">
                      <currentNavItem.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">{currentNavItem.name}</h1>
                      <p className="text-sm text-gray-500">{currentNavItem.description}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-1 justify-end">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-x-3 rounded-xl bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                      <div className="bg-indigo-500 rounded-lg p-1">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden lg:block">
                        {currentUser?.email?.split('@')[0] || 'User'}
                      </span>
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none border border-gray-200">
                        <Menu.Item>
                          {({ active }) => (
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-sm font-medium text-gray-900">
                                {currentUser?.email?.split('@')[0] || 'User'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {currentUser?.email}
                              </p>
                            </div>
                          )}
                        </Menu.Item>
                        {isAdmin && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admin/dashboard"
                                className={`
                                  block px-4 py-2 text-sm transition-colors duration-200
                                  ${active ? 'bg-red-50 text-red-900' : 'text-red-700'}
                                `}
                              >
                                🛡️ Admin Panel
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`
                                block px-4 py-2 text-sm w-full text-left transition-colors duration-200
                                ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}
                              `}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 