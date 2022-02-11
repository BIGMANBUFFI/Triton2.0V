import { Group, Table, Title, Avatar, Text, Menu, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import AddTeacherDialog from "./AddTeacherDialog";
import { Teachers as TeachersHelper } from "../api/agent";
import { getInitialsFromName } from "../../utils/stringUtils";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";

export default function Teachers() {
  const [opened, setOpened] = useState(false);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    TeachersHelper.getTeachers()
      .then((res) => {
        setTeachers(res);
      })
      .catch((err) => {});
  }, []);

  const handleAddTeacher = (e) => {
    setOpened(true);
  };

  const rows = teachers.map((teacher) => (
    <tr key={teacher.id} style={{ textAlign: "center" }}>
      <td style={{ textAlign: "center" }}>
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
            {getInitialsFromName(teacher.fullName)}
          </Avatar>
          <Text size="md">{teacher.fullName}</Text>
        </Group>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Text size="md">{teacher.email}</Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Text size="md">{teacher.coursesCount}</Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Text size="md">{teacher.examsCount}</Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
        <Text size="md">{teacher.studentsCount}</Text>
      </td>
      <td
        style={{
          paddingRight: "50px",
        }}
      >
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
          <AddTeacherDialog
            opened={opened}
            setOpened={setOpened}
            setTeachers={setTeachers}
          />
          <Title order={2}>Teachers</Title>
          <Group
            styles={() => ({
              root: {
                alignItems: "flex-end",
              },
            })}
          >
            <Button
              onClick={handleAddTeacher}
              styles={() => ({
                root: {
                  marginLeft: "20px",
                },
              })}
            >
              Add Teacher
            </Button>
          </Group>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Students</th>
                <th>Courses</th>
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
