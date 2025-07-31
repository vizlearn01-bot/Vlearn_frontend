import { useState } from "react";
import VideoManagement from "./CourseManagement/VideoManagement";
import QuestionManagement from "./CourseManagement/QuestionManagement";

function CourseManagement() {
  const [view, setView] = useState("questions");

  return (
    <>
      <div className="pt-4">
        <h2 className="text-custom-blue text-3xl font-semibold mb-2 text-center md:text-left pl-4">Course management</h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setView("questions")}
            className="hover:underline focus:underline decoration-custom-orange underline-offset-4 decoration-2 cursor-pointer py-2 px-4">
            Questions
          </button>
          <button
            onClick={() => setView("videos")}
            className="hover:underline focus:underline decoration-custom-orange underline-offset-4 decoration-2 cursor-pointer py-2 px-4">
            Videos
          </button>
        </div>

        {view === "questions" && <QuestionManagement />}
        {view === "videos" && <VideoManagement />}
      </div>

    </>
  );
}
export default CourseManagement