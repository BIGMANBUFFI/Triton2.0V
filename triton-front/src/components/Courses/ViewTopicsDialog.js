import { Modal, List } from "@mantine/core";
import { useState, useEffect } from "react";
import { Topics } from "../api/agent";

export default function ViewTopicsDialog({
  viewTopicsDialog,
  setViewTopicsDialog,
}) {
  console.log(viewTopicsDialog);
  return (
    <>
      <Modal
        opened={viewTopicsDialog.opened}
        onClose={() => setViewTopicsDialog({ topics: [], opened: false })}
        title="Topics"
      >
        <List>
          {viewTopicsDialog?.topics?.map((topic) => (
            <List.Item>{topic?.name}</List.Item>
          ))}
        </List>
      </Modal>
    </>
  );
}
