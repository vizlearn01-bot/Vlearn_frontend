import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

const resources = [
  {
    id: 1,
    title: "Mathematics Formula Sheet",
    type: "PDF",
    size: "2.4 MB",
    category: "Mathematics",
    downloads: 1234
  },
  {
    id: 2,
    title: "Physics Lab Manual",
    type: "PDF",
    size: "5.1 MB",
    category: "Physics",
    downloads: 987
  },
  {
    id: 3,
    title: "Periodic Table Interactive",
    type: "Web Resource",
    category: "Chemistry",
    external: true
  },
  {
    id: 4,
    title: "STEM Career Guide",
    type: "PDF",
    size: "1.8 MB",
    category: "Career",
    downloads: 2156
  }
];

export default function Resources() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
        <div className="flex space-x-4">
          <input
            type="search"
            placeholder="Search resources..."
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <select className="bg-white border border-gray-300 rounded-md px-4 py-2">
            <option>All Categories</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Career</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {resources.map((resource) => (
            <div key={resource.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">{resource.category}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{resource.type}</span>
                      {resource.size && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{resource.size}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {resource.downloads && (
                    <div className="text-sm text-gray-500">
                      {resource.downloads.toLocaleString()} downloads
                    </div>
                  )}
                  <button className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    {resource.external ? (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Resource
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}