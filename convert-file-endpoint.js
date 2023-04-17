const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");

const app = express();
const port = 3000;

// Set up file upload middleware
const upload = multer();

// Endpoint for converting a DOCX file to plain text
app.post("/convert-docx-to-text", upload.single("file"), (req, res) => {
  // Get the uploaded file
  const file = req.file.buffer;

  // Use Pandoc to convert the file to plain text
  const pandocCommand = `pandoc --from=docx --to=plain --output=-`;
  const pandocProcess = exec(pandocCommand);

  // Write the file content to the Pandoc process
  pandocProcess.stdin.write(file);
  pandocProcess.stdin.end();

  // Read the plain text output from the Pandoc process
  let content = "";
  pandocProcess.stdout.on("data", (data) => {
    content += data;
  });

  // Return the plain text content
  pandocProcess.on("exit", () => {
    res.json({ content });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
