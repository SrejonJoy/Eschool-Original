// pages/edit-profile.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/EditProfilePage.module.css';

const EditProfilePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = localStorage.getItem('userData');
        if (!storedData) {
          alert('User data not found. Please login again.');
          router.push('/login');
          return;
        }

        const userData = JSON.parse(storedData);
        const userEmail = userData.email;

        const response = await fetch(`/api/user/data?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();

        setFormData(prevState => ({
          ...prevState,
          name: data.name || prevState.name,
          id: data.id || prevState.id,
          email: data.email || prevState.email,
          phone: data.phone || prevState.phone,
          address: data.address || prevState.address
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert('An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Profile updated successfully!');
        router.push('/welcome');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.inputField}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          className={styles.inputField}
          placeholder="ID"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.inputField}
          placeholder="Email"
          disabled
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.inputField}
          placeholder="Phone Number"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.inputField}
          placeholder="Address"
        />
        <button type="submit" className={styles.submitButton}>Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfilePage;