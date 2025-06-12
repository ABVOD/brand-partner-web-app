import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  TagIcon,
  BellIcon,
  ChartBarIcon,
  MapIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const adminNavigation = [
  { 
    name: 'Admin Dashboard', 
    href: '/admin/dashboard', 
    icon: HomeIcon, 
    description: 'Overview & insights' 
  },
  { 
    name: 'User Management', 
    href: '/admin/users', 
    icon: UsersIcon, 
    description: 'View, verify & manage users' 
  },
  { 
    name: 'Incident Reports', 
    href: '/admin/incidents', 
    icon: ExclamationTriangleIcon, 
    description: 'Monitor accident reports' 
  },
  { 
    name: 'Insurance Companies', 
    href: '/admin/insurance-companies', 
    icon: BuildingOfficeIcon, 
    description: 'Manage insurance partners' 
  },
  { 
    name: 'Promotional Offers', 
    href: '/admin/offers', 
    icon: TagIcon, 
    description: 'Manage location-based offers' 
  },
  { 
    name: 'Push Notifications', 
    href: '/admin/notifications', 
    icon: BellIcon, 
    description: 'Send & schedule notifications' 
  },
  { 
    name: 'Analytics & Reports', 
    href: '/admin/analytics', 
    icon: ChartBarIcon, 
    description: 'Visual analytics dashboard' 
  },
  { 
    name: 'Heatmap Analytics', 
    href: '/admin/heatmap-analytics', 
    icon: MapIcon, 
    description: 'User interaction heatmaps' 
  },
  { 
    name: 'Location Activity', 
    href: '/admin/location-activity', 
    icon: MapIcon, 
    description: 'Heatmaps & usage logs' 
  },
  { 
    name: 'Privacy & Compliance', 
    href: '/admin/privacy', 
    icon: ShieldCheckIcon, 
    description: 'GDPR/CCPA compliance' 
  },
  { 
    name: 'Support Requests', 
    href: '/admin/support', 
    icon: LifebuoyIcon, 
    description: 'Tickets & help requests' 
  },
];

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  }

  const currentNavItem = adminNavigation.find(item => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
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
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
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
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900/95 backdrop-blur-xl px-6 pb-4 shadow-2xl border-r border-gray-700">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-2">
                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Admin Panel
                      </span>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="space-y-2">
                          {adminNavigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                  group flex items-center gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200
                                  ${location.pathname === item.href
                                    ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200 shadow-sm'
                                    : 'text-gray-700 hover:text-red-700 hover:bg-gray-50'
                                  }
                                `}
                              >
                                <item.icon
                                  className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                                    location.pathname === item.href ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600'
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
                  <button
                    type="button"
                    className="absolute top-4 right-4 -m-2.5 p-2.5 rounded-md text-gray-700 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900/90 backdrop-blur-xl px-6 pb-4 shadow-xl border-r border-gray-700/50">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-2">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Admin Panel
                </span>
                <div className="text-xs text-gray-500 font-medium">System Administration</div>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-2">
                  {adminNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex items-center gap-x-4 rounded-xl p-3 text-sm leading-6 transition-all duration-200
                          ${location.pathname === item.href
                            ? 'bg-gradient-to-r from-red-900/50 to-orange-900/50 text-red-300 border border-red-700/50 shadow-sm font-semibold'
                            : 'text-gray-300 hover:text-red-300 hover:bg-gray-800/50 font-medium'
                          }
                        `}
                      >
                        <div className={`rounded-lg p-2 transition-colors duration-200 ${
                          location.pathname === item.href 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-700 text-gray-400 group-hover:bg-red-900/50 group-hover:text-red-400'
                        }`}>
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                        </div>
                        {location.pathname === item.href && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Admin User Card at Bottom */}
              <li className="mt-auto">
                <div className="bg-gradient-to-r from-gray-800 to-red-900/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-500 rounded-lg p-2">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 truncate">
                        {currentUser?.email?.split('@')[0] || 'Admin'}
                      </p>
                      <p className="text-xs text-red-400 font-medium">
                        {userProfile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white text-xs font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

              <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700/50 bg-gray-900/90 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4">
              <div className="flex items-center space-x-2">
                {currentNavItem && (
                  <>
                    <div className="bg-red-900/50 p-1.5 rounded-lg">
                      <currentNavItem.icon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-100">{currentNavItem.name}</h1>
                      <p className="text-sm text-gray-400">{currentNavItem.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 transition-colors">
                  Emergency Alert
                </button>
                                  <button className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 shadow-sm ring-1 ring-gray-600 hover:bg-gray-600 transition-colors">
                  System Status
                </button>
              </div>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open admin menu</span>
                  <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-100" aria-hidden="true">
                      {currentUser?.email?.split('@')[0] || 'Admin'}
                    </span>
                  </span>
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
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl bg-gray-800 py-2 shadow-lg ring-1 ring-gray-700 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/admin/settings"
                          className={`block px-3 py-1 text-sm leading-6 text-gray-300 ${
                            active ? 'bg-gray-700' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Cog6ToothIcon className="h-4 w-4" />
                            <span>Admin Settings</span>
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-3 py-1 text-sm leading-6 text-gray-300 ${
                            active ? 'bg-gray-700' : ''
                          }`}
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

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 