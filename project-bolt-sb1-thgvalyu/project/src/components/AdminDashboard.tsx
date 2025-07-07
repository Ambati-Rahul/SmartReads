import React, { useState } from 'react';
import { Header } from './Header';
import { BookManagement } from './BookManagement';
import { UserManagement } from './UserManagement';
import { IssueManagement } from './IssueManagement';
import { Reports } from './Reports';
import { BookOpen, Users, FileText, BarChart3, Sparkles, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('books');

  const tabs = [
    { id: 'books', label: 'Books', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { id: 'users', label: 'Users', icon: Users, color: 'from-green-500 to-emerald-500' },
    { id: 'issues', label: 'Issues', icon: FileText, color: 'from-orange-500 to-red-500' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Manage your library system with ease
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
            <nav className="flex space-x-1 px-6">
              {tabs.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex items-center py-4 px-6 font-semibold text-sm transition-all duration-300 group ${
                    activeTab === id
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {activeTab === id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-t-xl`}></div>
                  )}
                  <div className="relative flex items-center space-x-2">
                    <Icon className={`h-5 w-5 transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span>{label}</span>
                  </div>
                  {activeTab === id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <div className="transition-all duration-500 ease-in-out">
              {activeTab === 'books' && <BookManagement />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'issues' && <IssueManagement />}
              {activeTab === 'reports' && <Reports />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}