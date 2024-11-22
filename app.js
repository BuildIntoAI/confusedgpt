
const apiKey = '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'; 

// Set up the event listener on the button
document.getElementById('askQuestionButton').addEventListener('click', async function() {
    const question = document.getElementById('input').value;
    
    // If the question is empty, just return early
    if (!question) {
        document.getElementById('response').textContent = "Please ask a question!";
        return;
    }
    
    // Fetch a wrong answer from the API
    const wrongAnswer = await getWrongAnswer(question);
    
    // Display the wrong answer
    document.getElementById('response').textContent = wrongAnswer;
    
    // Clear the input box
    document.getElementById('input').value = '';
});

// Function to fetch the wrong answer
async function getWrongAnswer(question) {
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";

    // Fetch a correct response from OpenAI's API
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

    // Modify the answer to make it wrong
    return makeWrongAnswer(answerText);
}

// Function to deliberately change the answer to be wrong
function makeWrongAnswer(correctAnswer) {
    // For simplicity, we'll just reverse the answer and add some funny nonsense to it
    let wrongAnswer = correctAnswer.split('').reverse().join(''); // Reverse the correct answer
    wrongAnswer += " (This is absolutely incorrect!)";  // Add a note that it's wrong
    return wrongAnswer;
}
