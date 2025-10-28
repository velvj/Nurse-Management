import * as yup from 'yup';

export const nurseSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  licenseNumber: yup.string().required('License Number is required'),
  dob: yup.date().required('Date of Birth is required'),
  age: yup.number().required('Age is required').min(18).max(70),
});
