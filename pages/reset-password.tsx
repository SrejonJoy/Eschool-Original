// pages/reset-password.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    if (res.ok) {
      alert('Password updated successfully');
      router.push('/login');
    } else {
      alert('Failed to update password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPasswordPage;
