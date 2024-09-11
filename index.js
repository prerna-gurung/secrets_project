import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 3001;
const app = express();
const URL = "https://secrets-api.appbrewery.com";

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Use `path.join` and `fileURLToPath` to get the correct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory

app.use(express.static(path.join(__dirname, 'public')));

// Define the root route
app.get("/", async (req, res) => {
  try {
    const result = await axios.get(URL + "/random");
    if (result && result.data) {
      res.render("index.ejs", { secret: result.data.secret, user: result.data.username });
    } else {
      res.render("index.ejs", { content: "No data received from API" });
    }
  } catch (error) {
    console.error("Error fetching data:", error.message || error);
    res.status(500).render("index.ejs", { content: "Error fetching data from API." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
