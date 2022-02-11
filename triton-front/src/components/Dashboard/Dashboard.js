import { Group, Text } from "@mantine/core";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Courses from "../Courses/Courses";
import Students from "../Students/Students";
import Teachers from "../Teachers/Teachers";
import { useState } from "react";
import Enrollments from "../Enrrollments/Enrollments";
import Exams from "../Exams/Exams";

export default function Dashboard() {
  const [category, setCategory] = useState("Students");

  const renderCategory = () => {
    switch (category) {
      case "Students":
        return <Students />;
      case "Teachers":
        return <Teachers />;
      case "Courses":
        return <Courses />;
      case "Enrollments":
        return <Enrollments />;
      case "Exams":
        return <Exams />;
      default:
        return <Students />;
    }
  };

  return (
    <Group
      direction="column"
      styles={() => ({
        root: {
          width: "100vw",
          height: "100vh",
        },
      })}
    >
      <Header />
      <Group
        styles={() => ({
          root: {
            marginLeft: "20%",
          },
        })}
      >
        <Sidebar setCategory={setCategory} />
        {renderCategory()}
        {/* <Students /> */}

        {/* <Teachers /> */}
        {/* <Courses /> */}
      </Group>
    </Group>
  );
}
