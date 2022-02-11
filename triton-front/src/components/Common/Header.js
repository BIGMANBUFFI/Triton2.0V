import {
  Group,
  Text,
  Avatar,
} from "@mantine/core";

export default function Header() {
  return (
    <Group
      position="apart"
      styles={() => ({
        root: {
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0px 1px 10px #b0b0b0",
          zIndex: 10,
        },
      })}
    >
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
      <Group
        styles={() => ({
          root: {
            paddingLeft: "20px",
            paddingRight: "20px",
          },
        })}
      >
        <Avatar color="cyan" radius="xl" size="md">
          SK
        </Avatar>
        <Text>Shendrit Kqiku</Text>
      </Group>
    </Group>
  );
}
