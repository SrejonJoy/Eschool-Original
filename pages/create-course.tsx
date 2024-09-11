import { useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid'

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
  courseId : string
};

const CreateCoursePage = () => {
  const [courseName, setCourseName] = useState<string>('');
  console.log('1');
  const [price, setPrice] = useState<string>('');
  console.log('2');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  console.log('3');
  const [videos, setVideos] = useState<Video[]>([]);
  console.log('3');
  const [videoTitle, setVideoTitle] = useState<string>('');
  console.log('4');
  const [videoUrl, setVideoUrl] = useState<string>('');
  console.log('5');
  const router = useRouter();
  console.log('6');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted');
    const courseId = uuidv4()
    // Prepare the course data
    const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
    const { email, name } = storedData;
    const courseData: CourseData = {
      courseId,
      name: courseName,
      price,
      thumbnailUrl,
      videos,
      userEmail: email ||'user@example.com', // Replace with actual user email
    };

    console.log('Sending data:', courseData);

    try {
       const response = await fetch('/api/auth/create-course', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(courseData),
       })

       console.log('Response received');

       if (!response.ok) {
         throw new Error('Failed to create course')
       }

       const data = await response.json()
       console.log('Success response:', data);
       alert('Course created successfully!')
       router.push('/all-courses') // Redirect to thank you page
     } catch (error) {
       console.error('Error creating course:', error)
       alert('An error occurred while creating the course. Please try again.')
     }
   }

  const handleAddVideo = () => {
    setVideos(prev => [...prev, { title: videoTitle, url: videoUrl }]);
    setVideoTitle('');
    setVideoUrl('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Course</h2>
      <input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="Enter course name"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter course price"
        required
      />
      <input
        type="url"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        placeholder="Enter thumbnail URL"
        required
      />
      <div>
        {videos.map((video, index) => (
          <div key={index}>
            <input
              type="text"
              value={video.title}
              onChange={(e) => setVideos(prev => prev.map((v, i) => i === index ? { ...v, title: e.target.value } : v))}
              placeholder="Video Title"
              required
            />
            <input
              type="url"
              value={video.url}
              onChange={(e) => setVideos(prev => prev.map((v, i) => i === index ? { ...v, url: e.target.value } : v))}
              placeholder="Video URL"
              required
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAddVideo}>Add Video</button>
      <button type="submit">Create Course</button>
    </form>
  );
};

export default CreateCoursePage;