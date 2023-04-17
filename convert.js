// Function to extract text from uploaded file
function extractTextFromFile(file) {
    // Code to extract text from file goes here
    // ...
    return extractedText;
  }
  
  // Function to apply the bold formatting to words
  function applyBoldFormatting(text) {
    // Split the text into words
    const words = text.split(' ');
  
    // Loop through each word and apply the bold formatting to half of the letters
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const len = word.length;
      const mid = Math.floor(len / 2);
      let boldLetters = '';
      for (let j = 0; j < mid; j++) {
        boldLetters += word[j];
      }
      if (len % 2 !== 0) {
        boldLetters += word[mid];
      }
      words[i] = word.replace(boldLetters, '<b>' + boldLetters + '</b>');
    }
  
    // Join the words back together and return the formatted text
    return words.join(' ');
  }
  
  // Function to handle the form submission
  function handleFormSubmit(event) {
    event.preventDefault();
  
    // Get the form element and input value
    const form = document.getElementById('text-editor-form');
    const input = form.elements['text-input'];
  
    // Determine whether the input is text or a file
    let inputText = '';
    if (input.files.length > 0) {
      // If the input is a file, extract the text from the file
      const file = input.files[0];
      inputText = extractTextFromFile(file);
    } else {
      // If the input is text, get the value of the input field
      inputText = input.value;
    }
  
    // Apply the bold formatting to the text
    const formattedText = applyBoldFormatting(inputText);
  
    // Create a text bubble to display the results
    const resultBubble = document.createElement('div');
    resultBubble.innerHTML = formattedText;
    resultBubble.classList.add('text-bubble');
  
    // Add the text bubble to the page
    const outputContainer = document.getElementById('output-container');
    outputContainer.appendChild(resultBubble);
  
    // Clear the input field
    input.value = '';
  }
  
  // Add an event listener to the form
  const form = document.getElementById('text-editor-form');
  form.addEventListener('submit', handleFormSubmit);
  
  const form = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const fileInput = document.querySelector('#file-input');
const editButton = document.querySelector('#edit-button');
const convertFileButton = document.querySelector('#convert-file-button');
const outputContainer = document.querySelector('#output-container');

editButton.addEventListener('click', (event) => {
  event.preventDefault();
  const text = textInput.value;
  const editedText = editText(text);
  outputContainer.innerHTML = `
    <div class="bg-gray-100 p-4 mb-4">${editedText}</div>
  `;
});

convertFileButton.addEventListener('click', (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const editedText = editText(text);
      const blob = new Blob([editedText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-text.docx';
      link.click();
    };
    reader.readAsText(file);
  }
});

function editWord(word) {
  const length = word.length;
  if (length % 2 === 0) {
    const firstHalf = word.slice(0, length / 2);
    const secondHalf = word.slice(length / 2);
    return `<span><b>${firstHalf}</b>${secondHalf}</span>`;
  } else {
    const middle = Math.floor(length / 2);
    const firstHalf = word.slice(0, middle);
    const secondHalf = word.slice(middle + 1);
    const middleLetter = word[middle];
    return `<span><b>${firstHalf}</b>${middleLetter}<b>${secondHalf}</b></span>`;
  }
}

function editText(text) {
  const words = text.split(/\b/);
  let editedText = '';
  for (const word of words) {
    if (word.match(/^\W+$/)) {
      editedText += word;
    } else {
      const editedWord = editWord(word);
      editedText += editedWord;
    }
  }
  return editedText;
}
