

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const ViewAllMyNotification = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [filteredNotifications, setFilteredNotifications] = useState([]);
//   const [replyBox, setReplyBox] = useState(null);
//   const [replyMessage, setReplyMessage] = useState("");
//   const [popup, setPopup] = useState("");

//   // Filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [date, setDate] = useState("");
//   const [priority, setPriority] = useState("");
//   const [type, setType] = useState("");
//   const [readStatus, setReadStatus] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [notifications, searchTerm, date, priority, type, readStatus]);

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get(`${globalBackendRoute}/api/my-notifications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications(res.data || []);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...notifications];

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter((n) =>
//         n.message.toLowerCase().includes(term) ||
//         n?.sender?.name?.toLowerCase().includes(term)
//       );
//     }

//     if (date) {
//       filtered = filtered.filter(
//         (n) => new Date(n.createdAt).toISOString().split("T")[0] === date
//       );
//     }

//     if (priority) {
//       filtered = filtered.filter((n) => n.priority === priority);
//     }

//     if (type) {
//       filtered = filtered.filter((n) => n.type === type);
//     }

//     if (readStatus === "read") {
//       filtered = filtered.filter((n) => n.isRead === true);
//     } else if (readStatus === "unread") {
//       filtered = filtered.filter((n) => !n.isRead);
//     }

//     setFilteredNotifications(filtered);
//   };

//   const updateReadStatus = (notificationId) => {
//     setNotifications((prev) =>
//       prev.map((n) =>
//         n._id === notificationId ? { ...n, isRead: true } : n
//       )
//     );
//   };

//   const handleAccept = async (notificationId) => {
//     try {
//       await axios.put(
//         `${globalBackendRoute}/api/mark-read/${notificationId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       updateReadStatus(notificationId);
//       setPopup("Notification accepted ✅");
//       setTimeout(() => setPopup(""), 3000);
//     } catch (err) {
//       console.error("Accept error:", err);
//     }
//   };

//   const handleReject = (notificationId) => {
//     setReplyBox(notificationId);
//     setReplyMessage("");
//   };

//   const sendReply = async (notificationId) => {
//     if (!replyMessage.trim()) return;
//     try {
//       await axios.put(
//         `${globalBackendRoute}/api/reply-to-notification/${notificationId}`,
//         { replyContent: replyMessage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Also mark it as read
//       await axios.put(
//         `${globalBackendRoute}/api/mark-read/${notificationId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       updateReadStatus(notificationId);
//       setPopup("Reply sent ✉️");
//       setTimeout(() => setPopup(""), 3000);
//       setReplyBox(null);
//     } catch (err) {
//       console.error("Reply error:", err);
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setDate("");
//     setPriority("");
//     setType("");
//     setReadStatus("");
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-12 px-4">
//       <h2 className="text-2xl font-bold text-indigo-600 mb-6">My Notifications</h2>

//       {popup && <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">{popup}</div>}

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by message or sender"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <select
//           value={priority}
//           onChange={(e) => setPriority(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All Priorities</option>
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//           <option value="urgent">Urgent</option>
//         </select>
//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All Types</option>
//           <option value="alert">Alert</option>
//           <option value="comment">Comment</option>
//           <option value="reply">Reply</option>
//           <option value="bug_report">Bug Report</option>
//           <option value="task_update">Task Update</option>
//         </select>
//         <select
//           value={readStatus}
//           onChange={(e) => setReadStatus(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All</option>
//           <option value="read">Read</option>
//           <option value="unread">Unread</option>
//         </select>
//         <button
//           onClick={clearFilters}
//           className="border p-2 rounded text-red-600 hover:bg-red-100"
//         >
//           Clear Filters
//         </button>
//       </div>

//       {filteredNotifications.length === 0 ? (
//         <p className="text-gray-600">No notifications found.</p>
//       ) : (
//         filteredNotifications.map((note) => (
//           <div key={note._id} className="bg-white shadow p-4 rounded mb-4">
//             <div className="flex justify-between items-center mb-2">
//               <div>
//                 <p className="font-semibold">{note.type.replace("_", " ").toUpperCase()}</p>
//                 <p className="text-sm text-gray-500">
//                   From: {note?.sender?.name || "System"} ({note?.sender?.role || "system"})
//                 </p>
//               </div>
//               <div className="flex gap-2 items-center">
//                 <span
//                   className={`text-xs px-2 py-1 rounded ${
//                     note.priority === "urgent"
//                       ? "bg-red-100 text-red-600"
//                       : note.priority === "high"
//                       ? "bg-yellow-100 text-yellow-600"
//                       : note.priority === "medium"
//                       ? "bg-blue-100 text-blue-600"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {note.priority.toUpperCase()}
//                 </span>
//                 <span
//                   className={`text-xs px-2 py-1 rounded ${
//                     note.isRead ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {note.isRead ? "Read" : "Unread"}
//                 </span>
//               </div>
//             </div>

//             <p className="mb-3">{note.message}</p>

//             <div className="flex gap-3">
//               <button
//                 className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                 onClick={() => handleAccept(note._id)}
//               >
//                 Accept
//               </button>
//               <button
//                 className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                 onClick={() => handleReject(note._id)}
//               >
//                 Reject
//               </button>
//             </div>

//             {replyBox === note._id && (
//               <div className="mt-4">
//                 <textarea
//                   rows={3}
//                   className="w-full p-2 border rounded mb-2"
//                   placeholder="Enter your reply message..."
//                   value={replyMessage}
//                   onChange={(e) => setReplyMessage(e.target.value)}
//                 />
//                 <button
//                   className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   onClick={() => sendReply(note._id)}
//                 >
//                   Send Reply
//                 </button>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ViewAllMyNotification;




import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const ViewAllMyNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [replyBox, setReplyBox] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [popup, setPopup] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [readStatus, setReadStatus] = useState("");

  const token = localStorage.getItem("token");
  const previousNotificationCount = useRef(0);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Apply filters when notifications change or filter values change
  useEffect(() => {
    applyFilters();
  }, [notifications, searchTerm, date, priority, type, readStatus]);

  // Poll every 10 seconds for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewNotifications();
    }, 10000); // every 10s

    return () => clearInterval(interval); // cleanup
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${globalBackendRoute}/api/my-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data || [];
      setNotifications(data);
      previousNotificationCount.current = data.length; // store initial count
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const checkForNewNotifications = async () => {
    try {
      const res = await axios.get(`${globalBackendRoute}/api/my-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newData = res.data || [];

      if (newData.length > previousNotificationCount.current) {
        setPopup("🔔 You received a new notification!");
        setTimeout(() => setPopup(""), 4000);
      }

      previousNotificationCount.current = newData.length;
      setNotifications(newData);
    } catch (error) {
      console.error("Error polling notifications:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.message.toLowerCase().includes(term) ||
          n?.sender?.name?.toLowerCase().includes(term)
      );
    }

    if (date) {
      filtered = filtered.filter(
        (n) => new Date(n.createdAt).toISOString().split("T")[0] === date
      );
    }

    if (priority) {
      filtered = filtered.filter((n) => n.priority === priority);
    }

    if (type) {
      filtered = filtered.filter((n) => n.type === type);
    }

    if (readStatus === "read") {
      filtered = filtered.filter((n) => n.isRead === true);
    } else if (readStatus === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    }

    setFilteredNotifications(filtered);
  };

  const updateReadStatus = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleAccept = async (notificationId) => {
    try {
      await axios.put(
        `${globalBackendRoute}/api/mark-read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateReadStatus(notificationId);
      setPopup("Notification accepted ✅");
      setTimeout(() => setPopup(""), 3000);
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  const handleReject = (notificationId) => {
    setReplyBox(notificationId);
    setReplyMessage("");
  };

  const sendReply = async (notificationId) => {
    if (!replyMessage.trim()) return;
    try {
      await axios.put(
        `${globalBackendRoute}/api/reply-to-notification/${notificationId}`,
        { replyContent: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Also mark it as read
      await axios.put(
        `${globalBackendRoute}/api/mark-read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      updateReadStatus(notificationId);
      setPopup("Reply sent ✉️");
      setTimeout(() => setPopup(""), 3000);
      setReplyBox(null);
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDate("");
    setPriority("");
    setType("");
    setReadStatus("");
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">My Notifications</h2>

      {popup && <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">{popup}</div>}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by message or sender"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="alert">Alert</option>
          <option value="comment">Comment</option>
          <option value="reply">Reply</option>
          <option value="bug_report">Bug Report</option>
          <option value="task_update">Task Update</option>
        </select>
        <select
          value={readStatus}
          onChange={(e) => setReadStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
        <button
          onClick={clearFilters}
          className="border p-2 rounded text-red-600 hover:bg-red-100"
        >
          Clear Filters
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <p className="text-gray-600">No notifications found.</p>
      ) : (
        filteredNotifications.map((note) => (
          <div key={note._id} className="bg-white shadow p-4 rounded mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{note.type.replace("_", " ").toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  From: {note?.sender?.name || "System"} ({note?.sender?.role || "system"})
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    note.priority === "urgent"
                      ? "bg-red-100 text-red-600"
                      : note.priority === "high"
                      ? "bg-yellow-100 text-yellow-600"
                      : note.priority === "medium"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {note.priority.toUpperCase()}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    note.isRead ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {note.isRead ? "Read" : "Unread"}
                </span>
              </div>
            </div>

            <p className="mb-3">{note.message}</p>

            <div className="flex gap-3">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => handleAccept(note._id)}
              >
                Accept
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleReject(note._id)}
              >
                Reject
              </button>
            </div>

            {replyBox === note._id && (
              <div className="mt-4">
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Enter your reply message..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => sendReply(note._id)}
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ViewAllMyNotification;


