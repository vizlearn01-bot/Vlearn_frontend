import { useEffect, useState } from "react"
import BASE_URL from "../../config"
import axios from "axios";
import { Users, ListVideo, UserCheck } from "lucide-react";

function AdminDashboard() {
    const [enrolledLearners, setEnrolledLearners] = useState(0)
    const [videoCount, setVideoCount] = useState(0)
    const [activeUsers, setActiveUsers] = useState(0)

    //fetching analytics
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const [userRes, videoRes, activeUsersRes] = await Promise.all([
                    axios.get(`${BASE_URL}/users-count/`),
                    axios.get(`${BASE_URL}/video-count/`),
                    axios.get(`${BASE_URL}/api/subscriptions/api/subscribed-users/count/`)
                ]);

                setEnrolledLearners(userRes.data);
                setVideoCount(videoRes.data);
                setActiveUsers(activeUsersRes.data)
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            }
        };

        fetchAnalyticsData();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-custom-blue text-3xl font-semibold mb-2 text-center md:text-left">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 md:border-b border-gray-300 w-full px-4 md:px-8 pb-6">
                <div className="bg-custom-blue px-6 py-6 rounded-3xl relative w-full">
                    <Users strokeWidth={1} className="text-white w-10 h-10 md:w-12 md:h-12 absolute top-4 right-4" />
                    <h1 className="text-white text-5xl md:text-6xl font-semibold mb-6">
                        {enrolledLearners.user_count}
                    </h1>
                    <p className="text-white font-extralight tracking-wide text-lg md:text-xl">
                        Enrolled learners
                    </p>
                </div>

                <div className="bg-custom-orange px-6 py-6 rounded-3xl relative w-full">
                    <UserCheck strokeWidth={1} className="text-white w-10 h-10 md:w-12 md:h-12 absolute top-4 right-4" />
                    <h1 className="text-white text-5xl md:text-6xl font-semibold mb-6">
                        {activeUsers.subscribed_users}
                    </h1>
                    <p className="text-white font-extralight tracking-wide text-lg md:text-xl">
                        Subscribed learners
                    </p>
                </div>

                <div className="bg-custom-blue px-6 py-6 rounded-3xl relative w-full">
                    <ListVideo strokeWidth={1} className="text-white w-10 h-10 md:w-12 md:h-12 absolute top-4 right-4" />
                    <h1 className="text-white text-5xl md:text-6xl font-semibold mb-6">
                        {videoCount.count}
                    </h1>
                    <p className="text-white font-extralight tracking-wide text-lg md:text-xl">
                        Available Science experiments
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
