import React, {useState, useEffect} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { X, Edit, Trash2, UserPlus, Phone, Mail, MapPin, Tag } from 'lucide-react'
import { getOfficers, createOfficer, updateOfficer, deleteOfficer } from '../api/Officers'

const ManageOfficers = () => {
  const [showOfficerPopup, setShowOfficerPopup] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('add'); // 'add' or 'edit'
  const [editingOfficerId, setEditingOfficerId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'officer',
    assignedCategories: [],
    assignedLocations: '', // Store as string with commas
    phone: ''
  });

  const { getToken } = useAuth();

  const categories = [
    'Roads & Transport',
    'Street Lighting', 
    'Garbage & Sanitation',
    'Water Supply & Drainage',
    'Electricity',
    'Public Safety',
    'Other'
  ];

  useEffect(() => {
    fetchOfficers();
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const officersData = await getOfficers(token);
      setOfficers(officersData);
    } catch (error) {
      console.error('Error fetching officers:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      role: 'officer',
      assignedCategories: [],
      assignedLocations: '', // Reset to empty string
      phone: ''
    });
    setMode('add');
    setEditingOfficerId(null);
  };

  const handleAddOfficer = () => {
    resetForm();
    setShowOfficerPopup(true);
  };

  const handleEditOfficer = (officer) => {
    setFormData({
      fullName: officer.fullName || '',
      email: officer.email || '',
      role: officer.role || 'officer',
      assignedCategories: Array.isArray(officer.assignedCategories) ? officer.assignedCategories : [],
      assignedLocations: Array.isArray(officer.assignedLocations) ? officer.assignedLocations.join(', ') : '', // Convert array to string
      phone: officer.phone || ''
    });
    setMode('edit');
    setEditingOfficerId(officer._id); // Use MongoDB _id
    setShowOfficerPopup(true);
  };

  const handleDeleteOfficer = async (officerId) => {
    if (window.confirm('Are you sure you want to delete this officer?')) {
      try {
        const token = await getToken();
        await deleteOfficer(officerId, token);
        setOfficers(officers.filter(officer => officer._id !== officerId));
        console.log('Officer deleted successfully');
        // You could add a success toast notification here
      } catch (error) {
        console.error('Error deleting officer:', error);
        // You could add an error toast notification here
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      
      // Prepare data for submission - convert comma-separated locations to array
      const submissionData = {
        ...formData,
        assignedLocations: formData.assignedLocations
          ? formData.assignedLocations.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0)
          : []
      };
      
      if (mode === 'add') {
        const response = await createOfficer(submissionData, token);
        setOfficers([...officers, response.officer]);
        console.log('Officer added successfully:', response.officer);
        // You could add a success toast notification here
      } else {
        const response = await updateOfficer(editingOfficerId, submissionData, token);
        const updatedOfficers = officers.map(officer =>
          officer._id === editingOfficerId ? response.officer : officer
        );
        setOfficers(updatedOfficers);
        console.log('Officer updated successfully:', response.officer);
        // You could add a success toast notification here
      }
      
      setShowOfficerPopup(false);
      resetForm();
    } catch (error) {
      console.error('Error saving officer:', error);
      // You could add an error toast notification here
      // For now, show the error message in an alert
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while saving the officer. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = formData.assignedCategories.includes(category)
      ? formData.assignedCategories.filter(cat => cat !== category)
      : [...formData.assignedCategories, category];
    
    setFormData((prevData) => ({
      ...prevData,
      assignedCategories: updatedCategories
    }));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      assignedLocations: value // Store the raw string value
    }));
  };

  return (
    <>
      <div className={`max-w-6xl mx-auto px-4 transition-opacity duration-300 ${showOfficerPopup ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className='text-2xl text-zinc-800 font-bold'>Manage Officers</h1>
          <button 
            onClick={handleAddOfficer}
            className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            <UserPlus className="w-4 h-4" />
            Add Officer
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading officers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officers.map(officer => (
              <div key={officer._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800">{officer.fullName}</h3>
                    <span className="inline-block capitalize px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {officer.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOfficer(officer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Officer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOfficer(officer._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Officer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{officer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{officer.phone}</span>
                  </div>
                  
                  {officer.assignedCategories && officer.assignedCategories.length > 0 && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <Tag className="w-4 h-4 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {officer.assignedCategories.map((category, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {officer.assignedLocations && officer.assignedLocations.length > 0 && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {officer.assignedLocations.map((location, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {officers.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Officers Found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first officer to the system.</p>
            <button 
              onClick={handleAddOfficer}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add First Officer
            </button>
          </div>
        )}
      </div>

      {showOfficerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-800">
                {mode === 'add' ? 'Add New Officer' : 'Edit Officer'}
              </h2>
              <button
                onClick={() => setShowOfficerPopup(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border border-zinc-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2" htmlFor="email">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-zinc-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-zinc-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-zinc-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="officer">Officer</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>

              {/* Assigned Categories */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Assigned Categories
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assigned Locations */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2" htmlFor="assignedLocations">
                  Assigned Locations
                </label>
                <input
                  type="text"
                  id="assignedLocations"
                  value={formData.assignedLocations}
                  onChange={handleLocationChange}
                  className="w-full border border-zinc-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter locations separated by commas (e.g., Downtown, North District)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple locations with commas
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowOfficerPopup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    mode === 'add' ? 'Add Officer' : 'Update Officer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ManageOfficers
