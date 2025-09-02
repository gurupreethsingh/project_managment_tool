

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaProjectDiagram,
//   FaTasks,
//   FaCalendarAlt,
//   FaUserClock,
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaRegCalendarCheck,
//   FaClipboardList,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";

// export default function TestEngineerDashboard() {
//   const [view, setView] = useState("grid");
//   const [assignedProjects, setAssignedProjects] = useState(0);
//   const [assignedTasks, setAssignedTasks] = useState(0);
//   const [assignedEvents, setAssignedEvents] = useState(0);
//   const [assignedMeetings, setAssignedMeetings] = useState(0);
//   const [attendanceCount, setAttendanceCount] = useState(0); // ✅ Attendance state
//   const [notification,setNotifiction] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user ? user.id : null;
//   const role = user ? user.role : null;

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
//       const { assignedProjectsCount } = response.data;
//       setAssignedProjects(assignedProjectsCount);

//       // ✅ Fetch attendance count
//       const attendanceRes = await axios.get(
//         `http://localhost:5000/api/count-attendance/employee/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setAttendanceCount(attendanceRes.data.count);

//     const notifRes = await axios.get(
//       `http://localhost:5000/api/count-notifications/${userId}`,
//       {
//         headers: {Authorization:`Bearer ${localStorage.getItem("token")}`}
//       },
      
//     );
//       setNotifiction(notifRes.data.total)


//     } catch (error) {
//       console.error("Error fetching counts:", error);
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
//         title: "Assigned Tasks",
//         count: assignedTasks,
//         icon: <FaTasks className="text-green-500" />,
//         linkText: "View Assigned Tasks",
//         link: "/assigned-tasks",
//       },
//       {
//         title: "Upcoming Events",
//         count: assignedEvents,
//         icon: <FaCalendarAlt className="text-purple-500" />,
//         linkText: "View Events",
//         link: "/events",
//       },
//       {
//         title: "Scheduled Meetings",
//         count: assignedMeetings,
//         icon: <FaUserClock className="text-yellow-500" />,
//         linkText: "View Meetings",
//         link: "/meetings",
//       },
//       {
//         title: "Mark Attendance", // ✅ Attendance Card
//         count: attendanceCount,
//         icon: <FaRegCalendarCheck className="text-green-600" />,
//         linkText: "Go to Attendance",
//         link: `/create-attendance`,
//       },
//       {
//         title: "View My Notifications",
//         count: notification,
//         icon: <FaClipboardList className="text-indigo-600"/>,
//         linkText: "View My Notifictions",
//         link:"/my-notifications",
        
//       }
//     ];

//     return (
//       <div
//         className={`${
//           view === "grid"
//             ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//             : view === "card"
//             ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             : "space-y-4"
//         }`}
//       >
//         {counts.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center justify-between hover:shadow-2xl transform transition-transform duration-300 text-center"
//             style={{ alignItems: "stretch" }}
//           >
//             <div className="text-4xl mb-4 flex justify-center">{item.icon}</div>
//             <h3 className="text-lg font-bold text-gray-600 mb-2">{item.title}</h3>
//             <p className="text-2xl font-semibold text-indigo-600 mb-4">{item.count}</p>
//             {item.link && (
//               <Link
//                 to={item.link}
//                 className="text-indigo-600 hover:text-indigo-800 font-medium"
//               >
//                 {item.linkText}
//               </Link>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8 sm:flex-row flex-col text-center sm:text-left">
//           <h3 className="text-2xl font-bold text-indigo-600 mb-4 sm:mb-0">
//             Test Engineer Dashboard
//           </h3>

//           <div className="flex justify-center sm:justify-end items-center space-x-2">
//             <FaThList
//               className={`text-xl cursor-pointer mr-4 ${
//                 view === "list" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => handleViewChange("list")}
//             />
//             <FaThLarge
//               className={`text-xl cursor-pointer mr-4 ${
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
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaProjectDiagram,
  FaTasks,
  FaCalendarAlt,
  FaUserClock,
  FaThList,
  FaThLarge,
  FaTh,
  FaRegCalendarCheck,
  FaClipboardList,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function TestEngineerDashboard() {
  const [view, setView] = useState("grid");
  const [assignedProjects, setAssignedProjects] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [assignedEvents, setAssignedEvents] = useState(0);
  const [assignedMeetings, setAssignedMeetings] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0); // ✅ New

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const role = user ? user.role : null;

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
      const { assignedProjectsCount } = response.data;
      setAssignedProjects(assignedProjectsCount);

      const attendanceRes = await axios.get(
        `http://localhost:5000/api/count-attendance/employee/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttendanceCount(attendanceRes.data.count);

      const notifRes = await axios.get(
        `http://localhost:5000/api/count-notifications/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUnreadNotifications(notifRes.data.unread); // ✅ Only unread count

    } catch (error) {
      console.error("Error fetching counts:", error);
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
        title: "Assigned Tasks",
        count: assignedTasks,
        icon: <FaTasks className="text-green-500" />,
        linkText: "View Assigned Tasks",
        link: "/assigned-tasks",
      },
      {
        title: "Upcoming Events",
        count: assignedEvents,
        icon: <FaCalendarAlt className="text-purple-500" />,
        linkText: "View Events",
        link: "/events",
      },
      {
        title: "Scheduled Meetings",
        count: assignedMeetings,
        icon: <FaUserClock className="text-yellow-500" />,
        linkText: "View Meetings",
        link: "/meetings",
      },
      {
        title: "Mark Attendance",
        count: attendanceCount,
        icon: <FaRegCalendarCheck className="text-green-600" />,
        linkText: "Go to Attendance",
        link: `/create-attendance`,
      },
      {
        title: "Unread Notifications",
        count: unreadNotifications,
        icon: <FaClipboardList className="text-indigo-600" />,
        linkText: "Go to Notifications",
        link: "/my-notifications",
        isNotification: true, // ✅ Flag for badge
      },
    ];

    return (
      <div
        className={`${
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            : view === "card"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }`}
      >
        {counts.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center justify-between hover:shadow-2xl transform transition-transform duration-300 text-center relative"
            style={{ alignItems: "stretch" }}
          >
            <div className="text-4xl mb-4 flex justify-center">{item.icon}</div>

            {/* 🔔 Show badge if unread */}
            {item.isNotification && item.count > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                🔔 New
              </span>
            )}

            <h3 className="text-lg font-bold text-gray-600 mb-2">{item.title}</h3>
            <p className="text-2xl font-semibold text-indigo-600 mb-4">{item.count}</p>
            {item.link && (
              <Link
                to={item.link}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {item.linkText}
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 sm:flex-row flex-col text-center sm:text-left">
          <h3 className="text-2xl font-bold text-indigo-600 mb-4 sm:mb-0">
            Test Engineer Dashboard
          </h3>

          <div className="flex justify-center sm:justify-end items-center space-x-2">
            <FaThList
              className={`text-xl cursor-pointer mr-4 ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => handleViewChange("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer mr-4 ${
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
}
