import {
  Group,
  TextInput,
  Title,
  Text,
  Image,
  PasswordInput,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { Account } from "../api/agent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  var navigate = useNavigate();

  const handleLogin = async () => {
    var res = await Account.login(data);
    localStorage.setItem("triton_token", res.token);

    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("triton_token");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.currentTarget.name]: e.currentTarget.value });
  };

  return (
    <Group sx={{ width: "80vw", height: "80vh" }} direction="column">
      <Group position="left">
        <Text
          styles={() => ({
            root: {
              fontSize: "3em",
              fontWeight: "bold",
              color: "#659DBD",
              marginLeft: "20px",
            },
          })}
        >
          Triton
        </Text>
      </Group>

      <Group
        position="center"
        align="center"
        styles={() => ({
          root: {
            width: "100%",
            height: "100%",
          },
        })}
      >
        <Image
          src="https://i.ibb.co/jDsshks/kindpng-1800237.png"
          styles={() => ({
            root: {
              width: "500px",
            },
          })}
        />
        <Group
          direction="column"
          width="40%"
          height="50%"
          styles={() => ({
            root: {
              marginLeft: "50px",
            },
          })}
        >
          <Title order={1}>Login</Title>
          <TextInput
            value={data.email}
            onChange={handleInputChange}
            name="email"
            required
            label="Email"
            description="Please enter your email"
            styles={() => ({
              root: {
                width: "300px",
              },
            })}
          />
          <PasswordInput
            value={data.password}
            onChange={handleInputChange}
            name="password"
            required
            label="Password"
            description="Please enter your password"
            styles={() => ({
              root: {
                width: "300px",
              },
            })}
          />
          <Group
            position="apart"
            direction="column"
            styles={() => ({
              root: {
                width: "100%",
              },
            })}
          >
            <Text
              styles={() => ({
                root: {
                  textAlign: "center",
                  width: "100%",
                },
              })}
            >
              Don't have an account?
            </Text>
            <Button
              onClick={handleLogin}
              styles={() => ({
                root: {
                  width: "100%",
                },
              })}
            >
              Login
            </Button>
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
