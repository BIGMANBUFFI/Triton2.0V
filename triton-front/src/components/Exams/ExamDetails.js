import { useState, useEffect } from "react";
import {
  Group,
  Text,
  Title,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  Table,
} from "@mantine/core";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import AddExamQuestionDialog from "./AddExamQuestionDialog";
import { Courses, Exams } from "../api/agent";
import { useParams } from "react-router-dom";
import moment from "moment";

export default function ExamDetails() {
  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    Exams.getExam(id)
      .then((res) => {
        setExam(res);
      })
      .catch((err) => {});

    Exams.getExamSumbissions(id)
      .then((res) => {
        setSubmissions(res);
      })
      .catch((err) => {});
  }, []);

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
        {exam && (
          <Group
            direction="column"
            styles={() => ({
              root: {
                overflow: "auto",
              },
            })}
          >
            <Title>Exam details</Title>
            <Group>
              <Text>Start time: </Text>
              <Text>{exam.startTime}</Text>
            </Group>
            <Group>
              <Text>Duration: </Text>
              <Text>{exam.endTime}</Text>
            </Group>
            <Group>
              <Text>Points to pass: </Text>
              <Text>{exam.pointsToPass}</Text>
            </Group>
            <Group>
              <Text>Course: </Text>
              <Text>{exam.course.name}</Text>
            </Group>
            <Group
              direction="column"
              styles={() => ({
                root: {
                  marginTop: "25px",
                },
              })}
            >
              <Title>Submissions</Title>
              <Table
                styles={() => ({
                  root: {
                    marginTop: "20px",
                  },
                })}
              >
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Submission date</th>
                    <th>Points</th>
                    <th>Passed</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>
                        <Text size="md">
                          {submission.student.user.fullName}
                        </Text>
                      </td>
                      <td>
                        <Text size="md">{submission.submittedAt}</Text>
                      </td>
                      <td>
                        <Text size="md">{submission.points}</Text>
                      </td>
                      <td>
                        <Text size="md">
                          {submission.passed ? "Yes" : "No"}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Group>
          </Group>
        )}
      </Group>
    </Group>
  );
}
