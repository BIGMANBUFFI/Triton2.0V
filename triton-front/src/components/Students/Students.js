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
import { useEffect, useState } from "react";
import AddStudentDialog from "./AddStudentDialog";
import { Students as StudentsHelper, Teachers, Courses } from "../api/agent";
import { getInitialsFromName } from "../../utils/stringUtils";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";

export default function Students() {
  const [opened, setOpened] = useState(false);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ teacherId: "", courseId: "" });
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    StudentsHelper.getStudents()
      .then((res) => {
        setStudents(res);
      })
      .catch((err) => {});

    Teachers.getTeachers()
      .then((res) => {
        setTeachers(res);
      })
      .catch((err) => {});

    Courses.getCourses()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    StudentsHelper.getStudents(filters)
      .then((res) => {
        setStudents(res);
      })
      .catch((err) => {});
  }, [filters]);

  const handleAddStudent = () => {
    setOpened(true);
  };

  const getTeachersSelectList = () => {
    return teachers.map((teacher) => ({
      value: teacher?.id,
      label: teacher?.user?.fullName,
    }));
  };

  const getCoursesSelectList = () => {
    return courses.map((course) => ({
      value: course?.id,
      label: course?.name,
    }));
  };

  const rows = students.map((student) => (
    <tr key={student.id}>
      <td>
        <Group
          styles={() => ({
            root: {
              paddingLeft: "5px",
              paddingRight: "5px",
              marginRight: "50px",
            },
          })}
        >
          <Avatar color="cyan" radius="xl" size="md">
            {getInitialsFromName(student.user.fullName)}
          </Avatar>
          <Text size="md">{student.user.fullName}</Text>
        </Group>
      </td>
      <td>
        <Text size="md">{student.user.email}</Text>
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
          <AddStudentDialog
            opened={opened}
            setOpened={setOpened}
            setStudents={setStudents}
            filters={filters}
          />

          <Title order={2}>Students</Title>
          <Group>
            <NativeSelect
              value={filters.teacherId}
              onChange={(e) =>
                setFilters({ ...filters, teacherId: e.currentTarget.value })
              }
              data={getTeachersSelectList()}
              placeholder="Pick one"
              label="Select a teacher"
            />
            <NativeSelect
              value={filters.courseId}
              onChange={(e) =>
                setFilters({ ...filters, courseId: e.currentTarget.value })
              }
              data={getCoursesSelectList()}
              placeholder="Pick one"
              label="Select a course"
              styles={() => ({
                root: {
                  marginLeft: "20px",
                },
              })}
            />
            <Button
              onClick={handleAddStudent}
              styles={() => ({
                root: {
                  marginLeft: "20px",
                },
              })}
            >
              Add Student
            </Button>
          </Group>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
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
