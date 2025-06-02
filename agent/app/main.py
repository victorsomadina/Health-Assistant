from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.coordinator_agent import CoordinatorAgent

app = Flask(__name__)
CORS(app)

coordinator = CoordinatorAgent()
session_histories = {} # victor, remove history related codes for the deployment

@app.route("/interact", methods=["POST"])
def interact():
    data = request.get_json()
    question = data.get("question", "").strip()
    session_id = data.get("session_id", "default")

    if not question:
        return jsonify({"error": "Please provide a question or symptoms"}), 400

    if session_id not in session_histories:
        session_histories[session_id] = []
    session_histories[session_id].append({"role": "user", "content": question})


    response = coordinator.handle_conversation(question, history=session_histories[session_id])


    session_histories[session_id].append({"role": "assistant", "content": response})

    return jsonify({"message": response}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
