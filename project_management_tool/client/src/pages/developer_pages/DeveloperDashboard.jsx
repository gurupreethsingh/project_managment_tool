

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaClipboardList,
//   FaCalendarAlt,
//   FaRegCalendarCheck,
//   FaProjectDiagram,
//   FaBug,
//   FaThList,
//   FaThLarge,
//   FaTh,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";


// const DeveloperDashboard = () => {
//   const [view, setView] = useState("grid");
//   const [assignedProjects, setAssignedProjects] = useState(0);
//   const [assignedDefects, setAssignedDefects] = useState(0);
//   const [assignedEvents, setAssignedEvents] = useState(0);
//   const [upcomingEvents, setUpcomingEvents] = useState(0);
//   const [scheduledMeetings, setScheduledMeetings] = useState(0);

//   const [attendanceCount, setAttendanceCount] = useState(0); // ✅ State for attendance
//   const [notification, setNotification] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user ? user.id : null;
//   const role = user ? user.role : "developer";

//   useEffect(() => {
//     if (userId && role) {
//       fetchCounts();
//     } else {
//       console.error("User ID or role not found in localStorage");
//     }
//   }, [userId, role]);

//   const fetchCounts = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/user-project-count/${userId}?role=${role}`
//       );
//       setAssignedProjects(response.data.assignedProjectsCount);

//       const defectRes = await axios.get(
//         `http://localhost:5000/developer-lead/${userId}/assigned-defects`
//       );
//       setAssignedDefects(defectRes.data.defects.length);

//       const attendanceRes = await axios.get(
//         `http://localhost:5000/api/count-attendance/employee/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       setAttendanceCount(attendanceRes.data.count); // ✅ Set employee attendance count
//       const notifRes = await axios.get(
//         `http://localhost:5000/api/count-notifications/${userId}`,
//         {
//           headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
//         }
//       );
//       setNotification(notifRes.data.total);

//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     }
//   };

//   const handleViewChange = (viewType) => {
//     setView(viewType);
//   };

//   const renderCounts = () => {
//     const counts = [
//       {
//         title: "Assigned Projects",
//         count: assignedProjects,
//         icon: <FaProjectDiagram className="text-blue-500" />,
//         linkText: "View Assigned Projects",
//         link: `/user-assigned-projects/${userId}`,
//       },
//       {
//         title: "Assigned Defects",
//         count: assignedDefects,
//         icon: <FaBug className="text-red-500" />,
//         linkText: "View Assigned Defects",
//         link: `/single-project/${userId}/developer/${userId}/view-assigned-defects`,
//       },
//       {
//         title: "Mark Attendance",
//         count: attendanceCount,
//         icon: <FaRegCalendarCheck className="text-green-600" />,
//         linkText: "Go to Attendance",
//         link: `/create-attendance`, // ✅ This should route to your CreateAttendance.jsx
//       },
//       {
//         title: "Assigned Events",
//         count: assignedEvents,
//         icon: <FaClipboardList className="text-green-500" />,
//         linkText: "View Assigned Events",
//         link: "/assigned-events",
//       },
//       {
//         title: "Upcoming Events",
//         count: upcomingEvents,
//         icon: <FaRegCalendarCheck className="text-purple-500" />,
//         linkText: "View Upcoming Events",
//         link: "/upcoming-events",
//       },
//       {
//         title: "Scheduled Meetings",
//         count: scheduledMeetings,
//         icon: <FaCalendarAlt className="text-orange-500" />,
//         linkText: "View Scheduled Meetings",
//         link: "/scheduled-meetings",
//       },
//       {
//         title:"View My Notifications",
//         count: notification,
//         icon: <FaClipboardList className="text-indigo-600"/>,
//         linkText:"View My Notifications",
//         link: "/my-notifications",

//       },
//     ];

//     return (
//       <div
//         className={`${
//           view === "grid"
//             ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
//             : view === "card"
//             ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
//             : "space-y-4"
//         }`}
//       >
//         {counts.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
//           >
//             <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>
//             <h3 className="text-xs font-semibold text-gray-600">
//               {item.title}
//             </h3>
//             <p className="text-2xl font-semibold text-indigo-600 mt-2">
//               {item.count}
//             </p>
//             <Link
//               to={item.link}
//               className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
//             >
//               {item.linkText}
//             </Link>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
//           <h3 className="text-2xl font-bold text-start text-indigo-600">
//             Developer Dashboard
//           </h3>

//           <div className="flex space-x-4 justify-center md:justify-start">
//             <FaThList
//               className={`text-xl cursor-pointer ${
//                 view === "list" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => handleViewChange("list")}
//             />
//             <FaThLarge
//               className={`text-xl cursor-pointer ${
//                 view === "card" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => handleViewChange("card")}
//             />
//             <FaTh
//               className={`text-xl cursor-pointer ${
//                 view === "grid" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => handleViewChange("grid")}
//             />
//           </div>
//         </div>

//         {renderCounts()}
//       </div>
//     </div>
//   );
// };

// export default DeveloperDashboard;


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaRegCalendarCheck,
  FaProjectDiagram,
  FaBug,
  FaThList,
  FaThLarge,
  FaTh,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const DeveloperDashboard = () => {
  const [view, setView] = useState("grid");
  const [assignedProjects, setAssignedProjects] = useState(0);
  const [assignedDefects, setAssignedDefects] = useState(0);
  const [assignedEvents, setAssignedEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [scheduledMeetings, setScheduledMeetings] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0); // ✅ unread only

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const role = user ? user.role : "developer";

  useEffect(() => {
    if (userId && role) {
      fetchCounts();
    } else {
      console.error("User ID or role not found in localStorage");
    }
  }, [userId, role]);

  const fetchCounts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user-project-count/${userId}?role=${role}`
      );
      setAssignedProjects(response.data.assignedProjectsCount);

      const defectRes = await axios.get(
        `http://localhost:5000/developer-lead/${userId}/assigned-defects`
      );
      setAssignedDefects(defectRes.data.defects.length);

      const attendanceRes = await axios.get(
        `http://localhost:5000/api/count-attendance/employee/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAttendanceCount(attendanceRes.data.count);

      const notifRes = await axios.get(
        `http://localhost:5000/api/count-notifications/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUnreadNotifications(notifRes.data.unread); // ✅ only unread

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const renderCounts = () => {
    const counts = [
      {
        title: "Assigned Projects",
        count: assignedProjects,
        icon: <FaProjectDiagram className="text-blue-500" />,
        linkText: "View Assigned Projects",
        link: `/user-assigned-projects/${userId}`,
      },
      {
        title: "Assigned Defects",
        count: assignedDefects,
        icon: <FaBug className="text-red-500" />,
        linkText: "View Assigned Defects",
        link: `/single-project/${userId}/developer/${userId}/view-assigned-defects`,
      },
      {
        title: "Mark Attendance",
        count: attendanceCount,
        icon: <FaRegCalendarCheck className="text-green-600" />,
        linkText: "Go to Attendance",
        link: `/create-attendance`,
      },
      {
        title: "Assigned Events",
        count: assignedEvents,
        icon: <FaClipboardList className="text-green-500" />,
        linkText: "View Assigned Events",
        link: "/assigned-events",
      },
      {
        title: "Upcoming Events",
        count: upcomingEvents,
        icon: <FaRegCalendarCheck className="text-purple-500" />,
        linkText: "View Upcoming Events",
        link: "/upcoming-events",
      },
      {
        title: "Scheduled Meetings",
        count: scheduledMeetings,
        icon: <FaCalendarAlt className="text-orange-500" />,
        linkText: "View Scheduled Meetings",
        link: "/scheduled-meetings",
      },
      {
        title: "Unread Notifications",
        count: unreadNotifications,
        icon: <FaClipboardList className="text-indigo-600" />,
        linkText: "Go to Notifications",
        link: "/my-notifications",
        isNotification: true, // ✅ flag to show badge
      },
    ];

    return (
      <div
        className={`${
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            : view === "card"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            : "space-y-4"
        }`}
      >
        {counts.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
          >
            <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>

            {/* Badge if notification and unread */}
            {item.isNotification && item.count > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                🔔 New
              </span>
            )}

            <h3 className="text-xs font-semibold text-gray-600">{item.title}</h3>
            <p className="text-2xl font-semibold text-indigo-600 mt-2">
              {item.count}
            </p>
            <Link
              to={item.link}
              className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
            >
              {item.linkText}
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            Developer Dashboard
          </h3>

          <div className="flex space-x-4 justify-center md:justify-start">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => handleViewChange("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => handleViewChange("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => handleViewChange("grid")}
            />
          </div>
        </div>

        {renderCounts()}
      </div>
    </div>
  );
};

export default DeveloperDashboard;
