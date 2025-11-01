import React, { useState, useEffect, useCallback } from 'react';
import { getNurses, deleteNurse, downloadCSV, downloadXLSX } from '../api/nurseApi';
import NurseModal from './NurseModal';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'licenseNumber', label: 'License Number' },
  { key: 'dob', label: 'DOB' },
  { key: 'age', label: 'Age' }
];

export default function NurseList() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    licenseNumber: '',
    ageMin: '',
    ageMax: '',
    dobFrom: '',
    dobTo: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    licenseNumber: '',
    ageMin: '',
    ageMax: '',
    dobFrom: '',
    dobTo: ''
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchNurses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNurses(sortBy, order, debouncedSearch, appliedFilters);
      setNurses(data);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      setNurses([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, order, debouncedSearch, appliedFilters]);

  useEffect(() => { 
    fetchNurses(); 
  }, [fetchNurses]);

  const handleSort = (col) => {
    if (col === sortBy) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else {
      setSortBy(col); 
      setOrder('ASC');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters when submit button is clicked
  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = {
      name: '',
      licenseNumber: '',
      ageMin: '',
      ageMax: '',
      dobFrom: '',
      dobTo: ''
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearch('');
    setDebouncedSearch('');
  };

  // Reset filters to last applied state
  const resetFilters = () => {
    setFilters({ ...appliedFilters });
  };

  const openModal = (nurse = null) => {
    setEditingNurse(nurse);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false); 
    setEditingNurse(null); 
    fetchNurses();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this nurse?")) {
      try {
        await deleteNurse(id);
        fetchNurses();
      } catch (error) {
        console.error('Error deleting nurse:', error);
        alert('Failed to delete nurse. Please try again.');
      }
    }
  };

  // Check if filters have changed from applied filters
  const hasUnappliedFilters = JSON.stringify(filters) !== JSON.stringify(appliedFilters);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Nurses</h2>
        <div>
          <button className="btn mr-2" onClick={() => openModal()}>Add Nurse</button>
          <button className="btn mr-2" onClick={downloadCSV}>Download CSV</button>
          <button className="btn" onClick={downloadXLSX}>Download XLSX</button>
        </div>
      </div>

      {/* Search Bar */}
      {/* <div className="mb-4">
        <div className="flex gap-2 items-center">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search nurses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pr-10"
            />
            {search !== debouncedSearch && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          <button 
            className="btn" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="btn btn-gray" onClick={clearFilters}>
            Clear All
          </button>

          {(debouncedSearch || Object.values(appliedFilters).some(v => v)) && (
            <span className="text-sm text-gray-600">
              {loading ? 'Searching...' : `${nurses.length} result${nurses.length !== 1 ? 's' : ''}`}
            </span>
          )}
        </div>
      </div> */}

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License Number</label>
              <input
                type="text"
                placeholder="Filter by license"
                value={filters.licenseNumber}
                onChange={(e) => handleFilterChange('licenseNumber', e.target.value)}
                className="input w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Min Age</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.ageMin}
                  onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Age</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.ageMax}
                  onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">DOB From</label>
                <input
                  type="date"
                  value={filters.dobFrom}
                  onChange={(e) => handleFilterChange('dobFrom', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">DOB To</label>
                <input
                  type="date"
                  value={filters.dobTo}
                  onChange={(e) => handleFilterChange('dobTo', e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Filter Action Buttons */}
          <div className="flex gap-2 mt-4 pt-2 border-t border-gray-200">
            <button 
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
              onClick={applyFilters}
              disabled={!hasUnappliedFilters}
            >
              Apply Filters
              {hasUnappliedFilters && <span className="ml-1 text-yellow-300">●</span>}
            </button>
            <button 
              className="btn btn-gray"
              onClick={resetFilters}
              disabled={!hasUnappliedFilters}
            >
              Reset
            </button>
            <button 
              className="btn btn-red"
              onClick={clearFilters}
              disabled={Object.values(filters).every(v => !v) && !search}
            >
              Clear All
            </button>
            
            {/* Active filters indicator */}
            {Object.values(appliedFilters).some(v => v) && (
              <span className="text-sm text-green-600 flex items-center ml-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Filters Active
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-4 mb-4">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      )}

      {/* Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {COLUMNS.map(c =>
              <th
                key={c.key}
                onClick={() => handleSort(c.key)}
                className="table-header cursor-pointer hover:bg-gray-100"
              >
                {c.label}
                {sortBy === c.key && (order === 'ASC' ? ' ▲' : ' ▼')}
              </th>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading && nurses.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length + 1} className="text-center py-4 text-gray-500">
                {debouncedSearch || Object.values(appliedFilters).some(v => v) 
                  ? 'No nurses found matching your search criteria' 
                  : 'No nurses found'
                }
              </td>
            </tr>
          ) : (
            nurses.map(nurse => (
              <tr key={nurse.id} className="hover:bg-gray-50">
                {COLUMNS.map(c => (
                  <td className="border px-4 py-2" key={c.key}>
                    {c.key === 'dob' ? new Date(nurse[c.key]).toLocaleDateString() : nurse[c.key]}
                  </td>
                ))}
                <td className="border px-4 py-2">
                  <button className="btn mr-2" onClick={() => openModal(nurse)}>Edit</button>
                  <button className="btn btn-red" onClick={() => handleDelete(nurse.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <NurseModal open={modalOpen} nurse={editingNurse} onClose={closeModal} />
    </div>
  );
}
