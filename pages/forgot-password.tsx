// pages/forgot-password.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      router.push(`/reset-password?email=${email}`);
    } else {
      alert('Failed to send OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
      <button type="submit">Send OTP</button>
    </form>
  );
};

export default ForgotPasswordPage;
