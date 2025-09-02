import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Homepage from "./pages/common_pages/Homepage";
import Header from "./components/Header";
import Login from "./pages/common_pages/Login";
import Register from "./pages/common_pages/Register";
import Dashboard from "./pages/common_pages/Dashboard";
import PageNotFound from "./pages/common_pages/PageNotFound";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/common_pages/Profile";
import UpdateProfile from "./pages/common_pages/UpdateProfile";
import AllUsers from "./pages/admin_pages/AllUsers";
import ContactUs from "./pages/contact_pages/ContactUs";
import AllMessages from "./pages/contact_pages/AllMessages";
import AllReplies from "./pages/contact_pages/AllReplies";
import ReplyMessage from "./pages/contact_pages/ReplyMessage";
import PrivacyPolicy from "./pages/common_pages/PrivacyPolicy";
import AllBlogs from "./pages/blog_pages/AllBlogs";
import AddBlog from "./pages/blog_pages/AddBlog";
import SingleBlog from "./pages/blog_pages/SingleBlog";
import AboutUs from "./pages/common_pages/AboutUs";

import NewsLetter from "./components/NewsLetter";
import WorkWithUs from "./components/WorkWithUs";
import Footer from "./components/Footer";
import Subscriptions from "./pages/subscription_pages/Subscriptions";
import SuperAdminDashboard from "./pages/admin_pages/SuperAdminDashboard";
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
import QaDashboard from "./pages/tester_dashboard/QaDashboard";
import TestEngineerDashboard from "./pages/tester_dashboard/TestEngineerDashboard";
import DeveloperDashboard from "./pages/developer_pages/DeveloperDashboard";
import CreateProject from "./pages/project_pages/CreateProject";
import AllProjects from "./pages/project_pages/AllProjects";
import SingleProject from "./pages/project_pages/SingleProject";
import AddScenario from "./pages/scenario_pages/AddScenario";
import AllScenarios from "./pages/scenario_pages/AllScenarios";
import SingleScenario from "./pages/scenario_pages/SingleScenario";
import AllAdmins from "./pages/admin_pages/AllAdmins";
import AllDevelopers from "./pages/developer_pages/AllDevelopers";
import AllTestEngineers from "./pages/tester_dashboard/AllTestEngineers";
import AddTestCase from "./pages/tester_dashboard/AddTestCase";
import AllTestCases from "./pages/tester_dashboard/AllTestCases";
import SingleTestCase from "./pages/tester_dashboard/SingleTestCase";
import TestCaseDetail from "./pages/tester_dashboard/TestCaseDetail";
import TestCaseDashboard from "./pages/tester_dashboard/TestCaseDashboard";
import TraceabilityMatrix from "./pages/tester_dashboard/TraceabilityMatrix";
import AssignTask from "./pages/task_pages/AssignTask";
import ViewAllTasks from "./pages/task_pages/ViewAllTasks";
import AddDefect from "./pages/defect_report_pages/AddDefect";
import AllDefects from "./pages/defect_report_pages/AllDefects";
import SingleDefect from "./pages/defect_report_pages/SingleDefect";
import BugHistory from "./pages/defect_report_pages/BugHistory";
import AllAssignedProjects from "./pages/project_pages/AllAssignedProjects";
import ViewAssignedTasks from "./pages/task_pages/ViewAssignedTasks";
import TaskHistory from "./pages/task_pages/TaskHistory";
import AssignDefect from "./pages/developer_pages/AssignDefect";
import DeveloperAssignedDefects from "./pages/developer_pages/DeveloperAssignedDefects";
import DeveloperLeadDashboard from "./pages/developer_pages/DeveloperLeadDashboard";

// reqirement pages. 
import CreateRequirement from "./pages/requirement_pages/CreateRequirement";
import AllRequirements from "./pages/requirement_pages/AllRequirements";
import SingleRequirement from "./pages/requirement_pages/SingleRequirement";

// event pages.
import CreateEvent from "./pages/event_pages/CreateEvent";

// attendence page.
import GetAllAttendance from "./pages/attendence_pages/GetAllAttendance";
import CreateAttendance from "./pages/attendence_pages/CreateAttendance";
import SingleAttendance from "./pages/attendence_pages/SingleAttendance";
import EditAttendance from "./pages/attendence_pages/EditAttendance";

// notification pages.
import CreateNotification from "./pages/notification_pages/CreateNotification";
import AllNotifications from "./pages/notification_pages/AllNotifications";
import SingleNotification from "./pages/notification_pages/SingleNotifiction";
import UpdateNotification from "./pages/notification_pages/UpdateNotifiction";
import ViewAllMyNotification from "./pages/notification_pages/ViewAllMyNotifiction";


//Project Manager
import ProjectManagerDashboard from "./pages/project_manager_pages/ProjectManagerDashboard";

//Selenium pages
import AttributeBatchDemo from "./pages/selenium_pages/attributeBatchDemo";
import DomBatchDemo from "./pages/selenium_pages/DomBatchDemo";
import VisibilityDemo from "./pages/selenium_pages/VisibilityDemo";
import ClickableAndSelectedBatch from "./pages/selenium_pages/ClickableAndSelectedBatch";
import FrameBatchDemo from "./pages/selenium_pages/FrameBatchDemo";
import InvisibilityBatchDemo from "./pages/selenium_pages/InvisibilityBatchDemo";
import JsBatchDemo from "./pages/selenium_pages/JsBatchDemo";
import NumberOfElementsBatchDemo from "./pages/selenium_pages/NumberOfElementsBatchDemo";
import PresenceBatchDemo from "./pages/selenium_pages/PresenceBatchDemo";
import TextBatchDemo from "./pages/selenium_pages/TextBatchDemo";
import TitleUrlBatchDemo from "./pages/selenium_pages/TitleUrlBatchDemo"
import FramePlayground from "./pages/selenium_pages/FramePlayground";
import ActionsPlayground from "./pages/selenium_pages/ActionsPlayground";
import DropdownPlayground from "./pages/selenium_pages/DropdownPlayground";
import AlertsPlayground from "./pages/selenium_pages/AlertsPlayground";
import JsExecutorPalyground from "./pages/selenium_pages/JsExecutorPlayground"
import TabsPlayground from "./pages/selenium_pages/TabsPlayground";
import TablePlayground from "./pages/selenium_pages/TablePlayground";
import CalendarPlayground from "./pages/selenium_pages/CalendarPlayground";
import DynamicElementsPlayground from "./pages/selenium_pages/DynamicElementsPlayground";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `Ecoders - ${title}`;
  }, [title]);

  return null;
};

const TitleUpdater = () => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname === "/" || pathname === "/home" || pathname === "/homepage") {
      return "Home";
    } else if (pathname === "/login") {
      return "Login";
    } else if (pathname === "/register") {
      return "Register";
    } else if (pathname === "/contact") {
      return "Contact Us";
    } else if (pathname === "/about-us") {
      return "About Us";
    } else if (pathname === "/privacy-policy") {
      return "Privacy Policy";
    } else if (pathname === "/all-blogs") {
      return "All Blogs";
    } else if (/^\/single-blog\/\w+/.test(pathname)) {
      return "Single Blog";
    } else if (pathname === "/dashboard") {
      return "Dashboard";
    } else if (/^\/profile\/\w+/.test(pathname)) {
      return "Profile";
    } else if (/^\/update-profile\/\w+/.test(pathname)) {
      return "Update Profile";
    } else if (pathname === "/all-users") {
      return "All Users";
    } else if (pathname === "/add-blog") {
      return "Add Blog";
    } else if (pathname === "/all-messages") {
      return "All Messages";
    } else if (/^\/reply-message\/\w+/.test(pathname)) {
      return "Reply Message";
    } else if (pathname === "/all-replies") {
      return "All Replies";
    } else if (pathname === "/all-subscriptions") {
      return "All Subscriptions";
    } else if (pathname === "/super-admin-dashboard") {
      return "Super Admin Dashboard";
    } else if (pathname === "/admin-dashboard") {
      return "Admin Dashboard";
    } else if (pathname === "/qa-dashboard") {
      return "QA Dashboard";
    } else if (pathname === "/test-engineer-dashboard") {
      return "Test Engineer Dashboard";
    } else if (pathname === "/developer-dashboard") {
      return "Developer Dashboard";
    } else if (pathname === "/create-project") {
      return "Create Project";
    } else if (pathname === "/project-manager-dashboard") {
      return "Project Manager Dashboard";
    } else if (pathname === "/all-projects") {
      return "All Projects";
    } else if (pathname === "/all-admins") {
      return "All Admins";
    } else if (pathname === "/all-developers") {
      return "All Developers";
    } else if (pathname === "/all-test-engineers") {
      return "All Test Engineers";
    } else if (/^\/single-project\/\w+\/add-scenario/.test(pathname)) {
      return "Add Scenario";
    } else if (/^\/single-project\/\w+\/view-all-scenarios/.test(pathname)) {
      return "View Scenarios";
    } else if (/^\/single-project\/\w+\/scenario-history/.test(pathname)) {
      return "Scenario History";
    } else if (
      /^\/single-project\/\w+\/scenarios\/\w+\/add-test-case/.test(pathname)
    ) {
      return "Add Test Case"; // New condition for Add Test Case page
    } else if (/^\/single-project\/\w+\/add-defect/.test(pathname)) {
      return "Add Defect"; // New condition for Add Defect page
    } else if (/^\/single-project\/\w+/.test(pathname)) {
      return "Single Project";
    } else if (pathname === "/page-not-found") {
      return "Page Not Found";
    } else {
      return "Page Not Found";
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return <PageTitle title={pageTitle} />;
};

function App() {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // State for unread messages count

  return (
    <Router>
      <Header />
      <TitleUpdater />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/all-blogs" element={<AllBlogs />} />
        <Route path="/single-blog/:id" element={<SingleBlog />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-profile/:id"
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-users"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <AllUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-blog"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <AddBlog />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-subscriptions"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <Subscriptions />
            </PrivateRoute>
          }
        />

        <Route
          path="/super-admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/qa-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "project_manager",
              ]}
            >
              <QaDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/test-engineer-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "project_manager",
              ]}
            >
              <TestEngineerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "developer_lead",
                "project_manager",
              ]}
            >
              <CreateProject />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-projects"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AllProjects />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-admins"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <AllAdmins />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-developers"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AllDevelopers />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-test-engineers"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AllTestEngineers />
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <SingleProject />
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/add-scenario"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AddScenario />
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/view-all-scenarios"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AllScenarios />
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/scenario-history/:scenarioId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <SingleScenario />
            </PrivateRoute>
          }
        />

        {/* add test case route */}
        <Route
          path="/single-project/:projectId/scenario/:scenarioId/add-test-case"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AddTestCase />
            </PrivateRoute>
          }
        />

        {/* fetch all test case route */}
        <Route
          path="/single-project/:projectId/all-test-cases"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AllTestCases />
            </PrivateRoute>
          }
        />

        {/* fetch test case by id route */}
        <Route
          path="/get-test-case/:id"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <SingleTestCase />
            </PrivateRoute>
          }
        />

        {/* fetch test case by id route for updating*/}
        <Route
          path="/test-case-detail/:id"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <TestCaseDetail />
            </PrivateRoute>
          }
        />

        {/* route for test case dashboard.*/}
        <Route
          path="/test-case-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <TestCaseDashboard />
            </PrivateRoute>
          }
        />

        {/* route for test case traceability matrix.*/}
        <Route
          path="/single-project/:projectId/traceability-matrix"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <TraceabilityMatrix />
            </PrivateRoute>
          }
        />

        {/* route for assigning task to test engineers by qa.*/}
        <Route
          path="/projects/:projectId/assign-task"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AssignTask />
            </PrivateRoute>
          }
        />

        {/* route for assigning task to test engineers by qa.*/}
        <Route
          path="/single-project/:projectId/view-all-tasks"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <ViewAllTasks />
            </PrivateRoute>
          }
        />

        {/* route to go to developer dashboard */}
        <Route
          path="/developer-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <DeveloperDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-messages"
          element={
            <PrivateRoute
              allowedRoles={["admin", "superadmin", "project_manager"]}
            >
              <AllMessages />
            </PrivateRoute>
          }
        />
        <Route
          path="/reply-message/:id"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "developer_lead",
                "project_manager",
              ]}
            >
              <ReplyMessage setUnreadMessagesCount={setUnreadMessagesCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-replies"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <AllReplies />
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/add-defect"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AddDefect /> {/* Replace with your Add Bug component */}
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/all-defects"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AllDefects /> {/* Replace with your Add Bug component */}
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/defect/:defectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <SingleDefect /> {/* Replace with your Add Bug component */}
            </PrivateRoute>
          }
        />

        <Route
          path="/bug-history/:defectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <BugHistory /> {/* Replace with your BugHistory component */}
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/assign-defect/:defectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AssignDefect /> {/* Replace with your BugHistory component */}
            </PrivateRoute>
          }
        />

        <Route
          path="/user-assigned-projects/:userId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <AllAssignedProjects />{" "}
              {/* Replace with your BugHistory component */}
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/user-assigned-tasks/:userId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <ViewAssignedTasks />{" "}
              {/* Replace with your BugHistory component */}
            </PrivateRoute>
          }
        />

        {/* // view task history */}
        <Route
          path="/single-project/:projectId/single-task/:taskId"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "qa_lead",
              ]}
            >
              <TaskHistory /> {/* Replace with your BugHistory component */}
            </PrivateRoute>
          }
        />

        {/* developers assigned tasks.  */}
        <Route
          path="/single-project/:projectId/developer/:developerId/view-assigned-defects"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "qa_lead",
                "developer_lead",
                "developer",
              ]}
            >
              <DeveloperAssignedDefects />{" "}
            </PrivateRoute>
          }
        />

        {/* project manager dashboard..  */}
        <Route
          path="/project-manager-dashboard"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <ProjectManagerDashboard />
            </PrivateRoute>
          }
        />

        {/* developer lead dashboard.  */}
        <Route
          path="/developer-lead-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "developer_lead",
              ]}
            >
              <DeveloperLeadDashboard />{" "}
            </PrivateRoute>
          }
        />

        {/* requirment pages.  */}
        <Route
          path="/create-requirement/:projectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "developer_lead",
                "developer",
                "test_lead",
                "test_engineer",
              ]}
            >
              <CreateRequirement />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-requirements/:projectId"
          element={
            <PrivateRoute>
              <AllRequirements />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-requirements/:projectId/module/:moduleName"
          element={
            <PrivateRoute>
              <AllRequirements />
            </PrivateRoute>
          }
        />

        <Route
          path="/single-requirement/:id"
          element={
            <PrivateRoute>
              <SingleRequirement />
            </PrivateRoute>
          }
        />



        {/* event pages.  */}
        <Route
          path="/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-attendance"
          element={
            <PrivateRoute>
              <CreateAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/view-all-attendance"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <GetAllAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/get-single-attendance/:id"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <SingleAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-attendance/:id"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <EditAttendance />
            </PrivateRoute>
          }
        />

        {/* notification pages routes,   */}
        <Route
          path="/create-notification"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <CreateNotification />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-notifications"
          element={
            <PrivateRoute>
              <AllNotifications />
            </PrivateRoute>
          }
        />

          <Route
          path="/single-notification/:id"
          element={
            <PrivateRoute>
              <SingleNotification />
            </PrivateRoute>
          }
        />

          <Route
  path="/my-notifications"
  element={
    <PrivateRoute>
      <ViewAllMyNotification />
    </PrivateRoute>
  }
/>

          <Route
          path="/update-notification/:id"
          element={
            <PrivateRoute>
              <UpdateNotification/>
            </PrivateRoute>
          }
        />




        {/*selenium pages routes*/}
        <Route
          path="/attribute-batch-demo"
          element={
            <PrivateRoute>
              <AttributeBatchDemo/>
            </PrivateRoute>
          }
        />


         <Route
          path="/dom-batch-demo"
          element={
            <PrivateRoute>
              <DomBatchDemo/>
            </PrivateRoute>
          }
        />

         <Route
          path="/visibility-demo"
          element={
            <PrivateRoute>
              <VisibilityDemo/>
            </PrivateRoute>
          }
        />

          <Route
          path="/clickable-and-selcted-batch"
          element={
            <PrivateRoute>
              <ClickableAndSelectedBatch/>
            </PrivateRoute>
          }
        />
           <Route
          path="/frame-batchdemo"
          element={
            <PrivateRoute>
              <FrameBatchDemo/>
            </PrivateRoute>
          }
        />

         <Route
          path="/invisibility-batch-demo"
          element={
            <PrivateRoute>
              <InvisibilityBatchDemo/>
            </PrivateRoute>
          }
        />

          <Route
          path="/js-batch-demo"
          element={
            <PrivateRoute>
              <JsBatchDemo/>
            </PrivateRoute>
          }
        />

        <Route
          path="/number-of-elements-batch-demo"
          element={
            <PrivateRoute>
              <NumberOfElementsBatchDemo/>
            </PrivateRoute>
          }
        />

        
        <Route
          path="/presence-batch-demo"
          element={
            <PrivateRoute>
              <PresenceBatchDemo/>
            </PrivateRoute>
          }
        />

        
        <Route
          path="/text-batch-demo"
          element={
            <PrivateRoute>
              <TextBatchDemo/>
            </PrivateRoute>
          }
        />

        <Route
          path="/title-url-batch-demo"
          element={
            <PrivateRoute>
              <TitleUrlBatchDemo/>
            </PrivateRoute>
          }
        />

         <Route
          path="/frame-playground"
          element={
            <PrivateRoute>
              <FramePlayground/>
            </PrivateRoute>
          }
        />

        <Route
          path="/action-playground"
          element={
            <PrivateRoute>
              <ActionsPlayground/>
            </PrivateRoute>
          }
        />

          <Route
          path="/dropdown-playground"
          element={
            <PrivateRoute>
              <DropdownPlayground/>
            </PrivateRoute>
          }
        />

         <Route
          path="/alerts-playground"
          element={
            <PrivateRoute>
              <AlertsPlayground/>
            </PrivateRoute>
          }
        />

        
         <Route
          path="/js-executor-playground"
          element={
            <PrivateRoute>
              <JsExecutorPalyground/>
            </PrivateRoute>
          }
        />

        <Route
          path="/tabs-playground"
          element={
            <PrivateRoute>
              <TabsPlayground/>
            </PrivateRoute>
          }
        />

        <Route
          path="/table-playground"
          element={
            <PrivateRoute>
              <TablePlayground/>
            </PrivateRoute>
          }
        />

        <Route
          path="/calendar-playground"
          element={
            <PrivateRoute>
              <CalendarPlayground/>
            </PrivateRoute>
          }
        />

          <Route
          path="/dynamic-elements-playground"
          element={
            <PrivateRoute>
              <DynamicElementsPlayground/>
            </PrivateRoute>
          }
        />


        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <WorkWithUs />
      <NewsLetter />
      <Footer />
    </Router>
  );
}

export default App;
