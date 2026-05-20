import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Building2, Loader2, AlertCircle, Search } from 'lucide-react';
import UserNavbar from '../components/Navbar';

const Home = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(''); // Empty means all
  const [error, setError] = useState('');

  useEffect(() => {
    // Prompt for location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          fetchHospitals(position.coords.latitude, position.coords.longitude, radius);
        },
        (err) => {
          console.log("Location denied or error:", err);
          setLocationEnabled(false);
          fetchHospitals(); // fetch all without location
        }
      );
    } else {
      fetchHospitals();
    }
  }, []);

  const fetchHospitals = async (lat, lng, maxRadius) => {
    setLoading(true);
    try {
      let url = 'http://localhost:5012/api/public/hospitals';
      const params = new URLSearchParams();
      if (lat && lng) {
        params.append('lat', lat);
        params.append('lng', lng);
      }
      if (maxRadius) {
        params.append('radius', maxRadius);
      }
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const res = await axios.get(url);
      setHospitals(res.data.hospitals || []);
    } catch (err) {
      setError("Failed to fetch hospitals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newRadius) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchHospitals(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  const handleManualFetch = () => {
     if (userLocation) {
        fetchHospitals(userLocation.lat, userLocation.lng, radius);
     } else {
        fetchHospitals();
     }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      
      {/* Location Warning Banner */}
      {!locationEnabled && !loading && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="container mx-auto flex items-center justify-center text-yellow-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p className="font-medium">Location services are disabled. We are showing all available hospitals. Enable location to see nearby hospitals.</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find the Best Hospitals Near You</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
            Discover verified healthcare facilities powered by Mapvon.
          </p>
          
          <div className="max-w-xl mx-auto bg-white p-2 rounded-xl shadow-lg flex items-center">
             <MapPin className="text-gray-400 w-6 h-6 ml-3" />
             <input type="text" placeholder="Search manually (coming soon)..." className="flex-1 text-gray-800 px-4 py-3 outline-none" disabled />
             <button onClick={handleManualFetch} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg font-bold flex items-center transition-colors">
               <Search className="w-5 h-5 mr-2" /> Search
             </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {hospitals.length} {hospitals.length === 1 ? 'Hospital' : 'Hospitals'} Found
          </h2>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-600 font-medium flex items-center"><Navigation className="w-4 h-4 mr-1" /> Radius:</span>
            <div className="flex space-x-2 bg-white p-1 rounded-lg border border-gray-200">
               {[
                 { label: 'All', value: '' },
                 { label: '5 km', value: '5' },
                 { label: '10 km', value: '10' },
                 { label: '15 km', value: '15' }
               ].map((f) => (
                 <button 
                  key={f.label}
                  onClick={() => handleFilterChange(f.value)}
                  disabled={!locationEnabled}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    radius === f.value ? 'bg-red-600 text-white shadow-sm' : 
                    !locationEnabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                 >
                   {f.label}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Hospital Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Looking for hospitals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">{error}</div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
             <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-900 mb-2">No Hospitals Found</h3>
             <p className="text-gray-500">We couldn't find any hospitals automatically. Try expanding your search radius.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hospitals.map(hospital => (
               <div key={hospital._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="h-48 bg-gray-200 relative">
                     {hospital.hospitalImages && hospital.hospitalImages.length > 0 ? (
                       <img src={hospital.hospitalImages[0]} alt={hospital.hospitalName} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                         <Building2 className="w-12 h-12 text-red-200" />
                       </div>
                     )}
                     {hospital.distance !== undefined && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm flex items-center">
                           <Navigation className="w-3 h-3 text-red-600 mr-1" />
                           {hospital.distance.toFixed(1)} km
                        </div>
                     )}
                     <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {hospital.serviceType === 'BOTH' ? 'OPD & IPD' : hospital.serviceType}
                     </div>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={hospital.hospitalName}>{hospital.hospitalName}</h3>
                     <p className="text-gray-500 text-sm mb-4 line-clamp-2" title={hospital.address}>
                       <MapPin className="w-4 h-4 inline mr-1 text-gray-400" />
                       {hospital.address}
                     </p>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-900">{hospital.contactNumber || 'No Phone'}</span>
                        <button className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors">View Details</button>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
