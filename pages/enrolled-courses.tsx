import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Course {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  enrolledAt: Date;
}

const EnrolledCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const storedData = localStorage.getItem('userData');
        if (!storedData) {
          alert('User data not found. Please login again.');
          router.push('/login');
          return;
        }

        const userData = JSON.parse(storedData);
        const userEmail = userData.email;

        const response = await fetch(`/api/auth/enrolled-courses?userEmail=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        alert('An error occurred while fetching enrolled courses. Please try again.');
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Enrolled Courses</h1>
      {courses.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <li key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/course/${course._id}`}>
                <div 
                  className="block relative h-48 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${course.thumbnail})`
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center bg-black opacity-50 text-white text-xl font-bold">
                    {course.name}
                  </span>
                </div>
              </Link>
              <div className="px-4 py-3">
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-gray-600">Price: ${Number(course.price).toFixed(2)}</p>
                <p className="text-gray-600">Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No enrolled courses found.</p>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;
