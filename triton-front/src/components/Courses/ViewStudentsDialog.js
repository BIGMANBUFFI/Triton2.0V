import { Modal, Avatar, List, Text, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { getInitialsFromName } from "../../utils/stringUtils";
import { Students } from "../api/agent";

export default function ViewStudentsDialog({
  viewStudentsDialog,
  setViewStudentsDialog,
}) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    Students.getStudents({ courseId: viewStudentsDialog.courseId })
      .then((res) => {
        setStudents(res);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Modal
        opened={viewStudentsDialog.opened}
        onClose={() => setViewStudentsDialog({ courseId: "", opened: false })}
        title="Fill the information below!"
      >
        {students.map((student) => (
          <Group
            styles={() => ({
              root: {
                backgroundColor: "#fafafa",
                padding: "5px 10px",
                marginTop: "10px",
              },
            })}
          >
            <Avatar color="cyan" radius="xl" size="md">
              {getInitialsFromName(student?.user?.fullName)}
            </Avatar>
            <Text size="md">{student?.user?.fullName}</Text>
          </Group>
        ))}
      </Modal>
    </>
  );
}
