// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// const UpdateNotification = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [notification, setNotification] = useState(null);
//   const [formData, setFormData] = useState({
//     audience: "",
//     receiverRole: "",
//     receiver: "",
//     message: "",
//     priority: "low",
//     type: "task_update",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("userToken") || localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isSuperadmin = user?.role === "superadmin";

//   useEffect(() => {
//     const fetchNotification = async () => {
//       try {
//         const res = await axios.get(`${globalBackendRoute}/api/admin/messages`, {
//           params: { page: 1, limit: 200 },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const matched = res.data.data.find((n) => n._id === id);
//         if (matched) {
//           setNotification(matched);
//           setFormData({
//             audience: matched.audience,
//             receiverRole: matched.receiverRole || "",
//             receiver: matched.receiver || "",
//             message: matched.message,
//             priority: matched.priority,
//             type: matched.type,
//           });
//         } else {
//           setError("Notification not found.");
//         }
//       } catch (err) {
//         setError("Error fetching notification.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotification();
//   }, [id, token]);

//   const handleUpdate = async () => {
//     try {
//       await axios.put(
//         `${globalBackendRoute}/api/notifications/update-message/${id}`,
//         { message: formData.message },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Notification updated successfully.");
//       navigate(-1);
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Failed to update notification.");
//     }
//   };

//   if (!isSuperadmin) return <div className="p-6 text-red-600">Access Denied</div>;
//   if (loading) return <div className="p-6">Loading...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;
//   if (!notification) return <div className="p-6">Notification not found.</div>;

//   return (
//     <div className="max-w-3xl mx-auto py-10 px-4">
//       <h2 className="text-2xl font-bold text-indigo-600 mb-4">Update Notification</h2>

//       <div className="bg-white shadow-md rounded-lg p-6 border">
//         <label className="block text-sm font-semibold text-gray-700 mb-2">
//           Message
//         </label>
//         <textarea
//           rows={5}
//           className="w-full border rounded p-2 text-sm mb-4"
//           value={formData.message}
//           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//         />

//         <button
//           onClick={handleUpdate}
//           className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
//         >
//           Save Update
//         </button>

//         <button
//           onClick={() => navigate(-1)}
//           className="ml-3 px-4 py-2 bg-gray-300 text-black rounded text-sm"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UpdateNotification;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const UpdateNotification = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    audience: "",
    receiverRole: "",
    receiver: "",
    message: "",
    priority: "low",
    type: "task_update",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperadmin = user?.role === "superadmin";

  // ✅ Debug: check if ID is valid
  useEffect(() => {
    if (!id || id.length !== 24) {
      setError("Invalid notification ID.");
      setLoading(false);
      return;
    }
    console.log("Update Notification ID:", id);

    const fetchNotification = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/admin/messages`, {
          params: { page: 1, limit: 200 },
          headers: { Authorization: `Bearer ${token}` },
        });

        const matched = res.data.data.find((n) => n._id === id);
        if (matched) {
          setNotification(matched);
          setFormData({
            audience: matched.audience,
            receiverRole: matched.receiverRole || "",
            receiver: matched.receiver || "",
            message: matched.message,
            priority: matched.priority,
            type: matched.type,
          });
        } else {
          setError("Notification not found.");
        }
      } catch (err) {
        setError("Error fetching notification.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${globalBackendRoute}/api/notifications/update-message/${id}`,
        { message: formData.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Notification updated successfully.");
      navigate(-1);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update notification.");
    }
  };

  if (!isSuperadmin) return <div className="p-6 text-red-600">Access Denied</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!notification) return <div className="p-6">Notification not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Update Notification</h2>

      <div className="bg-white shadow-md rounded-lg p-6 border">
        <p className="text-sm text-gray-500 mb-2">
          <strong>ID:</strong> {notification._id}
        </p>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Message
        </label>
        <textarea
          rows={5}
          className="w-full border rounded p-2 text-sm mb-4"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
        >
          Save Update
        </button>

        <button
          onClick={() => navigate(-1)}
          className="ml-3 px-4 py-2 bg-gray-300 text-black rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;

