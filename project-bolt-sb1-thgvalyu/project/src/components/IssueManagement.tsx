import React, { useState } from 'react';
import { FileText, Search, Calendar, Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { useBooks } from '../context/BookContext';

export function IssueManagement() {
  const { books, issuedBooks, issueBook, returnBook, getBookById } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueFormData, setIssueFormData] = useState({
    bookId: '',
    userId: '',
    userName: '',
    userEmail: ''
  });

  const filteredIssues = issuedBooks.filter(issue =>
    issue.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getBookById(issue.bookId)?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      issueBook(issueFormData.bookId, issueFormData.userId, issueFormData.userName, issueFormData.userEmail);
      setShowIssueForm(false);
      setIssueFormData({ bookId: '', userId: '', userName: '', userEmail: '' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error issuing book');
    }
  };

  const handleReturnBook = (issueId: string) => {
    if (confirm('Are you sure you want to return this book?')) {
      returnBook(issueId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'returned':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-yellow-100 text-yellow-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status === 'issued' && new Date() > dueDate;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowIssueForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Issue Book</span>
        </button>
      </div>

      {showIssueForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue New Book</h3>
          
          <form onSubmit={handleIssueBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book
              </label>
              <select
                required
                value={issueFormData.bookId}
                onChange={(e) => setIssueFormData(prev => ({ ...prev, bookId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a book</option>
                {books.filter(book => book.availableCopies > 0).map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author} (Available: {book.availableCopies})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                required
                value={issueFormData.userId}
                onChange={(e) => setIssueFormData(prev => ({ ...prev, userId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter user ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                required
                value={issueFormData.userName}
                onChange={(e) => setIssueFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter user name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                required
                value={issueFormData.userEmail}
                onChange={(e) => setIssueFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter user email"
              />
            </div>

            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Issue Book
              </button>
              <button
                type="button"
                onClick={() => setShowIssueForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => {
                const book = getBookById(issue.bookId);
                const overdue = isOverdue(issue.dueDate, issue.status);
                const actualStatus = overdue ? 'overdue' : issue.status;
                
                return (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book?.title}</div>
                      <div className="text-sm text-gray-500">{book?.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{issue.userName}</div>
                      <div className="text-sm text-gray-500">{issue.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.issueDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className={`flex items-center ${overdue ? 'text-red-600' : ''}`}>
                        <Calendar className="h-4 w-4 mr-1" />
                        {issue.dueDate.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(actualStatus)}`}>
                        {getStatusIcon(actualStatus)}
                        <span className="ml-1">{actualStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {issue.status === 'issued' && (
                        <button
                          onClick={() => handleReturnBook(issue.id)}
                          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Return</span>
                        </button>
                      )}
                      {issue.status === 'returned' && (
                        <span className="text-green-600 flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Returned</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No book issues found</p>
        </div>
      )}
    </div>
  );
}