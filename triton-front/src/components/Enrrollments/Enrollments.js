import { Group, Table, Title, Text, Menu, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import AddEnrollmentDialog from "./AddEnrollmentDialog";
import { Courses, Enrollments as EnrollmentsHelper } from "../api/agent";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";

export default function Enrollments() {
  const [opened, setOpened] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    EnrollmentsHelper.getEnrollments()
      .then((res) => {
        setEnrollments(res);
      })
      .catch((err) => {});

    Courses.getCourses()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => {});
  }, []);

  const handleAddEnrollment = (e) => {
    setOpened(true);
  };

  const rows = enrollments.map((enrollment) => (
    <tr key={enrollment.id}>
      <td>
        <Text size="md">{enrollment.name}</Text>
      </td>
      <td>
        <Text size="md">{enrollment.value}</Text>
      </td>
      <td>
        <Text size="md">{enrollment.course.name}</Text>
      </td>
      <td>
        <Text size="md">{enrollment.expiresAt}</Text>
      </td>
      <td>
        <Menu>
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
          <AddEnrollmentDialog
            opened={opened}
            setOpened={setOpened}
            courses={courses}
            setEnrollments={setEnrollments}
          />
          <Title order={2}>Enrollments</Title>
          <Group>
            <Button
              onClick={handleAddEnrollment}
              styles={() => ({
                root: {
                  marginLeft: "20px",
                },
              })}
            >
              Add Enrollment
            </Button>
          </Group>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Course</th>
                <th>ExpiresAt</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Group>
      </Group>
    </Group>
  );
}
