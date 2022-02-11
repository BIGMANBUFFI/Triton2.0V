import { useState, useEffect } from "react";
import {
  Group,
  Text,
  Title,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mantine/core";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import AddExamQuestionDialog from "./AddExamQuestionDialog";
import { Courses, Exams } from "../api/agent";
import { useParams, useNavigate } from "react-router-dom";

export default function StartExam() {
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Exams.getExam(id)
      .then((res) => {
        const newQuestions = res.questions.map((question) => {
          const newAnswers = question.answers.map((answer) => {
            answer.isCorrect = false;
            return answer;
          });

          question.answers = newAnswers;

          return question;
        });

        setExam({ ...res, questions: newQuestions });
      })
      .catch((err) => {});
  }, []);

  const handleAnswerRadioChange = (question, e) => {
    var newQuestions = [...exam.questions];
    newQuestions
      .find((q) => q.id === question.id)
      .answers.forEach((a) => {
        a.isCorrect = a.id === e ? true : false;
        return a;
      });

    setExam({ ...exam, questions: newQuestions });
  };

  const handleAnswerCheckboxChange = (question, e) => {
    var newQuestions = [...exam.questions];
    newQuestions
      .find((q) => q.id === question.id)
      .answers.find((a) => a.id === e).isCorrect = true;

    setExam({ ...exam, questions: newQuestions });
  };

  const handleSubmitExam = async () => {
    setLoading(true);
    Exams.submitExam(id, exam)
      .then((res) => {
        setLoading(false);
        navigate(`/exams/${id}`);
      })
      .catch((err) => {
        setLoading(false);
        navigate(`/exams/${id}`);
        return;
      });
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
        {exam && (
          <Group
            direction="column"
            styles={() => ({
              root: {
                overflow: "auto",
              },
            })}
          >
            <Title>Start Exam</Title>
            <Text>Answer the questions below</Text>
            <Group>
              <Text>Start time: </Text>
              <Text>{exam.startTime}</Text>
            </Group>
            <Group>
              <Text>Duration: </Text>
              <Text>{exam.endTime}</Text>
            </Group>
            <Group>
              <Text>Points to pass: </Text>
              <Text>{exam.pointsToPass}</Text>
            </Group>
            <Group>
              <Text>Course: </Text>
              <Text>{exam.course.name}</Text>
            </Group>
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
                      width: "600px",
                      backgroundColor: "white",
                      border: "1px solid lightgray",
                      padding: "10px 20px",
                    },
                  })}
                >
                  <Group direction="column">
                    <Group
                      styles={() => ({
                        root: {
                          width: "100%",
                          justifyContent: "space-between",
                        },
                      })}
                    >
                      <Text>{`P-${question.points} : `}</Text>
                      <Text>{question.question}</Text>
                    </Group>
                    <Text>
                      {question.type === 1 && (
                        <RadioGroup
                          size="sm"
                          variant="vertical"
                          readOnly
                          onChange={(e) => handleAnswerRadioChange(question, e)}
                          value={
                            exam.questions
                              .find((q) => q.id === question.id)
                              .answers.find((a) => a.isCorrect)?.id
                          }
                        >
                          {question.answers.map((answer) => (
                            <Radio value={answer.id}>{answer.answer}</Radio>
                          ))}
                        </RadioGroup>
                      )}
                      {question.type === 2 && (
                        <Group direction="column">
                          {question.answers.map((answer) => (
                            <Checkbox
                              value={answer.id}
                              label={answer.answer}
                              onChange={(e) =>
                                handleAnswerCheckboxChange(
                                  question,
                                  e.currentTarget.value
                                )
                              }
                            />
                          ))}
                        </Group>
                      )}
                    </Text>
                  </Group>
                </Group>
              ))}
              <Button
                loading={loading}
                onClick={handleSubmitExam}
                styles={() => ({
                  root: {
                    marginTop: "15px",
                  },
                })}
              >
                Submit Exam
              </Button>
            </Group>
          </Group>
        )}
      </Group>
    </Group>
  );
}
