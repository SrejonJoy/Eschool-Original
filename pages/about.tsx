import React from 'react';
import styles from '../styles/About.module.css';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <h1 className={styles.heading}>About Us</h1>
        <p className={styles.paragraph}>
          Eschool is an innovative educational platform designed to enhance learning experiences for students and teachers alike.
        </p>
        <p className={styles.paragraph}>
          Our mission is to bridge the gap between traditional classroom teaching and modern technology, creating a more engaging and effective learning environment.
        </p>
        <p className={styles.paragraph}>
          We strive to provide high-quality educational content, interactive tools, and personalized learning paths to cater to diverse student needs and abilities.
        </p>
        <p className={styles.paragraph}>
          Our team of experienced educators and technologists works tirelessly to ensure that our platform is user-friendly, accessible, and continuously evolving to meet the changing needs of education.
        </p>
      </div>
    </section>
  );
};

export default About;
