import React, { useEffect,useState } from 'react';
import { useForm } from 'react-hook-form';
import { nurseSchema } from '../validation/nurseValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createNurse, updateNurse } from '../api/nurseApi';
import { calculateAge } from '../utils/helper';

// const Toast = (message)=>{
//   alert(message)
// }

export default function NurseModal({ open, nurse, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(nurseSchema),
    defaultValues: nurse || { name: '', licenseNumber: '', dob: '', age: '' }
  });

  const [customErr,setCustomErr] = useState(null);
  const [message,setMessage]= useState("")

  const dobValue = watch('dob');
  const lNo = watch('licenseNumber');



  useEffect(() => {
    reset(nurse || { name: '', licenseNumber: '', dob: '', age: '' });
  }, [nurse, reset]);

  useEffect(() => {
    if (dobValue) {
      const age = calculateAge(dobValue);
      setValue("age", age);
    } else {
      setValue("age", "");
    }
  }, [dobValue, setValue]);

  useEffect(()=>{
if(lNo){
  lNo.length < 4? setCustomErr(`License Number requires ${4 - lNo.length} more characteres`) : lNo.length > 8 ? setCustomErr(`License Number exceeds by ${lNo.length -8} characters`):setCustomErr(null)
}
  },[lNo])

useEffect(()=>{
if(message){
  
  setTimeout(()=>{
    alert(message);
  },2000)
    setMessage("")

}else{
  setMessage("")
}
},[message])
  const onSubmit = async (data) => {
    if (nurse){
      await updateNurse(nurse.id, data);
setMessage("Nurse updated successfully");
    }
    else
      await createNurse(data);
    setMessage("Nurse created successfully");
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
          {/* <span className="text-red-500 text-xs">{errors.licenseNumber?.message}</span> */}
          <span className="text-red-500 text-xs">{customErr}</span>
          <input {...register('dob')} type="date" placeholder="DOB" className="input" />
          <span className="text-red-500 text-xs">{errors.dob?.message}</span>
          <input
            {...register('age')}
            type="number"
            placeholder="Age"
            className="input bg-gray-100 cursor-not-allowed"
            readOnly
          />
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
