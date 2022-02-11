import {
  Group,
  Table,
  Title,
  Avatar,
  Text,
  NativeSelect,
  Menu,
  Button,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { Teachers, Courses as CoursesHelper, Students } from "../api/agent";
import AddCourseDialog from "./AddCourseDialog";
import AddTopicDialog from "./AddTopicDialog";
import ViewTopicsDialog from "./ViewTopicsDialog";
import { getInitialsFromName } from "../../utils/stringUtils";
import ViewStudentsDialog from "./ViewStudentsDialog";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";

export default function Courses() {
  const [opened, setOpened] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  var addTopicsDefaultData = { courseId: "", opened: false };
  const [addTopicDialog, setAddTopicDialog] = useState(addTopicsDefaultData);

  var viewTopicsDefaultData = { topics: [], opened: false };
  const [viewTopicsDialog, setViewTopicsDialog] = useState(
    viewTopicsDefaultData
  );

  var viewStudentsDefaultData = { courseId: "", opened: false };
  const [viewStudentsDialog, setViewStudentsDialog] = useState(
    viewStudentsDefaultData
  );

  useEffect(() => {
    CoursesHelper.getCourses()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => {});

    Teachers.getTeachers()
      .then((res) => {
        setTeachers(res);
      })
      .catch((err) => {});
  }, []);

  const handleAddCourse = (e) => {
    setOpened(true);
  };

  const rows = courses.map((course) => (
    <tr key={course.id} style={{ textAlign: "center" }}>
      <td style={{ textAlign: "center" }}>
        <Text size="md">{course.name}</Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Group>
          <Avatar color="cyan" radius="xl" size="md">
            {getInitialsFromName(course?.teacher?.user?.fullName)}
          </Avatar>
          <Text>{course?.teacher?.user?.fullName}</Text>
        </Group>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Text
          size="md"
          onClick={() =>
            setViewTopicsDialog({ topics: course.topics, opened: true })
          }
          style={{
            textDecoration: "underline",
          }}
        >
          View Topics
        </Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Text
          onClick={() =>
            setViewStudentsDialog({ courseId: course.id, opened: true })
          }
          size="md"
          style={{
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {course.studentsCount}
        </Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Text size="md">{course.examsCount}</Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Menu>
          <Menu.Item>Delete</Menu.Item>
          <Menu.Item
            onClick={() =>
              setAddTopicDialog({ courseId: course.id, opened: true })
            }
          >
            Add Topic
          </Menu.Item>
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
          <AddCourseDialog
            opened={opened}
            setOpened={setOpened}
            setCourses={setCourses}
            teachers={teachers}
          />
          <AddTopicDialog
            addTopicDialog={addTopicDialog}
            setAddTopicDialog={setAddTopicDialog}
            setCourses={setCourses}
          />
          <ViewTopicsDialog
            viewTopicsDialog={viewTopicsDialog}
            setViewTopicsDialog={setViewTopicsDialog}
          />
          <ViewStudentsDialog
            viewStudentsDialog={viewStudentsDialog}
            setViewStudentsDialog={setViewStudentsDialog}
          />

          <Title order={2}>Courses</Title>
          <Group
            styles={() => ({
              root: {
                alignItems: "flex-end",
              },
            })}
          >
            <Button
              onClick={handleAddCourse}
              styles={() => ({
                root: {
                  marginLeft: "20px",
                },
              })}
            >
              Add Course
            </Button>
          </Group>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Teacher</th>
                <th>Topics</th>
                <th>Students</th>
                <th>Exams</th>
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
