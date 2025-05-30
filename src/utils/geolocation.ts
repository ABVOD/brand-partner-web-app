export interface GeoLocation {
  lat: number;
  lng: number;
  timestamp?: number;
}

export interface GeofenceArea {
  id: string;
  center: GeoLocation;
  radius: number; // in meters
  campaignId: string;
}

/**
 * Calculate the distance between two geographic points using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if a user location is within a geofence area
 * @param userLocation User's current location
 * @param geofence Geofence area to check
 * @returns true if user is within the geofence
 */
export function isWithinGeofence(userLocation: GeoLocation, geofence: GeofenceArea): boolean {
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    geofence.center.lat,
    geofence.center.lng
  );
  return distance <= geofence.radius;
}

/**
 * Get user's current location using browser geolocation API
 * @returns Promise that resolves to user's location
 */
export function getCurrentLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache location for 1 minute
      }
    );
  });
}

/**
 * Start watching user's location for geofence detection
 * @param onLocationUpdate Callback when location changes
 * @param onGeofenceEnter Callback when user enters a geofence
 * @param onGeofenceExit Callback when user exits a geofence
 * @param geofences Array of geofences to monitor
 * @returns Watch ID that can be used to stop watching
 */
export function startLocationWatching(
  onLocationUpdate: (location: GeoLocation) => void,
  onGeofenceEnter: (geofence: GeofenceArea, location: GeoLocation) => void,
  onGeofenceExit: (geofence: GeofenceArea, location: GeoLocation) => void,
  geofences: GeofenceArea[]
): number {
  let lastKnownGeofences: Set<string> = new Set();

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const location: GeoLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: Date.now(),
      };

      onLocationUpdate(location);

      // Check which geofences the user is currently in
      const currentGeofences = new Set<string>();
      
      geofences.forEach((geofence) => {
        if (isWithinGeofence(location, geofence)) {
          currentGeofences.add(geofence.id);
          
          // User entered a new geofence
          if (!lastKnownGeofences.has(geofence.id)) {
            onGeofenceEnter(geofence, location);
          }
        }
      });

      // Check for geofences the user exited
      lastKnownGeofences.forEach((geofenceId) => {
        if (!currentGeofences.has(geofenceId)) {
          const geofence = geofences.find(g => g.id === geofenceId);
          if (geofence) {
            onGeofenceExit(geofence, location);
          }
        }
      });

      lastKnownGeofences = currentGeofences;
    },
    (error) => {
      console.error('Location watching error:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000, // Use cached location for 30 seconds
    }
  );

  return watchId;
}

/**
 * Stop watching user's location
 * @param watchId Watch ID returned from startLocationWatching
 */
export function stopLocationWatching(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}

/**
 * Check if geolocation is supported by the browser
 * @returns true if geolocation is supported
 */
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Request location permission from the user
 * @returns Promise that resolves to permission state
 */
export async function requestLocationPermission(): Promise<PermissionState> {
  if ('permissions' in navigator) {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state;
  }
  
  // Fallback: try to get location to check permission
  try {
    await getCurrentLocation();
    return 'granted';
  } catch (error) {
    return 'denied';
  }
}

/**
 * Convert meters to a human-readable distance string
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * Create a geofence from campaign location data
 * @param campaignId Campaign ID
 * @param location Campaign location
 * @returns GeofenceArea object
 */
export function createGeofenceFromCampaign(
  campaignId: string,
  location: { lat: number; lng: number; radius: number }
): GeofenceArea {
  return {
    id: `campaign_${campaignId}`,
    center: {
      lat: location.lat,
      lng: location.lng,
    },
    radius: location.radius,
    campaignId,
  };
} 