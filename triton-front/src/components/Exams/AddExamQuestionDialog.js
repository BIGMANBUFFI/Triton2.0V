import {
  Modal,
  Button,
  Group,
  TextInput,
  NumberInput,
  Checkbox,
  Divider,
  List,
} from "@mantine/core";
import { useState } from "react";

export default function AddExamQuestionDialog({
  opened,
  setOpened,
  addQuestion,
}) {
  const [newAnswerInputOpen, setNewAnwerInputOpen] = useState(false);

  const questionDefaultData = { question: "", points: 0, answers: [] };
  const [question, setQuestion] = useState(questionDefaultData);

  const currentAnswerDefaultData = {
    answer: "",
    points: 0,
    isCorrect: false,
  };

  const [currentAnswer, setCurrentAnswer] = useState(currentAnswerDefaultData);

  const handleAddAnswer = () => {
    var newAnswers = [...question.answers];
    newAnswers.push(currentAnswer);

    setQuestion({ ...question, answers: newAnswers });
    setCurrentAnswer(currentAnswerDefaultData);
  };

  const handleAddQuestion = () => {
    addQuestion(question);
    clearState();
  };

  const clearState = () => {
    setQuestion(questionDefaultData);
    setCurrentAnswer(currentAnswerDefaultData);
    setNewAnwerInputOpen(false);
    setOpened(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Fill the information below!"
      >
        <Group>
          <TextInput
            value={question.question}
            onChange={(e) =>
              setQuestion({
                ...question,
                question: e.target.value,
              })
            }
            required
            label="Question"
            styles={() => ({
              root: {
                width: "100%",
                marginTop: "10px",
              },
            })}
          />
          <NumberInput
            value={question.points}
            onChange={(e) =>
              setQuestion({
                ...question,
                points: e,
              })
            }
            defaultValue={0}
            label="Points"
            placeholder="Points"
            required
            styles={() => ({
              root: {
                width: "100px",
              },
            })}
          />
        </Group>
        <List
          styles={() => ({
            root: {
              marginTop: "10px",
            },
          })}
        >
          {question.answers.map((answer) => (
            <List.Item>{`${answer.answer}, ${answer.points} points, ${
              answer.isCorrect ? "correct" : "not correct"
            }`}</List.Item>
          ))}
        </List>

        {newAnswerInputOpen && (
          <Group
            styles={() => ({
              root: {
                alignItems: "flex-end",
                width: "400px",
                backgroundColor: "#eaeaea",
                padding: "10px 20px",
                marginTop: "10px",
              },
            })}
          >
            <TextInput
              value={currentAnswer.answer}
              onChange={(e) =>
                setCurrentAnswer({
                  ...currentAnswer,
                  answer: e.currentTarget.value,
                })
              }
              required
              label="Answer"
              styles={() => ({
                root: {
                  width: "200px",
                },
              })}
            />
            <NumberInput
              value={currentAnswer.points}
              onChange={(e) =>
                setCurrentAnswer({
                  ...currentAnswer,
                  points: e,
                })
              }
              defaultValue={0}
              placeholder="Points"
              required
              styles={() => ({
                root: {
                  width: "70px",
                },
              })}
            />
            <Checkbox
              checked={currentAnswer.isCorrect}
              onChange={(e) =>
                setCurrentAnswer({
                  ...currentAnswer,
                  isCorrect: e.target.checked,
                })
              }
              styles={() => ({
                root: {
                  marginBottom: "7px",
                },
              })}
            ></Checkbox>

            {newAnswerInputOpen && (
              <Group>
                <Button size="xs" onClick={handleAddAnswer}>
                  Add
                </Button>
                <Button
                  size="xs"
                  onClick={() => setNewAnwerInputOpen(!newAnswerInputOpen)}
                >
                  Cancel
                </Button>
              </Group>
            )}
          </Group>
        )}

        {!newAnswerInputOpen && (
          <Button
            size="xs"
            onClick={() => setNewAnwerInputOpen(!newAnswerInputOpen)}
            styles={() => ({
              root: {
                marginTop: "15px",
              },
            })}
          >
            Add Answer
          </Button>
        )}

        <Group
          styles={() => ({
            root: {
              marginTop: "25px",
            },
          })}
        >
          <Button onClick={handleAddQuestion}>Finish</Button>
          <Button onClick={clearState}>Cancel</Button>
        </Group>
      </Modal>
    </>
  );
}
