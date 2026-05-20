import HospitalProfile from "../models/HospitalProfile.js";
import Client from "../models/Client.js"; // Needed for populate

// Haversine formula to calculate distance in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

export const getHospitals = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    
    // Fetch approved & active hospitals, populating the tenant (Client) to get the hospital name
    const profiles = await HospitalProfile.find({ verificationStatus: "APPROVED", isActive: true })
        .populate({ path: "tenantId", select: "hospitalName contactNumber email" });
    
    let results = profiles.map(profile => {
        return {
            _id: profile._id,
            tenantId: profile.tenantId?._id,
            hospitalName: profile.tenantId?.hospitalName || profile.purchaseName || "Unknown Hospital",
            email: profile.tenantId?.email || profile.alternateEmail,
            contactNumber: profile.secondaryMobile || profile.tenantId?.contactNumber,
            address: profile.address,
            pincode: profile.pincode,
            latitude: profile.latitude,
            longitude: profile.longitude,
            serviceType: profile.serviceType,
            hospitalImages: profile.hospitalImages || []
        };
    });

    if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const maxDist = radius ? parseFloat(radius) : Infinity; // Infinity if no radius applied
        
        results = results.filter(h => {
            if (!h.latitude || !h.longitude) return false;
            const dist = calculateDistance(userLat, userLng, h.latitude, h.longitude);
            h.distance = dist; 
            return dist <= maxDist;
        });

        // Always sort by distance when mapping
        results.sort((a, b) => a.distance - b.distance);
    }
    
    res.status(200).json({ success: true, count: results.length, hospitals: results });
  } catch (error) {
    console.error("GET PUBLIC HOSPITALS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hospitals" });
  }
};
