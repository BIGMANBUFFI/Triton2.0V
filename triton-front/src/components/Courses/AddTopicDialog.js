import { Modal, Button, Group, TextInput, NativeSelect } from "@mantine/core";
import { useState, useEffect } from "react";
import { Courses, Topics } from "../api/agent";

export default function AddTopicDialog({
  addTopicDialog,
  setAddTopicDialog,
  setCourses,
}) {
  const defaultData = { name: "", description: "" };

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  const handleAddTopic = async () => {
    setLoading(true);
    var response = await Topics.addTopic(addTopicDialog.courseId, {
      ...data,
    }).catch((err) => {
      setLoading(false);
      return;
    });

    Courses.getCourses()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => {});

    closeDialog();
  };

  const closeDialog = () => {
    setData(defaultData);
    setLoading(false);
    setAddTopicDialog({ topics: [], opened: false });
  };

  return (
    <>
      <Modal
        opened={addTopicDialog.opened}
        onClose={closeDialog}
        title="Fill the information below!"
      >
        <TextInput
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.currentTarget.value })}
          required
          label="Name"
          description="Please enter the topic name"
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
          description="Please enter the topic description"
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
            onClick={handleAddTopic}
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
