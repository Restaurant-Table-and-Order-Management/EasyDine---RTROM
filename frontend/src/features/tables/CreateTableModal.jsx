import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useDataStore from '../../store/dataStore';
import { TABLE_LOCATIONS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function CreateTableModal({ isOpen, onClose }) {
  const { createTable } = useDataStore();

  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: 'Indoor',
    floorNumber: '1',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.tableNumber.trim()) {
      newErrors.tableNumber = 'Table number is required';
    }
    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    if (parseInt(formData.capacity) > 20) {
      newErrors.capacity = 'Maximum capacity is 20';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    if (
      !formData.floorNumber ||
      parseInt(formData.floorNumber) < 1 ||
      parseInt(formData.floorNumber) > 10
    ) {
      newErrors.floorNumber = 'Floor must be between 1 and 10';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await createTable({
      tableNumber: formData.tableNumber,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      floorNumber: parseInt(formData.floorNumber),
    });
    setLoading(false);

    if (result.success) {
      toast.success('Table created successfully!');
      setFormData({
        tableNumber: '',
        capacity: '',
        location: 'Indoor',
        floorNumber: '1',
      });
      setErrors({});
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Table" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Table Number"
          name="tableNumber"
          placeholder="e.g. T1, A101"
          value={formData.tableNumber}
          onChange={handleChange}
          error={errors.tableNumber}
        />

        <Input
          label="Capacity (seats)"
          type="number"
          name="capacity"
          placeholder="4"
          min="1"
          max="20"
          value={formData.capacity}
          onChange={handleChange}
          error={errors.capacity}
        />

        <div className="w-full">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm transition-all duration-200 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange appearance-none"
          >
            {TABLE_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.location}
            </p>
          )}
        </div>

        <Input
          label="Floor Number"
          type="number"
          name="floorNumber"
          placeholder="1"
          min="1"
          max="10"
          value={formData.floorNumber}
          onChange={handleChange}
          error={errors.floorNumber}
        />

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            type="button"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Create Table
          </Button>
        </div>
      </form>
    </Modal>
  );
}
