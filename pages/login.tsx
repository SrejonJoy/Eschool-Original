// pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/LoginPage.module.css';
import Link from 'next/link';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Login response:', data);
      localStorage.setItem('userData', JSON.stringify({ ...data, email: formData.email }));
      router.push('/welcome');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className={styles.formGroup}>
          <input 
            name="email" 
            type="email"
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email" 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <input 
            name="password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Password" 
            required 
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.loginButton} type="submit">Login</button>
          <Link href="/forgot-password" className={styles.btnLink}>Forgot Password?</Link>
        </div>
      </form>
  );
};

export default LoginPage;