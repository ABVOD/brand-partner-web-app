import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete } from '@react-google-maps/api';
import { MagnifyingGlassIcon, MapPinIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinIconSolid } from '@heroicons/react/24/solid';
import type { LocationData } from '../pages/LocationBasedCampaigns';

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
}

// You'll need to add your Google Maps API key here
const GOOGLE_MAPS_API_KEY = 'AIzaSyAbzYrnRqImJePYuGt_v5CzTe5cvwHsEfU';

const libraries: ("places")[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '16px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(
    initialLocation || {
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
      address: '',
      radius: 1000,
    }
  );

  const [searchValue, setSearchValue] = useState('');

  const center = useMemo(() => ({
    lat: selectedLocation.lat,
    lng: selectedLocation.lng,
  }), [selectedLocation.lat, selectedLocation.lng]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || '';
        
        // Extract area name from place details
        let areaName = '';
        if (place.address_components) {
          const areaComponent = place.address_components.find(component => 
            component.types.includes('sublocality') || 
            component.types.includes('locality') ||
            component.types.includes('administrative_area_level_1')
          );
          
          if (areaComponent) {
            areaName = areaComponent.long_name;
          }
        }
        
        const newLocation: LocationData = {
          lat,
          lng,
          address: areaName ? `${areaName}, ${address}` : address,
          radius: selectedLocation.radius,
        };
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
        
        if (map) {
          // Smoothly pan to the new location
          map.panTo({ lat, lng });
          map.setZoom(15); // Set an appropriate zoom level
        }
      }
    }
  }, [autocomplete, map, onLocationSelect, selectedLocation.radius]);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Reverse geocoding to get address with more detailed information
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        let address = '';
        let areaName = '';
        
        if (status === 'OK' && results?.[0]) {
          // Get the formatted address
          address = results[0].formatted_address;
          
          // Extract area name from address components
          const addressComponents = results[0].address_components;
          const areaComponent = addressComponents?.find(component => 
            component.types.includes('sublocality') || 
            component.types.includes('locality') ||
            component.types.includes('administrative_area_level_1')
          );
          
          if (areaComponent) {
            areaName = areaComponent.long_name;
          }
        }
        
        const newLocation: LocationData = {
          lat,
          lng,
          address: areaName ? `${areaName}, ${address}` : address,
          radius: selectedLocation.radius,
        };
        
        // Smoothly pan to the new location
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15); // Set an appropriate zoom level
        }
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
      });
    }
  }, [onLocationSelect, selectedLocation.radius, map]);

  const handleRadiusChange = useCallback((radius: number) => {
    const newLocation: LocationData = {
      ...selectedLocation,
      radius,
    };
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  }, [selectedLocation, onLocationSelect]);

  const formatRadius = (radius: number) => {
    if (radius >= 1000) {
      return `${(radius / 1000).toFixed(1)} km`;
    }
    return `${radius} m`;
  };

  const radiusOptions = [
    { value: 100, label: '100m', color: 'text-green-600' },
    { value: 250, label: '250m', color: 'text-green-600' },
    { value: 500, label: '500m', color: 'text-blue-600' },
    { value: 1000, label: '1 km', color: 'text-blue-600' },
    { value: 2000, label: '2 km', color: 'text-indigo-600' },
    { value: 5000, label: '5 km', color: 'text-purple-600' },
    { value: 10000, label: '10 km', color: 'text-purple-600' },
    { value: 20000, label: '20 km', color: 'text-red-600' },
  ];

  const getCurrentRadiusColor = () => {
    const option = radiusOptions.find(opt => opt.value === selectedLocation.radius);
    return option?.color || 'text-blue-600';
  };

  // Create marker options only when script is loaded
  const markerOptions = isScriptLoaded ? {
    animation: google.maps.Animation.DROP,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: '#10B981',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 3,
    }
  } : undefined;

  return (
    <div className="space-y-6">
      {/* Search and Radius Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            <MagnifyingGlassIcon className="inline h-4 w-4 mr-2" />
            Search Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <LoadScript 
              googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
              libraries={libraries}
              onLoad={() => setIsScriptLoaded(true)}
            >
              <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                <input
                  type="text"
                  placeholder="Search for restaurants, addresses, or landmarks..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 text-lg"
                />
              </Autocomplete>
            </LoadScript>
          </div>
        </div>
        
        {/* Radius Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            <AdjustmentsHorizontalIcon className="inline h-4 w-4 mr-2" />
            Targeting Radius
          </label>
          <select
            value={selectedLocation.radius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 text-lg font-medium"
          >
            {radiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                🎯 {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <LoadScript 
          googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
          libraries={libraries}
          onLoad={() => setIsScriptLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={selectedLocation.radius > 10000 ? 10 : selectedLocation.radius > 5000 ? 12 : 14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "geometry.fill",
                  stylers: [{ weight: "2.00" }]
                },
                {
                  featureType: "all",
                  elementType: "geometry.stroke",
                  stylers: [{ color: "#9c9c9c" }]
                },
                {
                  featureType: "all",
                  elementType: "labels.text",
                  stylers: [{ visibility: "on" }]
                }
              ],
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: true,
              scaleControl: true,
              streetViewControl: true,
              rotateControl: true,
              fullscreenControl: true,
              gestureHandling: 'greedy' // Makes the map more responsive to touch/scroll
            }}
          >
            {isScriptLoaded && (
              <>
                {/* Location Marker */}
                <Marker
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  title={selectedLocation.address || 'Selected Location'}
                  options={markerOptions}
                />
                
                {/* Radius Circle */}
                <Circle
                  center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  radius={selectedLocation.radius}
                  options={{
                    fillColor: '#10B981',
                    fillOpacity: 0.15,
                    strokeColor: '#10B981',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  }}
                />
              </>
            )}
          </GoogleMap>
        </LoadScript>
        
        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-800">Target Area</span>
          </div>
        </div>
      </div>

      {/* Location Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Location Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-500 rounded-xl p-3">
              <MapPinIconSolid className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-emerald-900 mb-2">Selected Location</h4>
              <p className="text-emerald-800 mb-3 leading-relaxed">
                {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-emerald-600 font-medium">Latitude:</span>
                  <div className="text-emerald-800 font-mono">{selectedLocation.lat.toFixed(6)}</div>
                </div>
                <div>
                  <span className="text-emerald-600 font-medium">Longitude:</span>
                  <div className="text-emerald-800 font-mono">{selectedLocation.lng.toFixed(6)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Targeting Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-500 rounded-xl p-3">
              <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Targeting Radius</h4>
              <div className="mb-3">
                <span className={`text-2xl font-bold ${getCurrentRadiusColor()}`}>
                  {formatRadius(selectedLocation.radius)}
                </span>
              </div>
              <div className="text-sm text-blue-800">
                <div className="mb-1">
                  <span className="font-medium">Coverage Area:</span> ~{(Math.PI * Math.pow(selectedLocation.radius / 1000, 2)).toFixed(1)} km²
                </div>
                <div>
                  <span className="font-medium">Perimeter:</span> ~{(2 * Math.PI * selectedLocation.radius / 1000).toFixed(1)} km
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200">
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-500 rounded-xl p-3 flex-shrink-0">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-indigo-900 mb-3">How to Select Your Target Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">🔍</span>
                  <span>Use the search box to find specific addresses, restaurants, or landmarks</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lg">📍</span>
                  <span>Click anywhere on the map to manually select a location</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">🎯</span>
                  <span>Adjust the targeting radius using the dropdown menu</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lg">👥</span>
                  <span>Users within the radius will see your campaign when they enter the area</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 