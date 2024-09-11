import { useState } from 'react';
import { useRouter } from 'next/router';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { email } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      // Redirect to login page
      router.push('/login');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default VerifyOtpPage;
