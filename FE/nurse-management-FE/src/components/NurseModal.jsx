import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { nurseSchema } from '../validation/nurseValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createNurse, updateNurse } from '../api/nurseApi';

export default function NurseModal({ open, nurse, onClose }) {
  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm({
    resolver: yupResolver(nurseSchema),
    defaultValues: nurse || { name: '', licenseNumber: '', dob: '', age: '' }
  });

  useEffect(() => {
    reset(nurse || { name: '', licenseNumber: '', dob: '', age: '' });
  }, [nurse, reset]);

  const onSubmit = async (data) => {
    if (nurse)
      await updateNurse(nurse.id, data);
    else
      await createNurse(data);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
      <div className="bg-white shadow-xl rounded p-6 min-w-[300px]">
        <h3 className="text-xl mb-4">{nurse ? 'Edit Nurse' : 'Add Nurse'}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <input {...register('name')} placeholder="Name" className="input" />
          <span className="text-red-500 text-xs">{errors.name?.message}</span>
          <input {...register('licenseNumber')} placeholder="License Number" className="input" />
          <span className="text-red-500 text-xs">{errors.licenseNumber?.message}</span>
          <input {...register('dob')} type="date" placeholder="DOB" className="input" />
          <span className="text-red-500 text-xs">{errors.dob?.message}</span>
          <input {...register('age')} type="number" placeholder="Age" className="input" />
          <span className="text-red-500 text-xs">{errors.age?.message}</span>
          <div className="flex justify-end gap-2 mt-3">
            <button type="submit" className="btn">{nurse ? 'Update' : 'Add'}</button>
            <button onClick={onClose} type="button" className="btn btn-gray">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
