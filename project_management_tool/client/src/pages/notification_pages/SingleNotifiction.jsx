

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// const SingleNotification = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("userToken") || localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isSuperadmin = user?.role === "superadmin";

//   const [notification, setNotification] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [replyMessage, setReplyMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch Notification
//   useEffect(() => {
//     const fetchNotification = async () => {
//       try {
//         const res = await axios.get(`${globalBackendRoute}/api/admin/message/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNotification(res.data);
//       } catch (err) {
//         setError("Notification not found.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotification();
//     fetchReplies();
//   }, [id, token]);

//   // Fetch Replies
//   const fetchReplies = async () => {
//     try {
//       const res = await axios.get(`${globalBackendRoute}/api/admin/message/${id}/replies`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReplies(res.data.replies || []);
//     } catch (err) {
//       console.error("Failed to fetch replies:", err);
//     }
//   };

//   // Handle Reply Submit
//   const handleSendReply = async () => {
//     if (!replyMessage.trim()) return;

//     try {
//       await axios.put(
//         `${globalBackendRoute}/api/reply-to-notification/${id}`,
//         { content: replyMessage },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setReplyMessage("");
//       fetchReplies(); // refresh
//     } catch (err) {
//       console.error("Reply send failed:", err);
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;
//   if (!notification) return <div className="p-6">Notification not found.</div>;

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-4">
//       <h2 className="text-2xl font-bold text-indigo-600 mb-4">Notification Details</h2>

//       {/* Notification Card */}
//       <div className="bg-white shadow-md rounded-lg p-6 border mb-6">
//         <p className="text-sm text-gray-600 mb-2">
//           <strong>Audience:</strong> {notification.audience}
//         </p>
//         <p className="text-sm text-gray-600 mb-2">
//           <strong>Role:</strong> {notification.receiverRole || "-"}
//         </p>
//         <p className="text-sm text-gray-600 mb-2">
//           <strong>Type:</strong> {notification.type}
//         </p>
//         <p className="text-sm text-gray-600 mb-2">
//           <strong>Priority:</strong> {notification.priority}
//         </p>
//         <p className="text-sm text-gray-600 mb-2">
//           <strong>Sender:</strong> {notification.sender?.name || "-"}
//         </p>
//         <p className="text-sm text-gray-600 mb-2">
//           <strong>Created:</strong> {new Date(notification.createdAt).toLocaleString()}
//         </p>
//         <div className="text-sm text-gray-800">
//           <strong>Message:</strong> {notification.message}
//         </div>

//         {isSuperadmin && (
//           <button
//             onClick={() => navigate(`/update-notification/${id}`)}
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded text-sm"
//           >
//             Update Notification
//           </button>
//         )}
//       </div>

//       {/* Replies Section */}
//       <div className="bg-white rounded-lg shadow p-6 border mb-6">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Replies</h3>
//         <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
//           {replies.length === 0 ? (
//             <p className="text-sm text-gray-500">No replies yet.</p>
//           ) : (
//             replies.map((reply, idx) => {
//               const isMyReply = reply.userId === user._id;
//               return (
//                 <div
//                   key={idx}
//                   className={`flex ${isMyReply ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`p-3 max-w-md rounded-lg shadow ${
//                       isMyReply ? "bg-blue-100" : "bg-gray-200"
//                     }`}
//                   >
//                     <div className="text-xs font-semibold text-gray-600 mb-1">
//                       {reply.name} ({reply.role})
//                     </div>
//                     <div className="text-sm">{reply.content}</div>
//                     <div className="text-xs text-gray-400 mt-1">
//                       {new Date(reply.repliedAt).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Reply Input Box */}
//         <div className="mt-6 flex items-center space-x-2">
//           <input
//             type="text"
//             value={replyMessage}
//             onChange={(e) => setReplyMessage(e.target.value)}
//             placeholder="Write a reply..."
//             className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//           <button
//             onClick={handleSendReply}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//           >
//             Send
//           </button>
//         </div>
//       </div>

//       {/* Back Button */}
//       <div>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-indigo-600 hover:text-indigo-800 underline text-sm"
//         >
//           ← Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SingleNotification;



// ✅ Full working SingleNotification.jsx with chat-style replies
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const SingleNotification = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperadmin = user?.role === "superadmin";

  // Fetch notification
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/admin/message/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotification(res.data);
      } catch (err) {
        setError("Notification not found.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
    fetchReplies();
  }, [id, token]);

  // Fetch all replies
  const fetchReplies = async () => {
    try {
      const res = await axios.get(`${globalBackendRoute}/api/admin/message/${id}/replies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Replies fetched:", res.data);
      setReplies(res.data.replies);
    } catch (err) {
      console.error("Failed to fetch replies", err);
    }
  };

  // Submit reply
  const handleReply = async () => {
    try {
      await axios.put(
        `${globalBackendRoute}/api/reply-to-notification/${id}`,
        { reply: replyMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReplyMessage("");
      fetchReplies(); // refresh replies
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!notification) return <div className="p-6">Notification not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Notification Details</h2>

      <div className="bg-white shadow-md rounded-lg p-6 border mb-6">
        <p className="text-sm text-gray-600 mb-2">
          <strong>ID:</strong> {notification._id}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Audience:</strong> {notification.audience}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Role:</strong> {notification.receiverRole || "-"}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Type:</strong> {notification.type}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Priority:</strong> {notification.priority}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Sender:</strong> {notification.sender?.name || "-"}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>Created:</strong> {new Date(notification.createdAt).toLocaleString()}
        </p>

        <div className="text-sm text-gray-800 mb-3">
          <strong>Message:</strong> {notification.message}
        </div>

        {isSuperadmin && (
          <button
            onClick={() => navigate(`/update-notification/${id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
          >
            Update Notification
          </button>
        )}
      </div>

      {/* Chat UI */}
      <div className="bg-white shadow p-4 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Replies</h3>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {replies.length === 0 ? (
            <p className="text-gray-500">No replies yet.</p>
          ) : (
            replies.map((reply, index) => (
              <div
                key={index}
                className={`flex ${reply.userId === user._id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm p-3 rounded-lg shadow text-sm text-gray-900 ${
                    reply.userId === user._id ? "bg-blue-100" : "bg-gray-200"
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">
                    {reply.name} ({reply.role})
                  </div>
                  <div>{reply.content}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(reply.repliedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Type your reply..."
          />
          <button
            onClick={handleReply}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 underline text-sm"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default SingleNotification;
