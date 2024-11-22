// Define your OpenAI API key here (keep this secret, don't expose it publicly)
const apiKey = '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'; // Replace with your OpenAI API key

// Set up the event listener on the button
document.getElementById('askQuestionButton').addEventListener('click', async function() {
    const question = document.getElementById('input').value;
    if (question.trim() !== "") {
        await processQuestion(question);
    }
});

// Allow pressing 'Enter' to submit the question
document.getElementById('input').addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
        const question = document.getElementById('input').value;
        if (question.trim() !== "") {
            await processQuestion(question);
        }
    }
});

// Process the question and get the wrong answer
async function processQuestion(question) {
    // Display the user question in the chat
    addMessage('user', question);

    // Clear the input box
    document.getElementById('input').value = '';

    // Fetch the wrong answer from the API
    const wrongAnswer = await getWrongAnswer(question);

    // Display the bot's wrong answer in the chat
    addMessage('bot', wrongAnswer);
}

// Fetch the wrong answer from OpenAI API
async function getWrongAnswer(question) {
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";

    const correctResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4", // or "gpt-3.5-turbo" if you prefer an earlier model
            messages: [{ role: 'user', content: question }],
            max_tokens: 100,
            temperature: 0.7
        }),
    });

    const correctAnswer = await correctResponse.json();
    let answerText = correctAnswer.choices[0].message.content;

    // Deliberately alter the answer to make it wrong
    return makeWrongAnswer(answerText);
}

// Function to deliberately make the answer wrong
function makeWrongAnswer(correctAnswer) {
    // A simple approach: reverse the answer and add "wrong" notes
    let wrongAnswer = correctAnswer.split('').reverse().join('');
    wrongAnswer += " (This is wrong!)";
    return wrongAnswer;
}

// Add a new message to the chat area
function addMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = text;
    
    messageDiv.appendChild(textDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll the chat container to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
