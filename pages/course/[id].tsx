// pages/course/[id].tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Course {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  userEmail: string;
  videos: Array<{ title: string; url: string }>
}

const CourseDetailsPage = () => {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/course/${router.query.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course details:', error);
        alert('An error occurred while fetching course details.');
      }
    };

    fetchCourseDetails();
  }, []);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
      <img src={course.thumbnail} alt={course.name} className="mb-6 w-full h-auto" />
      
      <h2 className="text-xl font-semibold mb-4">Course Videos:</h2>
      <ul>
        {course.videos.map((video, index) => (
          <li key={index} className="mb-2">
            <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              {video.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetailsPage;