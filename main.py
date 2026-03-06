from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import tensorflow as tf
import io

from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

# Allow Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load your trained model ──────────────────────────────────────────
MODEL_PATH = r"D:\app\skin_classifier_model.h5"

tf_model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ["dry", "normal", "oily"]


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        # ── Step 1: Run TF model ─────────────────────────────────────
        contents = await file.read()
        img_array = preprocess_image(contents)

        predictions = tf_model.predict(img_array)[0]
        print(f"Predictions: {predictions}")

        predicted_index = int(np.argmax(predictions))
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(np.max(predictions)) * 100
        print(f"Predicted class: {predicted_class}, Confidence: {confidence:.2f}%")

        # ── Step 2: Ask Groq for skincare data ───────────────────────
        groq_model = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.7)

        prompt = PromptTemplate(
            template="""You are a skincare expert. A person has {skin_type} skin.
            Return a JSON object with EXACTLY these keys and structure, nothing else:
            {{
            "skin_tone": "string (e.g. Medium / Warm)",
            "morning_routine": [
                {{"step": 1, "name": "product name", "note": "short reason"}}
            ],
            "night_routine": [
                {{"step": 1, "name": "product name", "note": "short reason"}}
            ],
            "products": [
                {{
                "icon": "emoji",
                "name": "exact product name",
                "category": "type · Step number",
                "price": "₹price in INR",
                "pros": ["point1", "point2", "point3"],
                "cons": ["point1", "point2"]
                }}
            ]
            }}
            Rules:
            - morning_routine: exactly 4 steps
            - night_routine: exactly 4 steps
            - products: exactly 3 products relevant to {skin_type} skin
            - prices must be realistic Indian market prices in INR
            - Return ONLY the JSON, no extra text""",
            input_variables=["skin_type"]
                    )

        output_parser = JsonOutputParser()
        chain = prompt | groq_model | output_parser
        result = chain.invoke({"skin_type": predicted_class})

        return JSONResponse({
            "success": True,
            "skin_type": predicted_class.capitalize(),
            "skin_score": round(confidence, 2),
            "skin_tone": result.get("skin_tone", ""),
            "morning_routine": result.get("morning_routine", []),
            "night_routine": result.get("night_routine", []),
            "products": result.get("products", []),
        })

    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


@app.get("/")
def root():
    return {"status": "GlowIQ backend running ✅"}