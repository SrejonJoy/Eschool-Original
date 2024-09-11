import { useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/CreateCourse.module.css'; // Import the CSS module

type Video = {
  title: string;
  url: string;
};

type CourseData = {
  name: string;
  price: string;
  thumbnailUrl: string;
  videos: Video[];
  userEmail: string;
  courseId: string;
};

const CreateCoursePage = () => {
  const [courseName, setCourseName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseId = uuidv4();
    const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
    const { email } = storedData;
    const courseData: CourseData = {
      courseId,
      name: courseName,
      price,
      thumbnailUrl,
      videos,
      userEmail: email || 'user@example.com',
    };

    try {
      const response = await fetch('/api/auth/create-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data = await response.json();
      alert('Course created successfully!');
      router.push('/all-courses');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('An error occurred while creating the course. Please try again.');
    }
  };

  const handleAddVideo = () => {
    setVideos(prev => [...prev, { title: videoTitle, url: videoUrl }]);
    setVideoTitle('');
    setVideoUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Create New Course</h2>
      <input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="Enter course name"
        className={styles.input}
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter course price"
        className={styles.input}
        required
      />
      <input
        type="url"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        placeholder="Enter thumbnail URL"
        className={styles.input}
        required
      />
      <div className={styles.videoContainer}>
        {videos.map((video, index) => (
          <div key={index} className={styles.videoItem}>
            <input
              type="text"
              value={video.title}
              onChange={(e) => setVideos(prev => prev.map((v, i) => i === index ? { ...v, title: e.target.value } : v))}
              placeholder="Video Title"
              className={styles.input}
              required
            />
            <input
              type="url"
              value={video.url}
              onChange={(e) => setVideos(prev => prev.map((v, i) => i === index ? { ...v, url: e.target.value } : v))}
              placeholder="Video URL"
              className={styles.input}
              required
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAddVideo} className={styles.addButton}>Add Video</button>
      <button type="submit" className={styles.submitButton}>Create Course</button>
    </form>
  );
};

export default CreateCoursePage;
