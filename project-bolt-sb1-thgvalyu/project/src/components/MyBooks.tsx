import React from 'react';
import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../hooks/useAuth';

export function MyBooks() {
  const { issuedBooks, getBookById, returnBook } = useBooks();
  const { user } = useAuth();

  const myBooks = issuedBooks.filter(issue => issue.userId === user?.id);

  const handleReturnBook = (issueId: string) => {
    if (confirm('Are you sure you want to return this book?')) {
      returnBook(issueId);
    }
  };

  const getStatusIcon = (status: string, dueDate: Date) => {
    const isOverdue = status === 'issued' && new Date() > dueDate;
    
    if (isOverdue) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    
    switch (status) {
      case 'issued':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'returned':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string, dueDate: Date) => {
    const isOverdue = status === 'issued' && new Date() > dueDate;
    
    if (isOverdue) {
      return 'bg-red-100 text-red-800';
    }
    
    switch (status) {
      case 'issued':
        return 'bg-yellow-100 text-yellow-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string, dueDate: Date) => {
    const isOverdue = status === 'issued' && new Date() > dueDate;
    
    if (isOverdue) {
      return 'Overdue';
    }
    
    return status === 'issued' ? 'Issued' : 'Returned';
  };

  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const currentIssues = myBooks.filter(issue => issue.status === 'issued');
  const pastIssues = myBooks.filter(issue => issue.status === 'returned');

  return (
    <div className="space-y-8">
      {/* Current Issues */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Currently Issued Books</h3>
        {currentIssues.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No books currently issued</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentIssues.map((issue) => {
              const book = getBookById(issue.bookId);
              const daysRemaining = getDaysRemaining(issue.dueDate);
              const isOverdue = daysRemaining < 0;
              
              return (
                <div key={issue.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{book?.title}</h4>
                        <p className="text-sm text-gray-600">{book?.author}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status, issue.dueDate)}`}>
                      {getStatusText(issue.status, issue.dueDate)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issue Date:</span>
                      <span className="font-medium">{issue.issueDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                        {issue.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days Remaining:</span>
                      <span className={`font-medium ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                        {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReturnBook(issue.id)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Return Book</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Issues */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Issue History</h3>
        {pastIssues.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No previous issues</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastIssues.map((issue) => {
                  const book = getBookById(issue.bookId);
                  
                  return (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{book?.title}</div>
                            <div className="text-sm text-gray-500">{book?.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.issueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.returnDate?.toLocaleDateString() || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Returned
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}