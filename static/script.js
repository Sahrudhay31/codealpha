const chatArea =
    document.getElementById("chatArea");

const questionInput =
    document.getElementById("questionInput");

const sendButton =
    document.getElementById("sendButton");

const exampleButtons =
    document.querySelectorAll(
        ".example-button"
    );


// ========================================
// Send Question
// ========================================

sendButton.addEventListener(
    "click",
    sendQuestion
);


async function sendQuestion() {

    const question =
        questionInput.value.trim();


    // Do nothing if input is empty

    if (!question) {

        questionInput.focus();

        return;
    }


    // Display user question

    addMessage(
        question,
        "user"
    );


    // Clear input

    questionInput.value = "";


    // Disable button

    sendButton.disabled = true;

    sendButton.textContent =
        "Thinking...";


    try {

        // Send question to Flask

        const response =
            await fetch(
                "/ask",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question: question
                    })
                }
            );


        // Convert response to JSON

        const data =
            await response.json();


        // Check for server error

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to process the question."
            );

        }


        // Display bot response

        addBotResponse(data);


    } catch (error) {

        console.error(
            "Chatbot error:",
            error
        );


        addMessage(
            "Sorry, I could not process your question. Please try again.",
            "bot"
        );


    } finally {

        sendButton.disabled = false;

        sendButton.textContent =
            "Send";

    }

}


// ========================================
// Add Normal Message
// ========================================

function addMessage(
    text,
    sender
) {

    const message =
        document.createElement(
            "div"
        );


    message.className =
        `message ${sender}-message`;


    const icon =
        document.createElement(
            "div"
        );


    icon.className =
        "message-icon";


    icon.textContent =
        sender === "bot"
            ? "🤖"
            : "👤";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    const paragraph =
        document.createElement(
            "p"
        );


    paragraph.textContent =
        text;


    content.appendChild(
        paragraph
    );


    message.appendChild(
        icon
    );


    message.appendChild(
        content
    );


    chatArea.appendChild(
        message
    );


    scrollToBottom();

}


// ========================================
// Add Bot Response
// ========================================

function addBotResponse(data) {

    const message =
        document.createElement(
            "div"
        );


    message.className =
        "message bot-message";


    // Bot icon

    const icon =
        document.createElement(
            "div"
        );


    icon.className =
        "message-icon";


    icon.textContent =
        "🤖";


    // Main content

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    // Answer

    const answer =
        document.createElement(
            "p"
        );


    answer.textContent =
        data.answer;


    content.appendChild(
        answer
    );


    // ====================================
    // Matching information
    // ====================================

    if (
        data.matched_question
    ) {

        const matchInfo =
            document.createElement(
                "div"
            );


        matchInfo.className =
            "match-info";


        const matchedQuestion =
            document.createElement(
                "p"
            );


        matchedQuestion.innerHTML =
            "<strong>Matched FAQ:</strong> " +
            escapeHtml(
                data.matched_question
            );


        const similarity =
            document.createElement(
                "p"
            );


        const percentage =
            (
                data.score * 100
            ).toFixed(1);


        similarity.innerHTML =
            "<strong>Similarity:</strong> " +
            percentage +
            "%";


        matchInfo.appendChild(
            matchedQuestion
        );


        matchInfo.appendChild(
            similarity
        );


        content.appendChild(
            matchInfo
        );

    }


    // Add message to chat

    message.appendChild(
        icon
    );


    message.appendChild(
        content
    );


    chatArea.appendChild(
        message
    );


    scrollToBottom();

}


// ========================================
// Escape HTML
// ========================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ========================================
// Scroll Chat
// ========================================

function scrollToBottom() {

    chatArea.scrollTop =
        chatArea.scrollHeight;

}


// ========================================
// Example Questions
// ========================================

exampleButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                questionInput.value =
                    button.textContent.trim();

                questionInput.focus();

            }
        );

    }
);


// ========================================
// Enter Key
// ========================================

questionInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendQuestion();

        }

    }
);