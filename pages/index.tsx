// index.tsx
import { useRouter } from 'next/router';
import '../styles/HomePage.css'; // Assuming you have a CSS file for styles

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="home-page">
      <header className="site-header">
        <h1>E-School</h1>
      </header>
      <main className="content">
        <h2>Choose Your Role</h2>
        <button className="role-button" onClick={() => router.push('/register?role=student')}>Student</button>
        <button className="role-button" onClick={() => router.push('/register?role=teacher')}>Teacher</button>
        <button className="login-button" onClick={() => router.push('/login')}>Already Have An Account</button>
      </main>
      <footer className="site-footer">
        <p>&copy; 2023 E-School. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;