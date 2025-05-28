import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import DashboardLayout from '../components/DashboardLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 43.6532,
  lng: -79.3832 // Toronto coordinates
};

interface Offer {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  startDate: Date;
  endDate: Date;
  city: string;
}

export default function OfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    city: '',
    location: center,
    startDate: new Date(),
    endDate: new Date()
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isCreating && e.latLng) {
      setNewOffer({
        ...newOffer,
        location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      });
    }
  };

  const handleCreateOffer = () => {
    if (newOffer.title && newOffer.description && newOffer.city) {
      const offer: Offer = {
        id: Date.now().toString(),
        title: newOffer.title,
        description: newOffer.description,
        city: newOffer.city,
        location: newOffer.location as { lat: number; lng: number },
        startDate: newOffer.startDate as Date,
        endDate: newOffer.endDate as Date
      };
      setOffers([...offers, offer]);
      setIsCreating(false);
      setNewOffer({
        title: '',
        description: '',
        city: '',
        location: center,
        startDate: new Date(),
        endDate: new Date()
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Offer Management
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Create and manage location-based offers
            </p>
          </div>
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Offer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onClick={handleMapClick}
              >
                {offers.map((offer) => (
                  <Marker
                    key={offer.id}
                    position={offer.location}
                    onClick={() => setSelectedOffer(offer)}
                  />
                ))}
                {isCreating && newOffer.location && (
                  <Marker
                    position={newOffer.location}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          <div className="lg:col-span-1">
            {isCreating ? (
              <div className="rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Create New Offer
                  </h3>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={newOffer.city}
                        onChange={(e) => setNewOffer({ ...newOffer, city: e.target.value })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Start Date
                      </label>
                      <DatePicker
                        selected={newOffer.startDate}
                        onChange={(date) => setNewOffer({ ...newOffer, startDate: date as Date })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        End Date
                      </label>
                      <DatePicker
                        selected={newOffer.endDate}
                        onChange={(date) => setNewOffer({ ...newOffer, endDate: date as Date })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-4">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateOffer}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedOffer ? (
              <div className="rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    {selectedOffer.title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{selectedOffer.description}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">City:</span> {selectedOffer.city}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Start Date:</span>{' '}
                      {selectedOffer.startDate.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">End Date:</span>{' '}
                      {selectedOffer.endDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setSelectedOffer(null)}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="text-sm text-gray-500">
                  Select a marker on the map to view offer details or create a new offer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 