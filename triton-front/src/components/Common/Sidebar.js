import { Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { Anchor } from "@mantine/core";

export default function Sidebar() {
  return (
    <Group
      direction="column"
      position="center"
      styles={() => ({
        root: {
          width: "15%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          boxShadow: "2px 0px 10px #b0b0b0",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        },
      })}
    >
      <Anchor component={Link} to="/students" variant="text">
        <Text>Students</Text>
      </Anchor>
      <Anchor component={Link} to="/teachers" variant="text">
        <Text>Teachers</Text>
      </Anchor>
      <Anchor component={Link} to="/courses" variant="text">
        <Text>Courses</Text>
      </Anchor>
      <Anchor component={Link} to="/enrollments" variant="text">
        <Text>Enrollments</Text>
      </Anchor>
      <Anchor component={Link} to="/exams" variant="text">
        <Text>Exams</Text>
      </Anchor>
    </Group>
  );
}
