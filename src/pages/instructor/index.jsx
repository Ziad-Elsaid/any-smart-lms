import UserProfile from "@/components/user-profile";
import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, Settings } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { auth, resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);
  const navigate = useNavigate();

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService(auth?.user?._id);
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    if (auth?.user?._id) fetchAllCourses();
  }, [auth?.user?._id]);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Settings,
      label: "Settings",
      value: "settings",
      component: <UserProfile />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#1E4D2B]/10 shadow-sm hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-[#1E4D2B] mb-8">
            Instructor Panel
          </h2>

          <nav className="space-y-2">
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
                variant="ghost"
                className={`
                  w-full justify-start gap-3 px-4 py-3 rounded-xl
                  transition font-medium
                  ${
                    activeTab === menuItem.value
                      ? "bg-[#1E4D2B] text-white hover:bg-[#173E23]"
                      : "text-[#1E4D2B] hover:bg-[#1E4D2B]/10"
                  }
                `}
              >
                <menuItem.icon className="h-5 w-5" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1E4D2B]">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your courses and instructor settings
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                {menuItem.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
