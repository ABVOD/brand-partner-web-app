import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Basic',
    price: 29,
    interval: 'month',
    description: 'Perfect for small businesses just getting started.',
    features: [
      'Up to 5 active offers',
      'Basic analytics',
      'Email support',
      'Standard ad placement',
    ],
  },
  {
    name: 'Professional',
    price: 99,
    interval: 'month',
    description: 'For growing businesses with advanced needs.',
    features: [
      'Up to 20 active offers',
      'Advanced analytics',
      'Priority support',
      'Premium ad placement',
      'Custom branding',
    ],
  },
  {
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    description: 'Custom solutions for large organizations.',
    features: [
      'Unlimited active offers',
      'Real-time analytics',
      '24/7 phone support',
      'Premium ad placement',
      'Custom branding',
      'API access',
    ],
  },
];

const invoices = [
  {
    id: '1',
    date: '2024-03-01',
    amount: 99,
    status: 'Paid',
    planName: 'Professional',
  },
  {
    id: '2',
    date: '2024-02-01',
    amount: 99,
    status: 'Paid',
    planName: 'Professional',
  },
  {
    id: '3',
    date: '2024-01-01',
    amount: 29,
    status: 'Paid',
    planName: 'Basic',
  },
];

export default function Billing() {
  const [currentPlan] = useState('Professional');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Billing & Subscription
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Manage your subscription and view billing history
          </p>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Current Plan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You are currently on the {currentPlan} plan.
                </p>
              </div>
              <div className="mt-4 sm:ml-4 sm:mt-0">
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setBillingInterval('month')}
                    className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ${
                      billingInterval === 'month'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingInterval('year')}
                    className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ${
                      billingInterval === 'year'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-lg p-6 ring-1 ring-inset ${
                    plan.name === currentPlan
                      ? 'bg-indigo-50 ring-indigo-200'
                      : 'ring-gray-200'
                  }`}
                >
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                  <p className="mt-6">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${billingInterval === 'year' ? plan.price * 10 : plan.price}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /{billingInterval}
                    </span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold ${
                      plan.name === currentPlan
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                        : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                    }`}
                  >
                    {plan.name === currentPlan ? 'Current plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Billing History
            </h3>
            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Plan
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {invoice.planName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${invoice.amount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 