import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';
import ManageCategoriesModal from '../components/ManageCategoriesModal';
import Spinner from '../components/Spinner';
import useCurrency from '../hooks/useCurrency';
import toast from 'react-hot-toast';

const handleExportCSV = async () => {
  try {
    const res = await api.get('/transactions/export', {
      responseType: 'blob', // Important for file download
    });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paisable_transactions.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error("Failed to export CSV");
    alert("Failed to export CSV. Please try again.");
  }
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { currency } = useCurrency();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        api.get(`/transactions?page=${page}&limit=10`),
        api.get('/transactions/categories')
      ]);
      setTransactions(transactionsRes.data.transactions);
      setTotalPages(transactionsRes.data.totalPages);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error("Failed to fetch transactions data");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenTransactionModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (formData, id) => {
    try {
      if (id) await api.put(`/transactions/${id}`, formData);
      else await api.post('/transactions', formData);
      fetchData();
      handleCloseTransactionModal();
    } catch (error) {
      toast.error("Failed to save transaction");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchData();
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const handleNewCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory].sort());
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"? All associated transactions will be moved to "Miscellaneous".`)) {
      try {
        await api.delete('/transactions/category', { data: { categoryToDelete } });
        fetchData();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <div className="flex gap-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Manage Categories
          </button>
          <button onClick={() => handleOpenTransactionModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Transaction
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            title="Export all transactions to CSV"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap font-semibold ${tx.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.isIncome ? '+' : '-'}{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currency.code,
                    }).format(tx.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.addedOn).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenTransactionModal(tx)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDeleteTransaction(tx._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Next
        </button>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
        categories={categories}
        onNewCategory={handleNewCategory}
      />

      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        allCategories={categories}
        onDelete={handleDeleteCategory}
      />
    </>
  );
};

export {TransactionsPage,handleExportCSV};