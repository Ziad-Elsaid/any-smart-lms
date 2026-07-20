import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
<<<<<<< HEAD
import { PlayCircle } from "lucide-react";
=======
import { Watch } from "lucide-react";
>>>>>>> 3d1bbd6196bf1e08bbf4e352fcdeea1cddfcf92e
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
<<<<<<< HEAD
      const coursesData = response?.data || [];
      // Ensure all courses have consistent ID property naming
      const normalizedCourses = coursesData.map(course => ({
        ...course,
        // Try different possible ID properties the API might use
        courseId: course._id || course.id || course.courseId
      }));
      setStudentBoughtCoursesList(normalizedCourses);
      console.log("Student bought courses:", normalizedCourses);
    }
=======
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
>>>>>>> 3d1bbd6196bf1e08bbf4e352fcdeea1cddfcf92e
  }
  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
<<<<<<< HEAD
            <Card key={course.courseId} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.image}
=======
            <Card key={course.id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
>>>>>>> 3d1bbd6196bf1e08bbf4e352fcdeea1cddfcf92e
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter>
                <Button
<<<<<<< HEAD
                  onClick={() => {
                    console.log("Course data:", course);
                    console.log("Using courseId:", course?.courseId);
                    navigate(`/course-progress/${course?.courseId}`);
                  }}
                  className="flex-1"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
=======
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
>>>>>>> 3d1bbd6196bf1e08bbf4e352fcdeea1cddfcf92e
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
