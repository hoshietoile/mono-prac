const fs = require("fs").promises;
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8000, () => {
  console.log("Server Running...");
});

app.get("/users", async (_1, res) => {
  console.log("### Request Received");
  const f = await fs.readFile("./src/json/users.json", "utf8");
  res.json(f);
});

app.post("/users", async (req, res) => {
  console.log("# req", req.body);
  try {
    const users = await fs.readFile('./src/json/users.json', 'utf8');
    const id = (new Date()).getTime();
    const user = {
      id,
      ...req.body,
    }
    const parsedUsers = JSON.parse(users);
    parsedUsers.push(user);
    const userStr = JSON.stringify(parsedUsers);
    await fs.writeFile('./src/json/users.json', userStr);
    res.json(JSON.stringify(user));
  } catch (e) {
    res.json({ msg: "error" });
  }
});
