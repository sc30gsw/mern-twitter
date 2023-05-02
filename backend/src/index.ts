import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
	res.send("Hello, MERN with TypeScript!");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
