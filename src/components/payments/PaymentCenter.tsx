import React from 'react';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PaymentCenter() {
  const transactions = [
    {
      id: 1,
      type: 'received',
      amount: 2000,
      description: 'Website Redesign Project Payment',
      date: 'Mar 15, 2024',
      status: 'completed'
    },
    {
      id: 2,
      type: 'pending',
      amount: 1500,
      description: 'Mobile App Development Milestone 1',
      date: 'Mar 10, 2024',
      status: 'pending'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Center</h1>
        <p className="mt-1 text-gray-500">
          Manage your payments and transactions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Earnings
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    $12,450
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Payments
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    $3,500
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Transactions
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 rounded-full p-2 ${
                      transaction.type === 'received'
                        ? 'bg-green-100'
                        : 'bg-yellow-100'
                    }`}
                  >
                    {transaction.type === 'received' ? (
                      <ArrowDownRight
                        className="h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowUpRight
                        className="h-5 w-5 text-yellow-600"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                    ${transaction.amount}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
