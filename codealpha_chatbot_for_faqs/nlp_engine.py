import re

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ==========================================
# Stopwords
# ==========================================

STOP_WORDS = set(
    stopwords.words("english")
)


# ==========================================
# Text Preprocessing
# ==========================================

def preprocess_text(text):

    # Convert to lowercase

    text = text.lower()


    # Remove punctuation

    text = re.sub(
        r"[^a-zA-Z0-9\s]",
        "",
        text
    )


    # Tokenize

    tokens = word_tokenize(text)


    # Remove stopwords

    tokens = [
        word
        for word in tokens
        if word not in STOP_WORDS
    ]


    return " ".join(tokens)


# ==========================================
# FAQ Chatbot
# ==========================================

class FAQChatbot:

    def __init__(self, faq_data):

        self.faq_data = faq_data


        # Store every possible FAQ question

        self.questions = []

        self.question_faq_index = []


        for index, faq in enumerate(faq_data):

            for question in faq["questions"]:

                self.questions.append(
                    question
                )

                self.question_faq_index.append(
                    index
                )


        # Preprocess every question

        self.processed_questions = [

            preprocess_text(question)

            for question in self.questions

        ]


        # Create TF-IDF vectorizer

        self.vectorizer = TfidfVectorizer()


        # Convert questions to vectors

        self.question_vectors = (

            self.vectorizer.fit_transform(

                self.processed_questions

            )

        )


    # ======================================
    # Get Answer
    # ======================================

    def get_answer(self, user_question):

        # Preprocess user question

        processed_question = (

            preprocess_text(
                user_question
            )

        )


        # Convert user question to vector

        user_vector = (

            self.vectorizer.transform(

                [processed_question]

            )

        )


        # Calculate cosine similarity

        similarities = (

            cosine_similarity(

                user_vector,

                self.question_vectors

            )[0]

        )


        # Find highest similarity

        best_index = similarities.argmax()


        best_score = similarities[best_index]


        # Find which FAQ it belongs to

        faq_index = (

            self.question_faq_index[
                best_index
            ]

        )


        # Minimum confidence threshold

        threshold = 0.20


        # No suitable match

        if best_score < threshold:

            return {

                "answer":
                    "Sorry, I could not find a suitable answer to your question.",

                "score":
                    float(best_score)

            }


        # Return answer

        return {

            "answer":
                self.faq_data[
                    faq_index
                ]["answer"],

            "matched_question":
                self.questions[
                    best_index
                ],

            "score":
                float(best_score)

        }