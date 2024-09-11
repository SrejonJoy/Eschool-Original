// components/AuthForm.tsx
import router, { useRouter } from 'next/router';
import { useState } from 'react';

interface AuthFormProps {
  role: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ role }) => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    otp: '',
    role: role,
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async () => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email }),
    });

    if (res.ok) {
      setOtpSent(true);
    } else {
      alert('Failed to send OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    if (!otpSent) {
      alert('Please send OTP first');
      return;
    }
  
    // Verify OTP
    const otpRes = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email, otp: formData.otp }),
    });
  
    if (!otpRes.ok) {
      alert('Invalid OTP');
      return;
    }
  
    // Proceed with registration
    const registerRes = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        id: formData.id,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        role: formData.role
      }),
    });
  
    if (registerRes.ok) {
      // Redirect to login page
      router.push('/login');
      // Optionally, clear any form data or state related to registration
    } else {
      alert('Failed to register');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="id" value={formData.id} onChange={handleChange} placeholder="ID" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />

      {otpSent ? (
        <input name="otp" value={formData.otp} onChange={handleChange} placeholder="OTP" required />
      ) : (
        <button type="button" onClick={handleSendOTP}>Send OTP</button>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default AuthForm;
