const apiKey = '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'; 

// Handle the "Send" button click
document.getElementById('askQuestionButton').addEventListener('click', async function () {
    const question = document.getElementById('input').value;
    if (question.trim() !== "") {
        await processQuestion(question);
    }
});

// Handle the "Enter" key press to submit the question
document.getElementById('input').addEventListener('keypress', async function (event) {
    if (event.key === 'Enter') {
        const question = document.getElementById('input').value;
        if (question.trim() !== "") {
            await processQuestion(question);
        }
    }
});

// Update the status message (Pending, Success, Failure)
function updateStatus(status) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = status;
    statusMessage.className = 'status-message ' + status.toLowerCase().replace(' ', '-');
}

// Process the user question and fetch the wrong answer
async function processQuestion(question) {
    updateStatus('Pending...');

    try {
        const wrongAnswer = await getWrongAnswer(question);

        // Show the user's question in the chat
        addMessage('user', question);

        // Clear the input field after submission
        document.getElementById('input').value = '';

        // Show the bot's wrong answer in the chat
        addMessage('bot', wrongAnswer);

        // Update status to 'Success'
        updateStatus('Success');
    } catch (error) {
        updateStatus('Failure');
        console.error("Error fetching answer:", error);
    }
}

// Function to fetch the wrong answer from OpenAI API
async function getWrongAnswer(question) {
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4", // Or "gpt-3.5-turbo" if you prefer
            messages: [{ role: 'user', content: question }],
            max_tokens: 100,
            temperature: 0.7
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch answer from API');
    }

    const data = await response.json();
    const correctAnswer = data.choices[0].message.content;

    // Make the answer deliberately wrong (by reversing the text)
    return makeWrongAnswer(correctAnswer);
}

// Function to deliberately make the correct answer wrong
function makeWrongAnswer(correctAnswer) {
    let wrongAnswer = correctAnswer.split('').reverse().join('');
    wrongAnswer += " (This is wrong!)"; // Add note to indicate it's wrong
    return wrongAnswer;
}

// Function to add a new message to the chat window
function addMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const textDiv = document.createElement('div');
    textDiv.textContent = text;

    messageDiv.appendChild(textDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll chat window to the bottom after new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
