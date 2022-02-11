import { useState, useEffect } from "react";
import {
  Group,
  Text,
  Title,
  NumberInput,
  NativeSelect,
  Button,
  Collapse,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import AddExamQuestionDialog from "./AddExamQuestionDialog";
import { Courses, Exams } from "../api/agent";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";

export default function AddExam() {
  const [questionCollapse, setQuestionCollapse] = useState({});
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Courses.getCourses()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => {});
  }, []);

  const examDefaults = {
    startDate: "",
    startTime: "",
    duration: 0,
    pointsToPass: 0,
    courseId: "",
    questions: [],
  };

  var [exam, setExam] = useState(examDefaults);

  const addQuestion = (question) => {
    var questions = [...exam.questions];
    questions.push(question);

    setExam({ ...exam, questions });
  };

  const handleQuestionTextClick = (question) => {
    if (questionCollapse[question.question]) {
      setQuestionCollapse((oqc) => {
        return {
          ...oqc,
          [question.question]: !oqc[question.question],
        };
      });
    } else {
      setQuestionCollapse((oqc) => {
        return {
          ...oqc,
          [question.question]: !oqc[question.question] || true,
        };
      });
    }
  };

  const handleAddExam = async () => {
    const examToAdd = {
      ...exam,
      startTime: moment(exam.startDate)
        .add(moment(exam.startTime).format("HH:mm"), "hours")
        .format(),
    };

    examToAdd.questions.forEach((question) => {
      const correctAnswers = question.answers.filter(
        (answer) => answer.isCorrect
      );

      if (correctAnswers.length > 1) {
        question.type = 2;
      } else {
        question.type = 1;
      }
    });

    setLoading(true);
    await Exams.addExam(exam)
      .then((res) => {
        setLoading(false);
        navigate("/exams");
      })
      .catch((err) => {
        setLoading(false);
        return;
      });
  };

  const getCoursesSelectList = () => {
    return courses.map((course) => ({
      value: course?.id,
      label: course?.name,
    }));
  };

  return (
    <Group
      direction="column"
      styles={() => ({
        root: {
          overflow: "auto",
        },
      })}
    >
      <AddExamQuestionDialog
        opened={newQuestionDialogOpen}
        setOpened={setNewQuestionDialogOpen}
        questions={exam.questions}
        addQuestion={addQuestion}
      />

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
        <Group
          direction="column"
          styles={() => ({
            root: {
              overflow: "auto",
            },
          })}
        >
          <Title>Create Exam</Title>
          <Text>Fill the information below to create an exam</Text>
          <DatePicker
            value={exam.startDate}
            onChange={(e) => setExam({ ...exam, startDate: e })}
            placeholder="Pick date"
            label="Start date"
            required
            styles={() => ({
              root: {
                width: "200px",
                marginTop: "20px",
              },
            })}
          />
          <TimeInput
            value={exam.startTime}
            onChange={(e) => setExam({ ...exam, startTime: e })}
            placeholder="Pick time"
            label="Start time"
            required
            styles={() => ({
              root: {
                width: "200px",
              },
            })}
          />
          <NumberInput
            value={exam.duration}
            onChange={(e) => setExam({ ...exam, duration: e })}
            defaultValue={30}
            placeholder="Duration"
            label="Duration(in minutes)"
            required
          />
          <NumberInput
            value={exam.pointsToPass}
            onChange={(e) => setExam({ ...exam, pointsToPass: e })}
            defaultValue={30}
            placeholder="Points"
            label="Points to pass"
            required
            styles={() => ({
              root: {
                width: "200px",
              },
            })}
          />
          <NativeSelect
            value={exam.courseId}
            onChange={(e) =>
              setExam({ ...exam, courseId: e.currentTarget.value })
            }
            data={getCoursesSelectList()}
            placeholder="Pick one"
            label="Select a course"
            styles={() => ({
              root: {
                width: "200px",
              },
            })}
          />

          <Group
            direction="column"
            styles={() => ({
              root: {
                marginTop: "25px",
              },
            })}
          >
            <Title order={3}>Questions</Title>
            {exam.questions.map((question) => (
              <Group
                direction="column"
                styles={() => ({
                  root: {
                    backgroundColor: "white",
                    border: "1px solid lightgray",
                    padding: "10px 20px",
                  },
                })}
              >
                <Text onClick={() => handleQuestionTextClick(question)}>
                  {question.question}
                </Text>
                <Collapse in={questionCollapse[question.question] || false}>
                  <Group>
                    <Text>Description:</Text>
                    <Text>{question.description}</Text>
                  </Group>
                  <Group>
                    <Text>Points:</Text>
                    <Text>{question.points}</Text>
                  </Group>
                  <Group>
                    <Text>Question type:</Text>
                    <Text>
                      {question.type === 1
                        ? "Single Answer"
                        : "Multiple Answers"}
                    </Text>
                  </Group>
                  <Group
                    direction="column"
                    styles={() => ({
                      root: {
                        marginTop: "20px",
                      },
                    })}
                  >
                    <Text
                      styles={() => ({
                        root: {
                          fontWeight: "bold",
                        },
                      })}
                    >
                      Answers:
                    </Text>
                    <Text>
                      {question.type === 1 && (
                        <RadioGroup size="sm" variant="vertical" readOnly>
                          {question.answers.map((answer) => (
                            <Radio
                              checked={answer.isCorrect}
                              value={answer.answer}
                              readOnly
                            >
                              {answer.answer}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )}
                      {question.type === 2 && (
                        <Group direction="column">
                          {question.answers.map((answer) => (
                            <Checkbox
                              checked={answer.isCorrect}
                              label={answer.answer}
                              readOnly
                            />
                          ))}
                        </Group>
                      )}
                    </Text>
                  </Group>
                </Collapse>
              </Group>
            ))}

            <Button onClick={() => setNewQuestionDialogOpen(true)}>
              Add Question
            </Button>

            <Button
              loading={loading}
              onClick={handleAddExam}
              styles={() => ({
                root: {
                  marginTop: "15px",
                },
              })}
            >
              Add Exam
            </Button>
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
