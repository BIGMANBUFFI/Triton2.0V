import { Modal, Button, Group, TextInput, NativeSelect } from "@mantine/core";
import { useState } from "react";
import { Courses } from "../api/agent";

export default function AddCourseDialog({
  opened,
  setOpened,
  setCourses,
  teachers,
}) {
  const defaultData = { name: "", description: "", teacherId: "" };

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  const handleAddCourse = async () => {
    setLoading(true);
    var response = await Courses.addCourse(data).catch((err) => {
      setLoading(false);
      return;
    });

    Courses.getCourses()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => {});

      closeDialog()
  };

  const closeDialog = () => {
    setData(defaultData);
    setLoading(false);
    setOpened(false);
  };

  const getTeachersSelectList = () => {
    return teachers.map((teacher) => ({
      value: teacher?.id,
      label: teacher?.fullName,
    }));
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeDialog}
        title="Fill the information below!"
      >
        <TextInput
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.currentTarget.value })}
          required
          label="Name"
          description="Please enter the course name"
          styles={() => ({
            root: {
              width: "300px",
              marginTop: "10px",
            },
          })}
        />
        <TextInput
          value={data.description}
          onChange={(e) =>
            setData({ ...data, description: e.currentTarget.value })
          }
          required
          label="Description"
          description="Please enter the course description"
          styles={() => ({
            root: {
              width: "300px",
              marginTop: "10px",
            },
          })}
        />
        <NativeSelect
          value={data.teacherId}
          onChange={(e) =>
            setData({ ...data, teacherId: e.currentTarget.value })
          }
          data={getTeachersSelectList()}
          placeholder="Pick one"
          label="Select a teacher"
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
            onClick={handleAddCourse}
            styles={() => ({
              root: {
                width: "100%",
              },
            })}
          >
            Submit
          </Button>
        </Group>
      </Modal>
    </>
  );
}
