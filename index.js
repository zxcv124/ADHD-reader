// Initialize constants
const editButton = document.getElementById('edit-button');
const convertFileButton = document.getElementById('convert-file-button');
const outputContainer = document.getElementById('output-container');

// Function to edit text
function editText(input) {
  // Split text into words
  const words = input.trim().split(/\s+/);

  // Loop through words and format them
  const formattedWords = words.map((word) => {
    const len = word.length;
    const mid = Math.floor(len / 2);
    if (len % 2 === 1) {
      // Make letters before middle letter bold if odd length
      return `<b>${word.substring(0, mid)}</b>${word.substring(mid, len)}`;
    } else {
      // Make half of all letters bold if even length
      const firstHalf = word.substring(0, mid);
      const secondHalf = word.substring(mid, len);
      return `<b>${firstHalf}</b>${secondHalf}`;
    }
  });

  // Join formatted words back into a string
  return formattedWords.join(' ');
}

// Function to convert file
async function convertFile(file) {
  // Load PDF file
  const pdfData = await pdfjsLib.getDocument(file).promise;

  // Convert PDF to text
  let pdfText = '';
  for (let pageNum = 1; pageNum <= pdfData.numPages; pageNum++) {
    const page = await pdfData.getPage(pageNum);
    const pageText = await page.getTextContent();
    pdfText += pageText.items.map((item) => item.str).join(' ');
  }

  // Edit text
  const editedText = editText(pdfText);

  // Create Word document
  const content = new Docxtemplater().loadZip(await fetch('template.docx').then((res) => res.arrayBuffer()));
  content.setData({
    text: editedText,
  });
  content.render();
  const editedFile = content.getZip().generate({ type: 'blob' });

  // Download Word document
  const fileName = file.name.replace(/\.[^/.]+$/, '') + '_edited.docx';
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(editedFile);
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const textInput = document.getElementById('text-input');
  const fileInput = document.getElementById('file-input');
  if (textInput.value) {
    // Edit text and display result
    const editedText = editText(textInput.value);
    outputContainer.innerHTML = `<div class="bg-gray-200 p-4 my-4">${editedText}</div>`;
  } else if (fileInput.files.length > 0) {
    // Convert file and download result
    convertFile(fileInput.files[0]);
  }
}

// Add event listeners
editButton.addEventListener('click', handleSubmit);
convertFileButton.addEventListener('click', handleSubmit);
