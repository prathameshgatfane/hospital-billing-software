import React, { useState, useEffect } from 'react';
import ProfileCreation from '../components/Profile/ProfileCreation';
import MyProfile from '../components/Profile/Profile';
import { profileApi } from '../API/profileApi';
import { Loader2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [basicInfo, setBasicInfo] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false); // New state for edit mode

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    setLoading(true);
    try {
      const response = await profileApi.getProfile();
      if (response.success) {
        // Check if profile exists and has required fields
        const hasProfile = response.profile && 
          response.profile.address && 
          response.profile.pincode;
        
        setProfileExists(hasProfile);
        setProfileData(response.profile);
        setBasicInfo(response.basicInfo);
      } else {
        // If no profile found, show creation form
        setProfileExists(false);
      }
    } catch (error) {
      console.error('Profile check error:', error);
      // If it's a 404 or similar, show creation form
      if (error.response?.status === 404) {
        setProfileExists(false);
      } else {
        setError('Failed to check profile status');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileCreated = () => {
    // After profile is created, refresh to show the profile view
    checkProfile();
    setEditMode(false); // Switch back to view mode
  };

  const handleEditProfile = () => {
    // Switch to edit mode
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    // Switch back to view mode
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600">Checking profile status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={checkProfile}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no profile exists OR we're in edit mode, show ProfileCreation
  if (!profileExists || editMode) {
    return (
      <ProfileCreation 
        existingData={profileData} // Pass existing data for edit mode
        onProfileCreated={handleProfileCreated}
        onCancel={handleCancelEdit}
        isEditMode={editMode && profileExists} // Pass edit mode flag
      />
    );
  }

  // Otherwise, show MyProfile
  return (
    <MyProfile 
      profileData={profileData}
      basicInfo={basicInfo}
      onEditProfile={handleEditProfile}
    />
  );
};

export default Profile;