import { Group, Table, Title, Text, Menu, Button } from "@mantine/core";
import moment from "moment";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Exams as ExamsHelper } from "../api/agent";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";

export default function Exams() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    ExamsHelper.getExams()
      .then((res) => {
        setExams(res);
      })
      .catch((err) => {});
  }, []);

  const navigate = useNavigate();

  const navigateToAddExam = () => {
    navigate("/exams/create");
  };

  const navigateToStartExam = (id) => {
    navigate(`/exams/${id}/start`);
  };

  const navigateToViewExam = (id) => {
    navigate(`/exams/${id}`);
  };

  const rows = exams.map((exam) => (
    <tr key={exam.id}>
      <td>
        <Text size="md">{exam.course.name}</Text>
      </td>
      <td>
        <Text size="md">{new Date(exam.startTime).toLocaleDateString()}</Text>
      </td>
      <td>
        <Text size="md">{new Date(exam.endTime).toLocaleDateString()}</Text>
      </td>
      <td>
        <Text size="md">{exam.questionCount}</Text>
      </td>
      <td>
        <Menu>
          <Menu.Item onClick={() => navigateToStartExam(exam.id)}>
            Start
          </Menu.Item>
          <Menu.Item onClick={() => navigateToViewExam(exam.id)}>
            View
          </Menu.Item>
          <Menu.Item>Delete</Menu.Item>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <Group
      direction="column"
      styles={() => ({
        root: {
          overflow: "auto",
        },
      })}
    >
      <Header />
      <Group
        styles={() => ({
          root: {
            marginLeft: "20%",
            overflow: "auto",
          },
        })}
      >
        <Sidebar />
        <Group direction="column">
          <Group direction="column">
            <Title order={2}>Exams</Title>
            <Button onClick={navigateToAddExam}>Add Exam</Button>
            <Table
              styles={() => ({
                root: {
                  marginTop: "20px",
                },
              })}
            >
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Start time</th>
                  <th>End time</th>
                  <th>Questions</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
