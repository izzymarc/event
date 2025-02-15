import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, X, DollarSign } from 'lucide-react';
import { useToast } from '../../lib/hooks/useToast';
import { LoadingState } from '../ui/LoadingState';

interface ServicePackage {
  id: string;
  title: string;
  description?: string;
  price: number;
}

interface ServicePackagesProps {
  vendorId: string;
  isOwnProfile: boolean;
  packages: ServicePackage[]; // Packages are now passed as a prop
  loading: boolean; // Loading state is now passed as a prop
}

const ServicePackages: React.FC<ServicePackagesProps> = ({ vendorId, isOwnProfile, packages, loading: packagesLoading }) => { // Updated props
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editPackage, setEditPackage] = useState<Partial<ServicePackage>>({});
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPackage, setNewPackage] = useState<ServicePackage>({
    id: '',
    title: '',
    description: '',
    price: 0
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isNew = false) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewPackage(prev => ({ ...prev, [name]: value }));
    } else {
      setEditPackage(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, isNew = false) => {
    const { name, value } = e.target;
     if (isNew) {
      setNewPackage(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setEditPackage(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
  };

  const startEditing = (pkg: ServicePackage) => {
    setIsEditing(pkg.id);
    setEditPackage(pkg);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditPackage({});
  };

  const updatePackage = async () => {
    if (!isEditing || !editPackage.title || !editPackage.price) {
      addToast('Title and price are required', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('service_packages')
        .update(editPackage)
        .eq('id', isEditing);
      if (error) throw error;
      // Removed fetchServicePackages call here
      setIsEditing(null);
      setEditPackage({});
      addToast('Package updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating package:', error);
      addToast(error.message || 'Failed to update package', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this service package?');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('service_packages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      // Removed fetchServicePackages call here
      addToast('Package deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting package:', error);
      addToast(error.message || 'Failed to delete package', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startCreatingNew = () => {
    setIsCreatingNew(true);
  };

  const cancelCreatingNew = () => {
    setIsCreatingNew(false);
    setNewPackage({ id: '', title: '', description: '', price: 0 });
  };

  const createNewPackage = async () => {
     if (!newPackage.title || !newPackage.price) {
      addToast('Title and price are required', 'warning');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('service_packages')
        .insert([{ ...newPackage, vendor_id: user?.id }]);
      if (error) throw error;
      // Removed fetchServicePackages call here
      setIsCreatingNew(false);
      setNewPackage({ id: '', title: '', description: '', price: 0 });
      addToast('Package created successfully', 'success');
    } catch (error: any) {
      console.error('Error creating new package:', error);
      addToast(error.message || 'Failed to create package', 'error');
    } finally {
      setLoading(false);
    }
  };


  if (packagesLoading) { // Use packagesLoading prop
    return <LoadingState type="list" rows={3} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Service Packages</h2>
        {isOwnProfile && (
          <motion.button
            onClick={startCreatingNew}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isCreatingNew && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 border rounded-md"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Package</h3>
            {/* ... (new package form) */}
          </motion.div>
        )}
      </AnimatePresence>

      {packages.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No service packages listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <motion.div
              layout
              key={pkg.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              {/* ... (service package display) */}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default ServicePackages;
