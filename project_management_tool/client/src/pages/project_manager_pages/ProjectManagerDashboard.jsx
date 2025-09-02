import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaProjectDiagram,
  FaUsers,
  FaUserTie,
  FaUserCheck,
  FaClipboardCheck,
  FaTasks,
  FaExclamationTriangle,
  FaSitemap,
  FaBell,
  FaRegCalendarCheck,
  FaThList,
  FaThLarge,
  FaTh,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const ProjectManagerDashboard = () => {
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);

  // Core project stats
  const [myProjects, setMyProjects] = useState(0);
  const [activeSprints, setActiveSprints] = useState(0);

  // Task stats
  const [openTasks, setOpenTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [blockedTasks, setBlockedTasks] = useState(0);
  const [dueThisWeek, setDueThisWeek] = useState(0);

  // Approvals & risks
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [openRisks, setOpenRisks] = useState(0);

  // Team composition (under this PM)
  const [devCount, setDevCount] = useState(0);
  const [qaCount, setQaCount] = useState(0);
  const [totalTeam, setTotalTeam] = useState(0);

  // Notifications (team + mine)
  const [notifCounts, setNotifCounts] = useState({
    total: 0,
    team: 0,
    mine: 0,
  });

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");
      const auth = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      // Call your real endpoints here. These are examples—rename if needed.
      // Keep them separate so partial failures don’t kill the whole UI.
      const projectRes = await axios.get("http://loaclhost:5000/count-projects");
     setMyProjects(projectRes.data.myProjects);



     const tasksRes = await axios.get("http://localhost:5000/")

     

      // ----- Tasks -----
      const t = tasksRes?.data || {};
      setOpenTasks(t.open ?? 0);
      setInProgressTasks(t.inProgress ?? 0);
      setBlockedTasks(t.blocked ?? 0);
      setDueThisWeek(t.dueThisWeek ?? 0);

      // ----- Approvals & Risks -----
      const ar = apprRisksRes?.data || {};
      setPendingApprovals(ar.pendingApprovals ?? 0);
      setOpenRisks(ar.openRisks ?? 0);

      // ----- Team -----
      const tm = teamRes?.data || {};
      const devs = tm.developers ?? 0;
      const qas = tm.testEngineers ?? 0;
      setDevCount(devs);
      setQaCount(qas);
      setTotalTeam((tm.totalTeam ?? devs + qas) || 0);

      // ----- Notifications -----
      const nc = notifRes?.data || {};
      setNotifCounts({
        total: nc.total ?? (nc.team ?? 0) + (nc.mine ?? 0),
        team: nc.team ?? 0,
        mine: nc.mine ?? 0,
      });
    } catch (err) {
      console.error("PM dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (v) => setView(v);

  const cards = [
    {
      title: "My Projects",
      count: myProjects,
      icon: <FaProjectDiagram className="text-blue-500" />,
      linkText: "View My Projects",
      link: "/pm/my-projects",
    },
    {
      title: "Active Sprints",
      count: activeSprints,
      icon: <FaSitemap className="text-indigo-500" />,
      linkText: "Sprint Board",
      link: "/pm/sprints",
    },
    {
      title: "Open Tasks",
      count: openTasks,
      icon: <FaTasks className="text-emerald-500" />,
      linkText: "Task Board",
      link: "/pm/tasks?status=open",
    },
    {
      title: "In Progress",
      count: inProgressTasks,
      icon: <FaClipboardCheck className="text-yellow-500" />,
      linkText: "Task Board",
      link: "/pm/tasks?status=in-progress",
    },
    {
      title: "Blocked",
      count: blockedTasks,
      icon: <FaExclamationTriangle className="text-red-500" />,
      linkText: "Resolve Blockers",
      link: "/pm/blockers",
    },
    {
      title: "Due This Week",
      count: dueThisWeek,
      icon: <FaClipboardCheck className="text-purple-500" />,
      linkText: "Upcoming Deadlines",
      link: "/pm/tasks?due=week",
    },
    {
      title: "Pending Approvals",
      count: pendingApprovals,
      icon: <FaClipboardCheck className="text-sky-500" />,
      linkText: "Review & Approve",
      link: "/pm/approvals",
    },
    {
      title: "Open Risks",
      count: openRisks,
      icon: <FaExclamationTriangle className="text-orange-500" />,
      linkText: "Risk Register",
      link: "/pm/risks",
    },
    {
      title: "Team (Total)",
      count: totalTeam,
      icon: <FaUsers className="text-pink-500" />,
      linkText: "Team Overview",
      link: "/pm/team",
    },
    {
      title: "Developers",
      count: devCount,
      icon: <FaUserTie className="text-teal-500" />,
      linkText: "Developers",
      link: "/pm/team?role=developer",
    },
    {
      title: "Test Engineers",
      count: qaCount,
      icon: <FaUserCheck className="text-purple-600" />,
      linkText: "Test Engineers",
      link: "/pm/team?role=test",
    },
    {
      title: "Notifications (Total)",
      count: notifCounts.total,
      icon: <FaBell className="text-fuchsia-500" />,
      linkText: "Team Notifications",
      link: "/pm/notifications",
    },
    {
      title: "My Notifications",
      count: notifCounts.mine,
      icon: <FaBell className="text-green-600" />,
      linkText: "View Mine",
      link: "/my-notifications",
    },
    {
      title: "Team Notifications",
      count: notifCounts.team,
      icon: <FaBell className="text-indigo-600" />,
      linkText: "View Team",
      link: "/pm/notifications?scope=team",
    },
    {
      title: "View Attendance",
      count: undefined,
      icon: <FaRegCalendarCheck className="text-green-600" />,
      linkText: "Go to Attendance",
      link: "/view-all-attendance",
    },
  ];

  const renderCards = () => (
    <div
      className={`${
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          : view === "card"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          : "space-y-4"
      }`}
    >
      {cards.map((c, idx) => (
        <div
          key={idx}
          className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
        >
          <div className="text-4xl mb-2 flex justify-center">{c.icon}</div>
          <h3 className="text-xs font-semibold text-gray-600">{c.title}</h3>
          {typeof c.count !== "undefined" && (
            <p className="text-2xl font-semibold text-indigo-600 mt-2">
              {loading ? "…" : c.count}
            </p>
          )}
          <Link
            to={c.link}
            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
          >
            {c.linkText}
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            Project Manager Dashboard
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

        {/* Cards */}
        {renderCards()}
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
