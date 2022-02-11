import axios from "axios";
import { toast } from "react-toastify";

export const BASE_URL = "https://localhost:5001/api";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("triton_token");

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    const message = Object.values(error.response.data).reduce(
      (prev, curr) => (prev += curr.join(""))
    );

    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    return Promise.reject(error);
  }
);

const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/account/login`, {
    email: data.email,
    password: data.password,
  });

  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${BASE_URL}/account/logout`);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await axios.get(`${BASE_URL}/account/currentUser`);
  return response.data;
};

export const Account = {
  login,
  logout,
  getCurrentUser,
};

const getStudents = async (filters) => {
  filters = {
    teacherId: filters?.teacherId || "",
    courseId: filters?.courseId || "",
  };

  const response = await axios.get(
    `${BASE_URL}/student?teacherId=${filters.teacherId}&courseId=${filters.courseId}`
  );
  return response.data;
};

const addStudent = async (data) => {
  const response = await axios.post(`${BASE_URL}/student`, {
    fullName: data.fullName,
    email: data.email,
  });

  return response.data;
};

export const Students = {
  getStudents,
  addStudent,
};

const getTeachers = async () => {
  const response = await axios.get(`${BASE_URL}/teacher`);
  return response.data;
};

const addTeacher = async (data) => {
  const response = await axios.post(`${BASE_URL}/teacher`, {
    fullName: data.fullName,
    email: data.email,
  });

  return response.data;
};

export const Teachers = {
  getTeachers,
  addTeacher,
};

const getCourses = async () => {
  const response = await axios.get(`${BASE_URL}/course`);
  return response.data;
};

const addCourse = async (data) => {
  const response = await axios.post(`${BASE_URL}/course`, {
    name: data.name,
    description: data.description,
    teacherId: data.teacherId,
  });

  return response.data;
};

export const Courses = {
  getCourses,
  addCourse,
};

const getTopics = async (courseId) => {
  const response = await axios.get(`${BASE_URL}/course/${courseId}/topic`);
  return response.data;
};

const addTopic = async (courseId, data) => {
  const response = await axios.post(`${BASE_URL}/course/${courseId}/topic`, {
    courseId,
    name: data.name,
    description: data.description,
  });

  return response.data;
};

export const Topics = {
  getTopics,
  addTopic,
};

const getEnrollments = async () => {
  const response = await axios.get(`${BASE_URL}/enrollment`);
  return response.data;
};

const addEnrollment = async (data) => {
  const response = await axios.post(`${BASE_URL}/enrollment`, {
    name: data.name,
    value: data.value,
    expiresAt: data.expiresAt,
    courseId: data.courseId,
  });

  return response.data;
};

export const Enrollments = {
  getEnrollments,
  addEnrollment,
};

const getExams = async () => {
  const response = await axios.get(`${BASE_URL}/exam`);
  return response.data;
};

const getExam = async (examId) => {
  const response = await axios.get(`${BASE_URL}/exam/${examId}`);
  return response.data;
};

const addExam = async (data) => {
  const response = await axios.post(`${BASE_URL}/exam`, {
    courseId: data.courseId,
    startTime: data.startTime,
    duration: data.duration,
    pointsToPass: data.pointsToPass,
    questions: data.questions,
  });

  return response.data;
};

const getExamSumbissions = async (examId) => {
  const response = await axios.get(`${BASE_URL}/exam/${examId}/submission`);
  return response.data;
};

const submitExam = async (examId, data) => {
  // questions: [questionsId: answers: []]
  const questions = data.questions.map((q) => {
    const answers = [];
    if (q.type === 1) {
      const correctAnswer = q.answers.find((a) => a.isCorrect);
      answers.push({ answerId: correctAnswer.id });
    } else {
      const answersList = q.answers.filter((a) => a.isCorrect);
      answersList.forEach((a) => answers.push({ answerId: a.id }));
    }

    q.answers = answers;
    q.questionId = q.id;
    return q;
  });

  console.log("Questions", questions);

  const response = await axios.post(`${BASE_URL}/exam/${examId}/submission`, {
    questions,
  });

  return response.data;
};

export const Exams = {
  getExams,
  getExam,
  addExam,
  getExamSumbissions,
  submitExam,
};
