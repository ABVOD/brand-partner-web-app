# Location-Based Campaigns Setup Guide

This guide will help you set up the location-based campaigns feature that allows brands to create geo-fenced advertising campaigns.

## Features

✅ **Interactive Map Selection**: Use Google Maps to select target locations  
✅ **Radius Configuration**: Set custom targeting radius (100m to 20km)  
✅ **Real-time Geofencing**: Detect when users enter/exit campaign areas  
✅ **Campaign Types**: Support for geo-targeted, POI-based, and competitor targeting  
✅ **Mobile-Friendly**: Responsive design works on all devices  

## Prerequisites

1. **Google Maps API Key**: You'll need a Google Cloud Platform account and Maps JavaScript API key
2. **HTTPS**: Geolocation requires HTTPS in production
3. **Browser Support**: Modern browsers with Geolocation API support

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domains for security

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Optional: Other configuration
REACT_APP_API_URL=your_backend_api_url
```

### 3. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/location-campaigns` in your app
3. Click "Create Location Campaign"
4. Test the map functionality:
   - Search for locations
   - Click on the map to select points
   - Adjust the radius selector
   - Verify the blue circle appears on the map

### 4. Test Geolocation (For Consumer View)

To test the consumer-facing campaign display:

1. Import and use the `CampaignDisplay` component:
   ```tsx
   import CampaignDisplay from './components/CampaignDisplay';
   
   // Use with your active campaigns
   <CampaignDisplay 
     campaigns={activeCampaigns}
     onCampaignClick={(campaign) => console.log('Clicked:', campaign)}
   />
   ```

2. Allow location access in your browser
3. Create campaigns near your current location
4. Watch for campaign popups when you enter the radius

## Campaign Types Explained

### 1. Geo-Targeted Campaigns
- **Use Case**: General area targeting (downtown, neighborhood)
- **Example**: "20% off for all customers in downtown area"
- **Radius**: Typically 1-10km

### 2. POI-Based Campaigns  
- **Use Case**: Specific business location targeting
- **Example**: "McDonald's lunch special near Times Square"
- **Radius**: Typically 100m-1km

### 3. Competitor Targeting
- **Use Case**: Target customers near competitor locations
- **Example**: "Better deals than Starbucks across the street"
- **Radius**: Typically 250m-2km

## How It Works

### For Brands (Campaign Creation):
1. Select target location using Google Maps
2. Set radius for geo-fence
3. Configure campaign details and audience
4. Set campaign schedule and budget
5. Campaign goes live and starts monitoring

### For Consumers (Campaign Display):
1. User visits your website/app
2. Location permission is requested
3. System monitors user's location
4. When user enters campaign radius:
   - Campaign popup appears
   - User can interact with offer
   - Click tracking and analytics recorded

## File Structure

```
src/
├── components/
│   ├── LocationPicker.tsx         # Google Maps integration
│   ├── CampaignDisplay.tsx        # Consumer-facing display
│   └── DashboardLayout.tsx        # Updated navigation
├── pages/
│   └── LocationBasedCampaigns.tsx # Main campaign management
├── utils/
│   └── geolocation.ts            # Geofencing utilities
└── App.tsx                       # Updated routing
```

## Security Considerations

1. **API Key Security**: 
   - Restrict your Google Maps API key to your domains
   - Don't commit API keys to version control
   - Use environment variables

2. **Location Privacy**:
   - Always request user permission
   - Explain why location is needed
   - Provide opt-out options
   - Follow GDPR/privacy regulations

3. **Rate Limiting**:
   - Monitor Google Maps API usage
   - Set up billing alerts
   - Implement caching where possible

## Troubleshooting

### Common Issues:

1. **Map not loading**:
   - Check API key configuration
   - Verify APIs are enabled in Google Cloud
   - Check browser console for errors

2. **Geolocation not working**:
   - Ensure HTTPS in production
   - Check browser permissions
   - Test on different devices

3. **Search not working**:
   - Verify Places API is enabled
   - Check API key restrictions
   - Test with different search terms

### Debug Tools:

1. **Browser Console**: Check for JavaScript errors
2. **Network Tab**: Verify API calls are successful
3. **Google Cloud Console**: Monitor API usage and quotas

## Example Implementation

Here's a quick example of how to integrate the location campaigns:

```tsx
// In your main app component
import { useState, useEffect } from 'react';
import CampaignDisplay from './components/CampaignDisplay';

function App() {
  const [activeCampaigns, setActiveCampaigns] = useState([]);

  useEffect(() => {
    // Fetch active campaigns from your API
    fetchActiveCampaigns().then(setActiveCampaigns);
  }, []);

  return (
    <div>
      {/* Your existing app content */}
      
      {/* Location-based campaign display */}
      <CampaignDisplay 
        campaigns={activeCampaigns}
        onCampaignClick={(campaign) => {
          // Track campaign interaction
          analytics.track('campaign_clicked', { campaignId: campaign.id });
          
          // Handle campaign action
          if (campaign.ctaUrl) {
            window.open(campaign.ctaUrl, '_blank');
          }
        }}
        onCampaignClose={(campaign) => {
          // Track campaign dismissal
          analytics.track('campaign_dismissed', { campaignId: campaign.id });
        }}
      />
    </div>
  );
}
```

## Next Steps

1. **Backend Integration**: Connect to your campaign management API
2. **Analytics**: Add tracking for campaign performance
3. **Push Notifications**: Enhance with push notifications for better engagement
4. **A/B Testing**: Test different campaign formats and targeting strategies
5. **Advanced Targeting**: Add demographic and interest-based filters

For more advanced features or custom implementations, refer to the component source code and Google Maps API documentation. 