import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddExam from "./components/Exams/AddExam";
import PrivateRoute from "./components/shared/PrivateRoute";
import Students from "./components/Students/Students";
import Teachers from "./components/Teachers/Teachers";
import Courses from "./components/Courses/Courses";
import Enrollments from "./components/Enrrollments/Enrollments";
import Exams from "./components/Exams/Exams";
import StartExam from "./components/Exams/StartExam";
import ExamDetails from "./components/Exams/ExamDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} exact />
          <Route
            exact
            path="/"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/teachers"
            element={
              <PrivateRoute>
                <Teachers />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/courses"
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/enrollments"
            element={
              <PrivateRoute>
                <Enrollments />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/exams"
            element={
              <PrivateRoute>
                <Exams />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/exams/:id/start"
            element={
              <PrivateRoute>
                <StartExam />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/exams/:id"
            element={
              <PrivateRoute>
                <ExamDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/exams/create"
            element={
              <PrivateRoute>
                <AddExam />
              </PrivateRoute>
            }
            exact
          />
          <Route path="/" render={() => <h1>Not found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
