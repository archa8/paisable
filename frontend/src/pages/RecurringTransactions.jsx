import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import RecurringTransactionModal from '../components/RecurringTransactionModal';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import useCurrency from '../hooks/useCurrency';

const RecurringTransactions = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const { currency } = useCurrency();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recurringRes, categoriesRes] = await Promise.all([
        api.get('/recurring'),
        api.get('/transactions/categories'),
      ]);
      setRecurring(recurringRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error('Failed to fetch recurring transactions', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/recurring/${id}`, formData);
      } else {
        await api.post('/recurring/create', formData);
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save recurring transaction', err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this recurring transaction?'
      )
    ) {
      try {
        await api.delete(`/recurring/${id}`);
        fetchData();
      } catch (err) {
        console.error('Failed to delete recurring transaction', err);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Recurring Transactions
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Recurring
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          {recurring.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Due
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recurring.map((r) => (
                  <tr key={r._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{r.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.category}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold ${
                        r.isIncome ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {r.isIncome ? '+' : '-'}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency.code,
                      }).format(r.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.isIncome ? 'Income' : 'Expense'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(r.nextDueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(r)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6">
              <EmptyState message="No recurring transactions" />
            </div>
          )}
        </div>
      )}

      <RecurringTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
        categories={categories}
      />
    </>
  );
};

export default RecurringTransactions;
