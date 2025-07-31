import { useEffect, useState } from "react"
import BASE_URL from "../../config"
import axios from "axios";

function Analytics() {
    const [enrolledLearners, setEnrolledLearners] = useState(0)
    const [videoCount, setVideoCount] = useState(0)
    // Fetch course details
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users-count/`)
                setEnrolledLearners(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching user count:", error);
            }
        };
        fetchUsers();
        const fetchVideoCount = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/video-count`);
                console.log(response.data)
                setVideoCount(response.data)
            } catch (error) {
                console.error(error);
            } finally {
            }
        };
        fetchVideoCount();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-custom-blue text-2xl font-semibold mb-2 ">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 w-fit gap-10">
                <div className="bg-custom-blue px-8 py-6 w-80 h-fit rounded-3xl">
                    <h1 className="text-white text text-6xl font-semibold mb-4">
                        {enrolledLearners.user_count}
                    </h1>
                    <p className="text-white font-extralight tracking-wide text-xl">
                        Enrolled learners
                    </p>
                </div>
                <div className="bg-custom-orange px-8 py-6 w-80 h-fit rounded-3xl">
                    <h1 className="text-white text text-6xl font-semibold mb-4">
                        {videoCount.count}
                    </h1>
                    <p className="text-white font-extralight tracking-wide text-xl">
                        Enrolled learners
                    </p>
                </div>
                <div className="bg-custom-blue px-8 py-6 w-80 h-fit rounded-3xl">
                    <h1 className="text-white text text-6xl font-semibold mb-4">
                        {enrolledLearners.user_count}
                    </h1>
                    <p className="text-white font-extralight tracking-wide text-xl">
                        Enrolled learners
                    </p>
                </div>
                <div className="bg-custom-orange px-8 py-6 w-80 h-fit rounded-3xl">
                    <h1 className="text-white text text-6xl font-semibold mb-4">
                        {videoCount.count}
                    </h1>
                    <p className="text-white font-extralight tracking-wide text-xl">
                        Enrolled learners
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Analytics
