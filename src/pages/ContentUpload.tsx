import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  type: 'banner' | 'logo' | 'promotional';
  name: string;
  url: string;
  uploadDate: Date;
}

export default function ContentUpload() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedType, setSelectedType] = useState<'banner' | 'logo' | 'promotional'>('banner');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the file to a server here
      // For now, we'll just create a fake URL
      const newItems: ContentItem[] = Array.from(files).map((file) => ({
        id: Date.now().toString(),
        type: selectedType,
        name: file.name,
        url: URL.createObjectURL(file),
        uploadDate: new Date()
      }));
      setContentItems([...contentItems, ...newItems]);
    }
  };

  const handleDelete = (id: string) => {
    setContentItems(contentItems.filter((item) => item.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Content Upload
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Upload and manage your promotional content
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Upload New Content
                </h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Content Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as 'banner' | 'logo' | 'promotional')}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="banner">Banner Ad</option>
                    <option value="logo">Logo</option>
                    <option value="promotional">Promotional Image</option>
                  </select>
                </div>
                <div className="mt-4">
                  <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Uploaded Content
                </h3>
                <div className="mt-4">
                  <ul role="list" className="divide-y divide-gray-100">
                    {contentItems.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                          <img
                            className="h-12 w-12 flex-none rounded-lg bg-gray-50 object-cover"
                            src={item.url}
                            alt=""
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{item.name}</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-none items-center gap-x-4">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 