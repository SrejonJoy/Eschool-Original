import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';
import styles from '../styles/RegistrationForm.module.css'; // Importing the CSS module

const RegisterPage = () => {
  const router = useRouter();
  const { role } = router.query;

  return (
    <div className={styles.registrationFormContainer}> {/* Applying the container style */}
      <h1 className={styles.title}>Register as {role}</h1> {/* Applying title style */}
      <AuthForm role={role as string} /> {/* Ensure AuthForm applies its own internal styles */}
    </div>
  );
};

export default RegisterPage;
