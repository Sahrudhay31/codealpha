from flask import Flask, render_template, request, jsonify

from faq_data import faq_data
from nlp_engine import FAQChatbot


# ==========================================
# Create Flask Application
# ==========================================

app = Flask(__name__)


# ==========================================
# Initialize FAQ Chatbot
# ==========================================

chatbot = FAQChatbot(faq_data)


# ==========================================
# Home Page
# ==========================================

@app.route("/")
def home():

    return render_template("index.html")


# ==========================================
# FAQ Chat API
# ==========================================

@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    user_question = data.get(
        "question",
        ""
    ).strip()


    # Check empty question

    if not user_question:

        return jsonify({
            "error": "Please enter a question."
        }), 400


    # Get chatbot response

    result = chatbot.get_answer(
        user_question
    )


    # Return result as JSON

    return jsonify(result)


# ==========================================
# Start Server
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )