import { Modal, Button, Group, TextInput, Text } from "@mantine/core";
import { Teachers } from "../api/agent";
import { useState } from "react";

export default function AddTeacherDialog({ opened, setOpened, setTeachers }) {
  const defaultData = { fullName: "", email: "" };
  const [data, setData] = useState(defaultData);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTeacher = async () => {
    setLoading(true);

    var response = await Teachers.addTeacher(data).catch((err) => {
      setLoading(false);
      return;
    });

    Teachers.getTeachers()
      .then((res) => {
        setTeachers(res);
      })
      .catch((err) => {});

    setPassword(response.password);
    setLoading(false);
    setOpened(false);
    setData(defaultData);
  };

  const closeDialog = () => {
    setData(defaultData);
    setPassword("");
    setLoading(false);
    setOpened(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeDialog}
        title="Fill the information below!"
      >
        {password !== "" && (
          <Text>
            Password for inserted teacher is:
            <Text
              styles={() => ({
                root: {
                  fontWeight: "bold",
                },
              })}
            >
              {password}
            </Text>
          </Text>
        )}

        {password === "" && (
          <>
            <TextInput
              value={data.fullName}
              onChange={(e) =>
                setData({ ...data, fullName: e.currentTarget.value })
              }
              required
              label="Full Name"
              description="Please enter the teacher full name"
              styles={() => ({
                root: {
                  width: "300px",
                  marginTop: "10px",
                },
              })}
            />
            <TextInput
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.currentTarget.value })
              }
              required
              label="Email"
              description="Please enter the teacher email"
              styles={() => ({
                root: {
                  width: "300px",
                  marginTop: "10px",
                },
              })}
            />
            <Group
              position="right"
              styles={() => ({
                root: {
                  width: "300px",
                  marginTop: "20px",
                },
              })}
            >
              <Button
                loading={loading}
                onClick={handleAddTeacher}
                styles={() => ({
                  root: {
                    width: "100%",
                  },
                })}
              >
                Submit
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </>
  );
}
