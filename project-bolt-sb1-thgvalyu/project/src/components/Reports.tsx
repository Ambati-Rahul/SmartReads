import React, { useState } from 'react';
import { BarChart3, FileText, Calendar, Download, TrendingUp, Users, BookOpen, AlertCircle } from 'lucide-react';
import { useBooks } from '../context/BookContext';

export function Reports() {
  const { books, issuedBooks, getBookById } = useBooks();
  const [activeReport, setActiveReport] = useState('overview');

  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const issuedCount = issuedBooks.filter(issue => issue.status === 'issued').length;
  const overdueCount = issuedBooks.filter(issue => {
    return issue.status === 'issued' && new Date() > issue.dueDate;
  }).length;

  const reports = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'issued', label: 'Issued Books', icon: FileText },
    { id: 'overdue', label: 'Overdue Books', icon: AlertCircle },
    { id: 'popular', label: 'Popular Books', icon: TrendingUp }
  ];

  const getIssuedBooksReport = () => {
    return issuedBooks.filter(issue => issue.status === 'issued').map(issue => ({
      ...issue,
      book: getBookById(issue.bookId)
    }));
  };

  const getOverdueBooksReport = () => {
    return issuedBooks.filter(issue => {
      return issue.status === 'issued' && new Date() > issue.dueDate;
    }).map(issue => ({
      ...issue,
      book: getBookById(issue.bookId),
      daysOverdue: Math.floor((new Date().getTime() - issue.dueDate.getTime()) / (1000 * 60 * 60 * 24))
    }));
  };

  const getPopularBooksReport = () => {
    const bookIssueCount = issuedBooks.reduce((acc, issue) => {
      acc[issue.bookId] = (acc[issue.bookId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(bookIssueCount)
      .map(([bookId, count]) => ({
        book: getBookById(bookId),
        issueCount: count
      }))
      .filter(item => item.book)
      .sort((a, b) => b.issueCount - a.issueCount)
      .slice(0, 10);
  };

  const generatePDF = () => {
    alert('PDF generation would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">Library statistics and insights</p>
        </div>
        <button
          onClick={generatePDF}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {reports.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveReport(id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeReport === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeReport === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Books</p>
                      <p className="text-2xl font-bold text-blue-900">{totalBooks}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Total Copies</p>
                      <p className="text-2xl font-bold text-green-900">{totalCopies}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Currently Issued</p>
                      <p className="text-2xl font-bold text-yellow-900">{issuedCount}</p>
                    </div>
                    <Users className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="bg-red-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Overdue</p>
                      <p className="text-2xl font-bold text-red-900">{overdueCount}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Categories</h3>
                  <div className="space-y-3">
                    {Array.from(new Set(books.map(book => book.category))).map(category => {
                      const count = books.filter(book => book.category === category).length;
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-gray-700">{category}</span>
                          <span className="font-medium text-gray-900">{count} books</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {issuedBooks.slice(0, 5).map(issue => (
                      <div key={issue.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{issue.userName} issued "{getBookById(issue.bookId)?.title}"</p>
                          <p className="text-xs text-gray-500">{issue.issueDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'issued' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Currently Issued Books</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getIssuedBooksReport().map((issue) => (
                      <tr key={issue.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{issue.book?.title}</div>
                          <div className="text-sm text-gray-500">{issue.book?.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{issue.userName}</div>
                          <div className="text-sm text-gray-500">{issue.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {issue.issueDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {issue.dueDate.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeReport === 'overdue' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Overdue Books</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getOverdueBooksReport().map((issue) => (
                      <tr key={issue.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{issue.book?.title}</div>
                          <div className="text-sm text-gray-500">{issue.book?.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{issue.userName}</div>
                          <div className="text-sm text-gray-500">{issue.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {issue.dueDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {issue.daysOverdue} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {getOverdueBooksReport().length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No overdue books</p>
                </div>
              )}
            </div>
          )}

          {activeReport === 'popular' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Most Popular Books</h3>
              <div className="space-y-4">
                {getPopularBooksReport().map((item, index) => (
                  <div key={item.book?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.book?.title}</h4>
                        <p className="text-sm text-gray-500">{item.book?.author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{item.issueCount}</p>
                      <p className="text-sm text-gray-500">issues</p>
                    </div>
                  </div>
                ))}
              </div>
              {getPopularBooksReport().length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No book issue data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}