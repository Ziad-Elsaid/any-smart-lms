import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );
      if (response?.success) fetchCurrentCourseProgress();
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );
    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] text-gray-900">
      {showConfetti && <Confetti />}

      {/* TOP BAR */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-[#1E4D2B]/20">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="ghost"
            size="sm"
            className="text-[#1E4D2B] hover:bg-[#1E4D2B]/10 font-semibold"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>

          <h1 className="text-lg font-bold hidden md:block text-[#1E4D2B]">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>

        <Button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="bg-[#1E4D2B] hover:bg-[#173E23] text-white"
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />

          <div className="p-6 bg-white border-t border-[#1E4D2B]/10">
            <h2 className="text-2xl font-bold text-[#1E4D2B]">
              {currentLecture?.title}
            </h2>
          </div>
        </div>

        {/* SIDEBAR */}
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-white border-l border-[#1E4D2B]/20 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-[#F4F5F7]">
              <TabsTrigger
                value="content"
                className="font-bold data-[state=active]:bg-white data-[state=active]:text-[#1E4D2B] p-2 rounded-md"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="font-bold data-[state=active]:bg-white data-[state=active]:text-[#1E4D2B] p-2 rounded-md"
              >
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 text-sm font-semibold cursor-pointer hover:text-[#1E4D2B]"
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (p) => p.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Play className="h-4 w-4 text-gray-500" />
                        )}
                        <span>{item.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4 text-[#1E4D2B]">
                    About this course
                  </h2>
                  <p className="text-gray-600">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* LOCKED COURSE */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#1E4D2B]">
              You can't view this page
            </DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* COURSE COMPLETE */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#1E4D2B]">
              Congratulations 🎉
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              <Label>You have completed the course</Label>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/student-courses")}
                  className="bg-[#1E4D2B] hover:bg-[#173E23] text-white"
                >
                  My Courses
                </Button>
                <Button
                  onClick={handleRewatchCourse}
                  variant="outline"
                  className="border-[#1E4D2B] text-[#1E4D2B]"
                >
                  Rewatch Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
