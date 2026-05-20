import React from 'react';
import { useNavigate } from 'react-router-dom';
import LabDashboard from '../Laboratory/LabDashboard';

/**
 * Thin wrapper around LabDashboard for staff users.
 * Overrides the navigation so "Open Lab Portal" goes to /staff/laboratory/patient/:id
 * instead of the subadmin path.
 */
const StaffLabDashboard = () => {
  return <LabDashboard staffBasePath="/staff/laboratory" />;
};

export default StaffLabDashboard;
