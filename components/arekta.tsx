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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Registration successful');
        setFormData({
          name: '',
          id: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          confirmPassword: '',
        });
        window.location.href = `/verify-otp?email=${formData.email}`;
      } else {
        const errorData = await res.json();
        alert(`Failed to register: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      </label>
      <label>
        ID:
        <input name="id" value={formData.id} onChange={handleChange} placeholder="ID" required />
      </label>
      <label>
        Email:
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      </label>
      <label>
        Phone:
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
      </label>
      <label>
        Address:
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
      </label>
      <label>
        Password:
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      </label>
      <label>
        Confirm Password:
        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AuthForm;
