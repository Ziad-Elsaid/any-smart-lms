import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpy = [...courseCurriculumFormData];
    cpy[currentIndex] = { ...cpy[currentIndex], title: event.target.value };
    setCourseCurriculumFormData(cpy);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpy = [...courseCurriculumFormData];
    cpy[currentIndex] = { ...cpy[currentIndex], freePreview: currentValue };
    setCourseCurriculumFormData(cpy);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("file", selectedFile);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        videoFormData,
        setMediaUploadProgressPercentage
      );

      if (response.success) {
        setCourseCurriculumFormData((prev) => {
          let cpy = [...prev];
          cpy[currentIndex] = {
            ...cpy[currentIndex],
            videoUrl: response.data.secure_url || response.data.url,
            public_id: response.data.public_id,
          };
          return cpy;
        });
      }
      setMediaUploadProgress(false);
    } catch {
      setMediaUploadProgress(false);
    }
  }

  async function handleReplaceVideo(currentIndex) {
    const cpy = [...courseCurriculumFormData];
    const publicId = cpy[currentIndex].public_id;
    const res = await mediaDeleteService(publicId);

    if (res?.success) {
      cpy[currentIndex] = { ...cpy[currentIndex], videoUrl: "", public_id: "" };
      setCourseCurriculumFormData(cpy);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every(
      (item) => item.title?.trim() && item.videoUrl?.trim()
    );
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  async function handleMediaBulkUpload(event) {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        formData,
        setMediaUploadProgressPercentage
      );

      if (response?.success) {
        setCourseCurriculumFormData((prev) => [
          ...prev,
          ...response.data.map((item, i) => ({
            videoUrl: item.secure_url || item.url,
            public_id: item.public_id,
            title: `Lecture ${prev.length + i + 1}`,
            freePreview: false,
          })),
        ]);
      }
      setMediaUploadProgress(false);
    } catch {
      setMediaUploadProgress(false);
    }
  }

  async function handleDeleteLecture(index) {
    const publicId = courseCurriculumFormData[index].public_id;
    const res = await mediaDeleteService(publicId);
    if (res?.success) {
      setCourseCurriculumFormData((prev) => prev.filter((_, i) => i !== index));
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Create Course Curriculum</CardTitle>

        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleMediaBulkUpload}
          />
          <Button
            variant="outline"
            onClick={handleOpenBulkUploadDialog}
            className="
              flex items-center gap-2
              border-[#1E4D2B]
              text-[#1E4D2B]
              hover:bg-[#1E4D2B]
              hover:text-white
              transition
            "
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
          className="
            mb-4 px-6 py-3 rounded-xl
            bg-[#1E4D2B] text-white font-semibold
            shadow-md hover:bg-[#173E23]
            hover:shadow-lg transition
          "
        >
          Add Lecture
        </Button>

        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}

        <div className="mt-6 space-y-6">
          {courseCurriculumFormData.map((item, index) => (
            <div key={index} className="border rounded-xl p-6">
              <div className="flex gap-5 items-center flex-wrap">
                <h3 className="font-semibold">Lecture {index + 1}</h3>

                <Input
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  value={item.title}
                  onChange={(e) => handleCourseTitleChange(e, index)}
                />

                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.freePreview}
                    onCheckedChange={(v) => handleFreePreviewChange(v, index)}
                  />
                  <Label>Free Preview</Label>
                </div>
              </div>

              <div className="mt-6">
                {item.videoUrl ? (
                  <div className="flex gap-4 flex-wrap">
                    <VideoPlayer
                      url={item.videoUrl}
                      width="450px"
                      height="200px"
                    />

                    <Button
                      onClick={() => handleReplaceVideo(index)}
                      className="
                        bg-gray-800 text-white
                        hover:bg-gray-900 transition
                      "
                    >
                      Replace Video
                    </Button>

                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      className="
                        bg-red-600 text-white
                        hover:bg-red-700 transition
                      "
                    >
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleSingleLectureUpload(e, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
