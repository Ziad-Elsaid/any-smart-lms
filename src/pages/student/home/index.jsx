import { courseCategories } from "@/config";
import banner1 from "../../../../public/slide1.jpg";
import banner2 from "../../../../public/slide2.jpg";
import banner3 from "../../../../public/slide3.jpg";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useRef } from "react";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, LayoutDashboard, UserCheck, Briefcase, Minus, Plus, Star } from "lucide-react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  function handleCourseNavigate(getCurrentCourseId) {
    navigate(`/course/details/${getCurrentCourseId}`);
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="bg-white flex justify-center items-center relative z-0 px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          loop
          className="w-full"
        >
          {/* Slide 1: Text centered, image as background */}
          <SwiperSlide className="h-full">
            <div className="flex justify-center items-center min-h-[70vh]">
              <div
                className="container mx-auto py-24relative w-full flex items-center justify-center text-center px-4 lg:px-8 min-h-[60vh] rounded-xl shadow-lg"
                style={{
                  backgroundImage: `url(${banner2})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="bg-white/80 p-8 rounded-xl max-w-2xl">
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#1E4D2B] mb-6">
                    Learn anytime, anywhere
                  </h2>
                  <p className="text-xl text-gray-700 mb-6">
                    Access your courses from desktop or mobile and learn at your
                    own pace.
                  </p>
                  <Button
                    className="bg-[#1E4D2B] hover:bg-[#173E23] text-white px-6 py-5 shadow"
                    onClick={() => auth?.authenticate ? navigate("/student-courses") : navigate("/auth")}
                  >
                    Start Learning
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {/* Slide 2: Text left, image right */}
          <SwiperSlide>
            <div className="container mx-auto px-4 lg:px-8 py-24 flex flex-col lg:flex-row items-center h-full">
              <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1E4D2B] mb-6">
                  Master in-demand skills
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                  Gain practical knowledge and boost your career with expert-led
                  courses.
                </p>
                <Button
                  className="bg-[#1E4D2B] hover:bg-[#173E23] text-white px-6 py-5 shadow"
                  onClick={() => navigate("/courses")}
                >
                  Browse Courses
                </Button>
              </div>
              <div className="lg:w-1/2 mt-10 lg:mt-0">
                <img
                  src={banner1}
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3: Text overlay at bottom left */}
          <SwiperSlide className="h-full">
            <div className="flex justify-center items-center min-h-[70vh]">
              <div className="container mx-auto py-24 relative w-full flex items-center px-4 lg:px-8 min-h-[60vh]">
                <img
                  src={banner3}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg"
                />
                <div className="relative bg-white/90 p-8 rounded-xl max-w-2xl">
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-[#1E4D2B] mb-6">
                    Learn from top instructors
                  </h3>
                  <p className="text-xl text-gray-700 mb-6">
                    Join thousands of learners and gain real-world, job-ready
                    skills.
                  </p>
                  <Button
                    className="bg-[#1E4D2B] hover:bg-[#173E23] text-white px-6 py-5 shadow"
                    onClick={() => auth?.authenticate ? navigate("/courses") : navigate("/auth")}
                  >
                    {auth?.authenticate ? "Explore Courses" : "Join Now"}
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        {/* Custom Navigation Arrows */}
        {/* Prev Arrow */}
        <div
          className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10
             w-12 h-12 flex items-center justify-center
             rounded-full bg-[#1E4D2B]/80 hover:bg-[#1E4D2B]
             text-white shadow-lg text-5xl cursor-pointer"
        >
          <ArrowLeft />
        </div>

        {/* Next Arrow */}
        <div
          className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10
             w-12 h-12 flex items-center justify-center
             rounded-full bg-[#1E4D2B]/80 hover:bg-[#1E4D2B]
             text-white shadow-lg text-5xl cursor-pointer"
        >
          <ArrowRight />
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-14 px-4 lg:px-8 w-full flex-1 bg-[#F9FAFB]">
        <div className="container mx-auto">
                  <h2 className="text-2xl font-bold text-[#1E4D2B] mb-8">
          Featured Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList
              .slice(-8) // get last 8 courses
              .reverse() // reverse to show most recent first
              .map((courseItem) => (
                <div
                  key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="
  bg-white rounded-xl overflow-hidden
  border border-transparent
  shadow-sm hover:shadow-lg hover:border-[#1E4D2B]
  transition cursor-pointer
"
                >
                  <img
                    src={courseItem?.image}
                    width={300}
                    height={150}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {courseItem?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {courseItem?.instructorName}
                    </p>
                    <p className="font-bold text-[#1E4D2B]">
                      ${courseItem?.pricing}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-600">No Courses Found</p>
          )}
        </div>
        </div>

      </section>

      {/* CATEGORIES */}
      <section className="py-12 px-4 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-[#1E4D2B] mb-6">
            Course Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {courseCategories.map((categoryItem) => (
              <Button
                key={categoryItem.id}
                variant="outline"
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                className="
            justify-start bg-white
            border border-gray-300
            hover:border-[#1E4D2B]
            hover:text-[#1E4D2B]
            hover:bg-[#1E4D2B]/5
            transition
          "
              >
                {categoryItem.label}
              </Button>
            ))}
          </div>
        </div>
      </section>



      {/* WHY CHOOSE US - Premium Design */}
      <section className="py-20 px-4 lg:px-8 bg-[#F9FAFB]">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Left Column: Story & Stats */}
            <div className="lg:w-1/3 lg:sticky lg:top-24">
              <span className="text-[#1E4D2B] font-bold tracking-wider text-sm uppercase mb-3 block">
                Why Any Smart?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Don't just learn. <br />
                <span className="text-[#1E4D2B]">Build a career.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe education should be practical, accessible, and directly connected to industry needs. Our curriculum is constantly updated to match the real world.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#1E4D2B]" />
                  <span className="text-gray-700 font-medium">Project-based learning methodology</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#1E4D2B]" />
                  <span className="text-gray-700 font-medium">Direct mentorship from experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#1E4D2B]" />
                  <span className="text-gray-700 font-medium">Job-ready portfolio creation</span>
                </div>
              </div>

              <div className="flex gap-8 border-t border-gray-200 pt-8">
                <div>
                  <h4 className="text-3xl font-bold text-[#1E4D2B]">25k+</h4>
                  <p className="text-sm text-gray-500 font-medium">Active Learners</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-[#1E4D2B]">4.8</h4>
                  <p className="text-sm text-gray-500 font-medium">User Rating</p>
                </div>
              </div>
            </div>

            {/* Right Column: Feature Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1E4D2B]/20 transition group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                  <LayoutDashboard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Hands-on Projects</h3>
                <p className="text-gray-500 leading-relaxed">
                  Forget boring lectures. You'll build real applications that you can showcase in your portfolio and discuss in interviews.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1E4D2B]/20 transition group">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                  <UserCheck className="h-6 w-6 text-[#1E4D2B]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3"> Expert Mentorship</h3>
                <p className="text-gray-500 leading-relaxed">
                  Get code reviews and career advice from mentors who have worked at top tech companies. You're never learning alone.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1E4D2B]/20 transition group">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lifetime Access</h3>
                <p className="text-gray-500 leading-relaxed">
                  Buy a course once and keep it forever. Revisit lessons anytime as you advance in your career and need a refresher.
                </p>
              </div>

               {/* Card 4 */}
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1E4D2B]/20 transition group">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Career Services</h3>
                <p className="text-gray-500 leading-relaxed">
                  We don't just teach you skills. We help you polish your resume, prepare for interviews, and land your dream job.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>








      {/* FAQ SECTION */}
      <section className="py-20 px-4 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
           <div className="text-center mb-16">
            <span className="text-[#1E4D2B] font-bold tracking-wider text-sm uppercase mb-3 block">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Do I get a certificate after completing a course?",
                answer: "Yes! Every paid course comes with a certificate of completion that you can download and share on your LinkedIn profile."
              },
              {
                question: "Can I access the courses on my mobile device?",
                answer: "Absolutely. Our platform is fully responsive and optimized for mobile devices, so you can learn on the go."
              },
              {
                question: "Is there a money-back guarantee?",
                answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, let us know and we'll refund you, no questions asked."
              },
               {
                question: "How long do I have access to the course?",
                answer: "You have lifetime access! Once you enroll, you can revisit the course materials as many times as you like, forever."
              },
              {
                question: "Do you offer support if I get stuck?",
                answer: "Yes, our instructors and community mentors are available to help answer your questions in the course discussion forums."
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-[#1E4D2B]/30 hover:shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-lg font-semibold text-gray-800">
                  <span>{faq.question}</span>
                  <div className="text-[#1E4D2B] transition-transform duration-300 group-open:rotate-180">
                    <div className="group-open:hidden"><Plus className="h-5 w-5"/></div>
                    <div className="hidden group-open:block"><Minus className="h-5 w-5"/></div>
                  </div>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E4D2B] text-white mt-16">
        <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col justify-between items-center gap-4">
          <p className="text-sm">Any smart All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default StudentHomePage;
