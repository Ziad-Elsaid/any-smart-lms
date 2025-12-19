import { GraduationCap, TvMinimalPlay, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { MonitorPlay, SearchCheck } from "lucide-react";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials, auth } = useContext(AuthContext);

  function handleLogout() {
    console.log("handleLogout called");
    resetCredentials();
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-[100] flex flex-col sm:flex-row items-center justify-between p-4 bg-[#F4F5F7] shadow-md">
      <div className="flex items-center justify-center space-x-4">
        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center hover:text-[#1E4D2B] transition"
        >
          <GraduationCap className="h-8 w-8 mr-4 text-[#1E4D2B]" />
          <span className="font-extrabold text-xl text-[#1E4D2B]">
            Any Smart
          </span>
        </Link>
      </div>

      <div className="flex gap-2">
        {/* Explore Courses */}
        <div
          onClick={() => {
            location.pathname.includes("/courses")
              ? null
              : navigate("/courses");
          }}
          className="cursor-pointer text-[14px] md:text-[16px] font-bold text-[#1E4D2B] hover:bg-[#1E4D2B]/10 transition whitespace-nowrap rounded-xl p-2"
        >
          <SearchCheck
            style={{ display: "inline-block", "margin-right": "5px" }}
          />
          Explore Courses
        </div>
        {auth?.authenticate && (
          <>
            {/* My Courses */}
            <div
              onClick={() => navigate("/student-courses")}
              className="flex cursor-pointer items-center gap-3 text-[14px] md:text-[16px] font-bold text-[#1E4D2B] hover:bg-[#1E4D2B]/10 transition rounded-xl p-2"
            >
              <MonitorPlay className="w-6 h-6 cursor-pointer" />
              <span className="font-bold whitespace-nowrap">My Courses</span>
            </div>

            {/* Profile */}
            <div
              onClick={() => navigate("/student-profile")}
              className="flex cursor-pointer items-center gap-3 text-[14px] md:text-[16px] font-bold text-[#1E4D2B] hover:bg-[#1E4D2B]/10 transition rounded-xl p-2"
            >
              <User className="w-6 h-6 cursor-pointer " />
              setting
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          {auth?.authenticate ? (
            <>
              {/* Sign Out */}
              <Button
                onClick={handleLogout}
                className="bg-transparent hover:bg-[#173E23] text-[#1E4D2B] hover:text-white px-4 py-2 shadow-sm transition"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="bg-[#1E4D2B] hover:bg-[#173E23] text-white px-4 py-2 shadow-sm transition"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
