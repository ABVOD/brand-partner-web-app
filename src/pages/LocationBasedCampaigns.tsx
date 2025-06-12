import { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LocationPicker from '../components/LocationPicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import QRCode from 'qrcode';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  SparklesIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon,
  PlusIcon,
  PhotoIcon,
  DocumentTextIcon,
  TagIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  radius: number; // in meters
}

interface LocationBasedCampaign {
  id: string;
  name: string;
  bannerImage: string;
  startDate: Date;
  endDate: Date;
  status: 'scheduled' | 'active' | 'completed' | 'paused';
  location: LocationData;
  offerDetails: string;
  couponCode?: string;
  qrCodeData?: string;
  termsAndConditions: string;
  campaignFee: number;
  redemptionCount: number;
  viewCount: number;
  clickCount: number;
}

export default function LocationBasedCampaigns() {
  const calculateCampaignFee = (location: LocationData, startDate: Date, endDate: Date) => {
    const baseFee = 50; // $50 base fee
    const radiusFee = (location.radius / 1000) * 25; // $25 per km radius
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationFee = durationDays * 15; // $15 per day
    
    return Math.round(baseFee + radiusFee + durationFee);
  };

  const [campaigns, setCampaigns] = useState<LocationBasedCampaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [qrCodePreview, setQrCodePreview] = useState<string>('');
  const [newCampaign, setNewCampaign] = useState<Partial<LocationBasedCampaign>>({
    name: '',
    bannerImage: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '',
      radius: 1000
    },
    offerDetails: '',
    couponCode: '',
    qrCodeData: '',
    termsAndConditions: '',
    campaignFee: calculateCampaignFee(
      { lat: 40.7128, lng: -74.0060, address: '', radius: 1000 },
      new Date(),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ),
    redemptionCount: 0,
    viewCount: 0,
    clickCount: 0
  });

  const handleLocationSelect = useCallback((location: LocationData) => {
    const fee = calculateCampaignFee(location, newCampaign.startDate!, newCampaign.endDate!);
    setNewCampaign(prev => ({
      ...prev,
      location,
      campaignFee: fee
    }));
  }, [newCampaign.startDate, newCampaign.endDate]);

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date) => {
    const updatedCampaign = { ...newCampaign, [field]: date };
    const fee = calculateCampaignFee(
      updatedCampaign.location!,
      updatedCampaign.startDate!,
      updatedCampaign.endDate!
    );
    setNewCampaign({
      ...updatedCampaign,
      campaignFee: fee
    });
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedBanner(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBannerPreview(result);
        setNewCampaign(prev => ({ ...prev, bannerImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = async (couponCode: string, campaignName: string) => {
    if (!couponCode.trim()) {
      setQrCodePreview('');
      return;
    }
    
    try {
      const qrData = JSON.stringify({
        couponCode: couponCode,
        campaignName: campaignName,
        timestamp: Date.now(),
        type: 'LOCATION_CAMPAIGN_COUPON'
      });
      
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      
      setQrCodePreview(qrCodeUrl);
      setNewCampaign(prev => ({ ...prev, qrCodeData: qrCodeUrl }));
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleCouponCodeChange = (value: string) => {
    setNewCampaign(prev => ({ ...prev, couponCode: value }));
    if (value.trim() && newCampaign.name) {
      generateQRCode(value, newCampaign.name);
    } else {
      setQrCodePreview('');
      setNewCampaign(prev => ({ ...prev, qrCodeData: '' }));
    }
  };

  const handleCampaignNameChange = (value: string) => {
    setNewCampaign(prev => ({ ...prev, name: value }));
    if (value.trim() && newCampaign.couponCode) {
      generateQRCode(newCampaign.couponCode, value);
    }
  };

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.location && newCampaign.offerDetails && newCampaign.termsAndConditions) {
      const finalFee = calculateCampaignFee(
        newCampaign.location,
        newCampaign.startDate!,
        newCampaign.endDate!
      );
      
      const campaign: LocationBasedCampaign = {
        id: Date.now().toString(),
        name: newCampaign.name,
        bannerImage: newCampaign.bannerImage || '',
        startDate: newCampaign.startDate as Date,
        endDate: newCampaign.endDate as Date,
        status: 'scheduled',
        location: newCampaign.location as LocationData,
        offerDetails: newCampaign.offerDetails,
        couponCode: newCampaign.couponCode || '',
        qrCodeData: newCampaign.qrCodeData || '',
        termsAndConditions: newCampaign.termsAndConditions,
        campaignFee: finalFee,
        redemptionCount: Math.floor(Math.random() * 50) + 5,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        clickCount: Math.floor(Math.random() * 200) + 20
      };
      setCampaigns([...campaigns, campaign]);
      setIsCreating(false);
      setSelectedBanner(null);
      setBannerPreview('');
      setQrCodePreview('');
      setNewCampaign({
        name: '',
        bannerImage: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: '',
          radius: 1000
        },
        offerDetails: '',
        couponCode: '',
        qrCodeData: '',
        termsAndConditions: '',
        campaignFee: calculateCampaignFee(
          { lat: 40.7128, lng: -74.0060, address: '', radius: 1000 },
          new Date(),
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ),
        redemptionCount: 0,
        viewCount: 0,
        clickCount: 0
      });
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-900/50 text-green-300 border-green-700',
          icon: CheckCircleIcon
        };
      case 'scheduled':
        return {
          color: 'bg-blue-900/50 text-blue-300 border-blue-700',
          icon: ClockIcon
        };
      case 'completed':
        return {
          color: 'bg-gray-600/50 text-gray-300 border-gray-500',
          icon: CheckCircleIcon
        };
      case 'paused':
        return {
          color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
          icon: ClockIcon
        };
      default:
        return {
          color: 'bg-gray-600/50 text-gray-300 border-gray-500',
          icon: ClockIcon
        };
    }
  };

  const formatRadius = (radius: number) => {
    if (radius >= 1000) {
      return `${(radius / 1000).toFixed(1)} km`;
    }
    return `${radius} m`;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="space-y-8">
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 py-12 shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-xl bg-white/20 p-3">
                      <MapPinIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white">
                        Location-Based Campaigns
                      </h1>
                      <p className="text-xl text-purple-100 mt-2">
                        Launch targeted promotional campaigns visible to users in your location radius
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-purple-100 max-w-2xl">
                    Perfect for retailers, fast food chains, and service centers. Create compelling offers with banners, 
                    location targeting, and track customer engagement and redemptions.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <button
                    onClick={() => setIsCreating(true)}
                    className="group relative overflow-hidden rounded-xl bg-gray-800 border border-purple-600/50 px-8 py-4 text-lg font-semibold text-purple-400 shadow-lg transition-all duration-300 hover:bg-gray-700 hover:shadow-xl hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <PlusIcon className="h-6 w-6" />
                      <span>Create Campaign</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Create Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-3">
                <PlusIcon className="h-6 w-6" />
                <span>Create Location Campaign</span>
              </div>
            </button>
          </div>

          {/* Campaign Creation Modal */}
          {isCreating && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCreating(false)}></div>
                <div className="relative w-full max-w-6xl mx-auto">
                  <div className="relative rounded-2xl bg-gray-800 shadow-2xl">
                    {/* Modal Header */}
                    <div className="border-b border-gray-700 px-8 py-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-100">Create Location Campaign</h2>
                          <p className="text-gray-400 mt-1">Launch a promotional campaign with location targeting and track redemptions</p>
                        </div>
                        <button
                          onClick={() => setIsCreating(false)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        >
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="max-h-[80vh] overflow-y-auto px-8 py-6">
                      <div className="space-y-8">
                        {/* Basic Campaign Info */}
                        <div className="rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 border border-purple-700/50">
                          <h3 className="text-lg font-semibold text-gray-100 mb-6 flex items-center">
                            <div className="rounded-lg bg-purple-600 p-2 mr-3">
                              <SparklesIcon className="h-5 w-5 text-white" />
                            </div>
                            Campaign Details
                          </h3>
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="lg:col-span-2">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Campaign Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., McDonald's Downtown Lunch Rush"
                                value={newCampaign.name}
                                onChange={(e) => handleCampaignNameChange(e.target.value)}
                                className="w-full rounded-lg border-0 bg-gray-700 px-4 py-3 text-gray-100 shadow-sm ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Banner Image
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                className="w-full rounded-lg border-0 bg-gray-700 px-4 py-3 text-gray-100 shadow-sm ring-1 ring-gray-600 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Offer Details
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Describe the offer details..."
                                value={newCampaign.offerDetails}
                                onChange={(e) => setNewCampaign({ ...newCampaign, offerDetails: e.target.value })}
                                className="w-full rounded-lg border-0 bg-gray-700 px-4 py-3 text-gray-100 shadow-sm ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                QR Coupon Code (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., SAVE20, DISCOUNT15"
                                value={newCampaign.couponCode}
                                onChange={(e) => handleCouponCodeChange(e.target.value)}
                                className="w-full rounded-lg border-0 bg-gray-700 px-4 py-3 text-gray-100 shadow-sm ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                              />
                              <p className="text-xs text-gray-500 mt-1">QR code will be automatically generated for easy scanning</p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Start Date & Time
                              </label>
                              <DatePicker
                                selected={newCampaign.startDate}
                                onChange={(date) => handleDateChange('startDate', date as Date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="w-full rounded-lg border-0 bg-gray-700 px-4 py-3 text-gray-100 shadow-sm ring-1 ring-gray-600 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                End Date & Time
                              </label>
                              <DatePicker
                                selected={newCampaign.endDate}
                                onChange={(date) => handleDateChange('endDate', date as Date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="w-full rounded-lg border-0 bg-gray-700 px-4 py-3 text-gray-100 shadow-sm ring-1 ring-gray-600 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                              />
                            </div>

                            <div className="lg:col-span-2">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Terms and Conditions
                              </label>
                              <textarea
                                rows={4}
                                placeholder="Enter terms and conditions for this offer..."
                                value={newCampaign.termsAndConditions}
                                onChange={(e) => setNewCampaign({ ...newCampaign, termsAndConditions: e.target.value })}
                                className="w-full rounded-lg border-0 bg-gray-700 px-4 py-3 text-gray-100 shadow-sm ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                              />
                            </div>

                            {/* Banner Preview */}
                            {bannerPreview && (
                              <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Banner Preview
                                </label>
                                <div className="relative rounded-lg overflow-hidden border border-gray-600">
                                  <img 
                                    src={bannerPreview} 
                                    alt="Banner preview"
                                    className="w-full h-48 object-cover"
                                  />
                                </div>
                              </div>
                            )}

                            {/* QR Code Preview */}
                            {qrCodePreview && (
                              <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  QR Code Preview
                                </label>
                                <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                  <img 
                                    src={qrCodePreview} 
                                    alt="QR Code preview"
                                    className="w-20 h-20 rounded border border-gray-500"
                                  />
                                  <div>
                                    <p className="text-gray-100 font-medium">QR Coupon Code: {newCampaign.couponCode}</p>
                                    <p className="text-gray-400 text-sm">Customers can scan this to redeem the offer</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Location Selection */}
                        <div className="rounded-xl bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-6 border border-green-700/50">
                          <h3 className="text-lg font-semibold text-gray-100 mb-6 flex items-center">
                            <div className="rounded-lg bg-green-600 p-2 mr-3">
                              <MapPinIcon className="h-5 w-5 text-white" />
                            </div>
                            Target Location & Radius
                          </h3>

                          <div className="space-y-6">
                            <LocationPicker
                              onLocationSelect={handleLocationSelect}
                              initialLocation={newCampaign.location}
                            />

                            {/* Campaign Fee Display */}
                            {newCampaign.location && (
                              <div className="rounded-lg bg-purple-900/20 border border-purple-700/50 p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-100">Campaign Fee</h4>
                                    <p className="text-gray-400 text-sm">Based on location radius and campaign duration</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-3xl font-bold text-purple-400">${newCampaign.campaignFee}</div>
                                    <div className="text-sm text-gray-400">
                                      {formatRadius(newCampaign.location.radius)} • {Math.ceil((newCampaign.endDate!.getTime() - newCampaign.startDate!.getTime()) / (1000 * 60 * 60 * 24))} days
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                          <button
                            onClick={() => setIsCreating(false)}
                            className="rounded-lg px-6 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCreateCampaign}
                            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            Create Campaign
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns List */}
          <div className="rounded-2xl bg-gray-800 shadow-xl border border-gray-700">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Active Campaigns</h2>
                  <p className="text-gray-400 mt-1">Manage your location-based advertising campaigns</p>
                </div>
                {campaigns.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {campaigns.length} campaign{campaigns.length === 1 ? '' : 's'} total
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {campaigns.map((campaign) => {
                  const statusConfig = getStatusConfig(campaign.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={campaign.id}
                      className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-600/50"
                    >
                      {/* Campaign Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-xl bg-purple-900/50 border-purple-700 border p-3">
                            <TagIcon className="h-6 w-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-100">{campaign.name}</h3>
                              <span className={`inline-flex items-center space-x-1 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                <span className="capitalize">{campaign.status}</span>
                              </span>
                            </div>
                            
                            {/* Campaign Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPinIcon className="h-4 w-4" />
                                <span>{formatRadius(campaign.location.radius)} radius</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>💰 Campaign Fee: ${campaign.campaignFee}</span>
                              </div>
                              {campaign.couponCode && (
                                <div className="flex items-center space-x-1">
                                  <QrCodeIcon className="h-4 w-4" />
                                  <span>QR Coupon: {campaign.couponCode}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Location */}
                            <div className="mt-2 text-sm text-gray-400">
                              <div className="flex items-start space-x-2">
                                <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-300">{campaign.location.address || 'Selected Location'}</p>
                                  <p className="text-gray-500">Coordinates: {campaign.location.lat.toFixed(6)}, {campaign.location.lng.toFixed(6)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Offer Details */}
                            <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-700/50">
                              <p className="text-sm text-green-300 font-medium">Offer:</p>
                              <p className="text-sm text-green-400">{campaign.offerDetails}</p>
                            </div>

                            {/* QR Code Display */}
                            {campaign.qrCodeData && (
                              <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-700/50">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm text-blue-300 font-medium">QR Coupon Code:</p>
                                  <QrCodeIcon className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="flex items-center space-x-3">
                                  <img 
                                    src={campaign.qrCodeData} 
                                    alt={`QR Code for ${campaign.couponCode}`}
                                    className="w-16 h-16 rounded border border-blue-600"
                                  />
                                  <div>
                                    <p className="text-sm text-blue-300 font-medium">{campaign.couponCode}</p>
                                    <p className="text-xs text-blue-400">Scan to redeem offer</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors duration-200">
                            Analytics
                          </button>
                          <button className="rounded-lg bg-purple-900/50 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-800/50 transition-colors duration-200">
                            Edit
                          </button>
                          <button className="rounded-lg bg-red-900/50 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-800/50 transition-colors duration-200">
                            Deactivate
                          </button>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-100">
                            <EyeIcon className="h-5 w-5 text-blue-400" />
                            <span>{campaign.viewCount.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-100">
                            <CursorArrowRaysIcon className="h-5 w-5 text-green-400" />
                            <span>{campaign.clickCount.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-100">
                            <CheckCircleIcon className="h-5 w-5 text-purple-400" />
                            <span>{campaign.redemptionCount.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">Redemptions</div>
                        </div>
                      </div>

                      {/* Banner Display */}
                      {campaign.bannerImage && (
                        <div className="mt-6 pt-6 border-t border-gray-700">
                          <p className="text-sm font-medium text-gray-300 mb-2">Campaign Banner</p>
                          <img 
                            src={campaign.bannerImage} 
                            alt={campaign.name}
                            className="w-full h-32 object-cover rounded-lg border border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty State */}
                {campaigns.length === 0 && (
                  <div className="text-center py-16">
                    <div className="rounded-full bg-gradient-to-r from-purple-900/50 to-blue-900/50 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <MapPinIcon className="h-10 w-10 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">No campaigns yet</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Get started by creating your first geo-targeted campaign and reach customers in specific locations.
                    </p>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="inline-flex items-center space-x-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <PlusIcon className="h-6 w-6" />
                      <span>Create Your First Campaign</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 