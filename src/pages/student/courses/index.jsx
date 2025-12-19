import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };

    if (!cpyFilters[getSectionId]) {
      cpyFilters[getSectionId] = [getCurrentOption.id];
    } else {
      const index = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
      index === -1
        ? cpyFilters[getSectionId].push(getCurrentOption.id)
        : cpyFilters[getSectionId].splice(index, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    // Build query string properly - filters have arrays that need to be joined
    const queryParams = new URLSearchParams();
    
    // Add filter parameters (join arrays with commas as backend expects)
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.set(key, value.join(","));
      }
    }
    
    // Add sort parameter
    queryParams.set("sortBy", sort);
    
    const response = await fetchStudentViewCourseListService(queryParams.toString());

    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  function handleCourseNavigate(courseId) {
    navigate(`/course/details/${courseId}`);
  }

  useEffect(() => {
    setSearchParams(new URLSearchParams(createSearchParamsHelper(filters)));
  }, [filters]);

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters && sort) fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => sessionStorage.removeItem("filters");
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#1E4D2B]">All Courses</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* FILTERS */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-[#1E4D2B]/10">
          {Object.keys(filterOptions).map((keyItem) => (
            <div key={keyItem} className="p-4 border-b last:border-b-0">
              <h3 className="font-bold mb-3 text-[#1E4D2B]">
                {keyItem.toUpperCase()}
              </h3>
              <div className="space-y-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:text-[#1E4D2B]"
                  >
                    <Checkbox
                      checked={
                        filters[keyItem] && filters[keyItem].includes(option.id)
                      }
                      onCheckedChange={() =>
                        handleFilterOnChange(keyItem, option)
                      }
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* COURSES */}
        <main className="flex-1">
          <div className="flex justify-end items-center mb-5 gap-4 relative z-[100]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 border-[#1E4D2B] text-[#1E4D2B] hover:bg-[#1E4D2B]/10"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] relative z-[100]">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((item) => (
                    <DropdownMenuRadioItem key={item.id} value={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-sm font-bold text-gray-700">
              {studentViewCoursesList.length} Results
            </span>
          </div>

          <div className="space-y-5">
            {studentViewCoursesList?.length > 0 ? (
              studentViewCoursesList.map((course) => (
                <Card
                  key={course._id}
                  onClick={() => handleCourseNavigate(course._id)}
                  className="cursor-pointer hover:shadow-lg transition border border-[#1E4D2B]/10"
                >
                  <CardContent className="flex gap-5 p-4">
                    <div className="w-48 h-32 rounded-lg overflow-hidden">
                      <img
                        src={course.image}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1 text-[#1E4D2B]">
                        {course.title}
                      </CardTitle>

                      <p className="text-sm text-gray-600">
                        Created by{" "}
                        <span className="font-bold">
                          {course.instructorName}
                        </span>
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        {course.curriculum.length} Lectures •{" "}
                        {course.level.toUpperCase()} Level
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        {course.description?.length > 100
                          ? `${course.description.slice(0, 100)}...`
                          : course.description}
                      </p>

                      <p className="font-bold text-lg text-[#1E4D2B] mt-3">
                        ${course.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <h1 className="font-extrabold text-3xl text-center text-gray-500">
                No Courses Found
              </h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
