import { Modal, Button, Group, TextInput, Text } from "@mantine/core";
import { useState } from "react";
import { Students } from "../api/agent";

export default function AddStudentDialog({
  opened,
  setOpened,
  setStudents,
  filters,
}) {
  const defaultData = { fullName: "", email: "" };

  const [data, setData] = useState(defaultData);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleAddStudent = async () => {
    setLoading(true);
    var response = await Students.addStudent(data).catch((err) => {
      setLoading(false);
      return;
    });

    Students.getStudents(filters)
      .then((res) => {
        setStudents(res);
      })
      .catch((err) => {});

    setPassword(response.password);
    setLoading(false);
    setData(defaultData);
    setOpened(false);
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
            Password for inserted user is:
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
              name="fullName"
              value={data.fullName}
              onChange={handleInputChange}
              required
              label="Full Name"
              description="Please enter the student full name"
              styles={() => ({
                root: {
                  width: "300px",
                  marginTop: "10px",
                },
              })}
            />
            <TextInput
              name="email"
              value={data.email}
              onChange={handleInputChange}
              required
              label="Email"
              description="Please enter the student email"
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
                onClick={handleAddStudent}
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
