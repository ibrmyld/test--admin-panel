import React, { useState } from 'react';
import { CreditCard, Wallet, TrendingUp, DollarSign, Eye, Check, X } from 'lucide-react';

const Payments = () => {
  const [payments] = useState([
    {
      id: 1,
      productName: "React Template Pack",
      customerEmail: "user@example.com",
      amount: "0.02",
      currency: "ETH",
      usdAmount: "$29",
      status: "completed",
      paymentMethod: "crypto",
      transactionHash: "0x742d35Cc6634C0532925a3b8D4C24Fd1c79d76cc",
      createdAt: "2024-01-15 14:30",
    },
    {
      id: 2,
      productName: "3D Model Collection",
      customerEmail: "buyer@example.com",
      amount: "49",
      currency: "USD",
      usdAmount: "$49",
      status: "pending",
      paymentMethod: "card",
      transactionHash: null,
      createdAt: "2024-01-15 13:15",
    },
    {
      id: 3,
      productName: "Security Scripts",
      customerEmail: "dev@example.com",
      amount: "0.025",
      currency: "ETH",
      usdAmount: "$39",
      status: "failed",
      paymentMethod: "crypto",
      transactionHash: null,
      createdAt: "2024-01-15 12:00",
    }
  ]);

  const stats = [
    { label: "Total Revenue", value: "$2,340", icon: DollarSign, change: "+12%" },
    { label: "Crypto Payments", value: "68 ETH", icon: Wallet, change: "+8%" },
    { label: "Transactions", value: "156", icon: CreditCard, change: "+24%" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, change: "+2%" }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} className="mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case 'crypto':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Wallet size={12} className="mr-1" />
            Crypto
          </span>
        );
      case 'card':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CreditCard size={12} className="mr-1" />
            Card
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💳 Payment Management</h1>
        <p className="text-gray-600 mt-1">Manage all customer payments and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-full">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.amount} {payment.currency}
                    </div>
                    <div className="text-sm text-gray-500">{payment.usdAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentMethodBadge(payment.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      <Eye size={16} />
                    </button>
                    {payment.transactionHash && (
                      <button 
                        onClick={() => window.open(`https://etherscan.io/tx/${payment.transactionHash}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View TX
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <DollarSign size={16} />
            <span>Export Transactions</span>
          </button>
          
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Wallet size={16} />
            <span>Crypto Settings</span>
          </button>
          
          <button className="btn-outline flex items-center justify-center space-x-2">
            <CreditCard size={16} />
            <span>Payment Gateways</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;