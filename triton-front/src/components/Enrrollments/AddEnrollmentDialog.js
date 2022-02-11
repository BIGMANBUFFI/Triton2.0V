import { Modal, Button, Group, TextInput, NativeSelect } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { Enrollments } from "../api/agent";

export default function AddEnrollmentDialog({
  opened,
  setOpened,
  setEnrollments,
  courses,
}) {
  const defaultData = { name: "", value: "", expiresAt: "", courseId: "" };

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  const handleAddEnrollment = async () => {
    setLoading(true);
    await Enrollments.addEnrollment(data).catch((err) => {
      setLoading(false);
      return;
    });

    setLoading(false);

    Enrollments.getEnrollments()
      .then((res) => {
        setEnrollments(res);
      })
      .catch((err) => {});

    closeDialog();
  };

  const closeDialog = () => {
    setData(defaultData);
    setLoading(false);
    setOpened(false);
  };

  const getCoursesSelectList = () => {
    return courses.map((course) => ({
      value: course?.id,
      label: course?.name,
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
          name={data.name}
          onChange={(e) => setData({ ...data, name: e.currentTarget.value })}
          required
          label="Name"
          description="Please enter the enrollment name"
          styles={() => ({
            root: {
              width: "300px",
              marginTop: "10px",
            },
          })}
        />
        <TextInput
          name={data.value}
          onChange={(e) => setData({ ...data, value: e.currentTarget.value })}
          required
          label="Value"
          description="Please enter the enrollment value (this is the value students will use to enroll)"
          styles={() => ({
            root: {
              width: "300px",
              marginTop: "10px",
            },
          })}
        />
        <NativeSelect
          name={data.courseId}
          onChange={(e) =>
            setData({ ...data, courseId: e.currentTarget.value })
          }
          data={getCoursesSelectList()}
          placeholder="Pick one"
          label="Select a course"
          styles={() => ({
            root: {
              width: "300px",
              marginTop: "10px",
            },
          })}
        />
        <DatePicker
          name={data.expiresAt}
          onChange={(e) => setData({ ...data, expiresAt: e })}
          placeholder="Pick date"
          label="Please select an expiration date"
          required
          styles={() => ({
            root: {
              width: "300px",
              marginTop: "20px",
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
            onClick={handleAddEnrollment}
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
