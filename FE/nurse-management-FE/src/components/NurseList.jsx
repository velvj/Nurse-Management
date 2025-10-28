import React, { useState, useEffect } from 'react';
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
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);

  const fetchNurses = async () => {
    const data = await getNurses(sortBy, order);
    setNurses(data);
  };

  useEffect(() => { fetchNurses(); }, [sortBy, order]);

  const handleSort = (col) => {
    if (col === sortBy) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else {
      setSortBy(col); setOrder('ASC');
    }
  };

  const openModal = (nurse = null) => {
    setEditingNurse(nurse);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false); setEditingNurse(null); fetchNurses();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this nurse?")) {
      await deleteNurse(id);
      fetchNurses();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Nurses</h2>
        <div>
          <button className="btn mr-2" onClick={() => openModal()}>Add Nurse</button>
          <button className="btn mr-2" onClick={downloadCSV}>Download CSV</button>
          <button className="btn" onClick={downloadXLSX}>Download XLSX</button>
        </div>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {COLUMNS.map(c =>
              <th
                key={c.key}
                onClick={() => handleSort(c.key)}
                className="table-header"
              >
                {c.label}
                {sortBy === c.key && (order === 'ASC' ? ' ▲' : ' ▼')}
              </th>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {nurses.map(nurse => (
            <tr key={nurse.id}>
              {COLUMNS.map(c => (
                <td className="border px-4 py-2" key={c.key}>
                  {nurse[c.key]}
                </td>
              ))}
              <td className="border px-4 py-2">
                <button className="btn mr-2" onClick={() => openModal(nurse)}>Edit</button>
                <button className="btn btn-red" onClick={() => handleDelete(nurse.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NurseModal open={modalOpen} nurse={editingNurse} onClose={closeModal} />
    </div>
  );
}
