import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/nurses';

export const getNurses = async (sortBy,order,search="",filters={})=>{
    const res = await axios.get(`${BASE}/getNurse`,{params:{sortBy,order,search,...filters}})
    return res.data;
}

export const getNurseById = async (id)=>{
    const res = await axios.get(`${BASE}/${id}`);
    return res.data;
}

export const createNurse = async (data)=>{
    const res = await axios.post(`${BASE}/create`,data);
    return res.data;
}

export const updateNurse = async (id,data)=>{
    const res = await axios.put(`${BASE}/update/${id}`,data);
    return res.data;
}

export const deleteNurse = async (id)=>{
  return axios.delete(`${BASE}/nurseDelete/${id}`);
}

export const downloadCSV = ()=>{
    window.open(`${BASE}/download/csv`,'_blank');
}

export const downloadXLSX = ()=>{
    window.open(`${BASE}/download/xlsx`,'_blank');
}