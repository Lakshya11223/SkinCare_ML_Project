from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import tensorflow as tf
import io

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

model = tf.keras.models.load_model(MODEL_PATH)

# ── Classes your model was trained on ───────────────────────────────
# Change this order to match exactly how your train/ folders are named
CLASS_NAMES = ["dry", "normal", "oily"]   # adjust if different

# ── Static skin data per skin type ──────────────────────────────────
SKIN_DATA = {
    "oily": {
        "skin_type": "Oily",
        "skin_score": 70,
        "skin_tone": "Medium / Warm",
        "concerns": [
            {"label": "Acne", "level": "Moderate", "severity": "red"},
            {"label": "Large Pores", "level": "Moderate", "severity": "yellow"},
            {"label": "Excess Sebum", "level": "High", "severity": "red"},
            {"label": "Wrinkles", "level": "None", "severity": "green"},
        ],
        "morning_routine": [
            {"step": 1, "name": "Foaming Cleanser", "note": "Remove overnight oil"},
            {"step": 2, "name": "Niacinamide Toner", "note": "Pore tightening"},
            {"step": 3, "name": "BHA Serum", "note": "Unclog pores"},
            {"step": 4, "name": "Oil-free Moisturizer", "note": "Lightweight gel"},
            {"step": 5, "name": "SPF 50+ Matte", "note": "Non-greasy"},
        ],
        "night_routine": [
            {"step": 1, "name": "Micellar Water", "note": "Remove SPF & makeup"},
            {"step": 2, "name": "Salicylic Acid Cleanser", "note": "Deep clean"},
            {"step": 3, "name": "Retinol Serum", "note": "Regulate sebum"},
            {"step": 4, "name": "Gel Moisturizer", "note": "Non-comedogenic"},
        ],
        "products": [
            {
                "icon": "🧴",
                "name": "CeraVe Foaming Cleanser",
                "category": "Cleanser · Step 1",
                "price": "₹799",
                "pros": ["Removes excess oil", "Ceramide-infused", "Fragrance-free"],
                "cons": ["Contains Sodium Laureth Sulfate", "May over-strip dry areas"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
            {
                "icon": "💜",
                "name": "The Ordinary Niacinamide 10%",
                "category": "Serum · Step 3",
                "price": "₹699",
                "pros": ["Minimizes pores", "Controls sebum", "Fades dark spots"],
                "cons": ["Zinc may cause purging initially", "Pills under makeup"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
            {
                "icon": "☀️",
                "name": "Minimalist SPF 50 Matte",
                "category": "Sunscreen · Step 5",
                "price": "₹499",
                "pros": ["Matte finish", "No white cast", "PA++++ protection"],
                "cons": ["Octinoxate (chemical filter)", "Needs reapplication every 2h"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
        ],
    },
    "dry": {
        "skin_type": "Dry",
        "skin_score": 72,
        "skin_tone": "Medium / Cool",
        "concerns": [
            {"label": "Flakiness", "level": "Moderate", "severity": "yellow"},
            {"label": "Tightness", "level": "Mild", "severity": "yellow"},
            {"label": "Dark Spots", "level": "Mild", "severity": "yellow"},
            {"label": "Acne", "level": "None", "severity": "green"},
        ],
        "morning_routine": [
            {"step": 1, "name": "Cream Cleanser", "note": "Non-stripping"},
            {"step": 2, "name": "Hydrating Toner", "note": "Hyaluronic acid"},
            {"step": 3, "name": "Vitamin C Serum", "note": "Brighten & protect"},
            {"step": 4, "name": "Rich Moisturizer", "note": "Shea butter base"},
            {"step": 5, "name": "SPF 50+", "note": "Moisturizing formula"},
        ],
        "night_routine": [
            {"step": 1, "name": "Cleansing Balm", "note": "Melt away impurities"},
            {"step": 2, "name": "Hydrating Serum", "note": "Ceramide + HA"},
            {"step": 3, "name": "Overnight Mask", "note": "Deep hydration"},
            {"step": 4, "name": "Eye Cream", "note": "Nourishing"},
        ],
        "products": [
            {
                "icon": "🧴",
                "name": "CeraVe Hydrating Cleanser",
                "category": "Cleanser · Step 1",
                "price": "₹899",
                "pros": ["Restores skin barrier", "Hyaluronic acid included", "Non-foaming gentle"],
                "cons": ["Glycerin may feel sticky", "Not suitable for acne-prone"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
            {
                "icon": "💧",
                "name": "The Ordinary HA 2% + B5",
                "category": "Serum · Step 3",
                "price": "₹590",
                "pros": ["Deep hydration", "Plumps skin", "Fragrance-free"],
                "cons": ["Needs to be applied on damp skin", "May cause congestion if overused"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
            {
                "icon": "☀️",
                "name": "Neutrogena Hydro Boost SPF 50",
                "category": "Sunscreen · Step 5",
                "price": "₹999",
                "pros": ["Hydrating formula", "No white cast", "Doubles as moisturizer"],
                "cons": ["Oxybenzone (chemical UV filter)", "Higher price point"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
        ],
    },
    "normal": {
        "skin_type": "Normal",
        "skin_score": 82,
        "skin_tone": "Medium / Neutral",
        "concerns": [
            {"label": "Dark Spots", "level": "Mild", "severity": "yellow"},
            {"label": "Acne", "level": "None", "severity": "green"},
            {"label": "Wrinkles", "level": "None", "severity": "green"},
            {"label": "Pores", "level": "Normal", "severity": "green"},
        ],
        "morning_routine": [
            {"step": 1, "name": "Gentle Cleanser", "note": "Balanced pH"},
            {"step": 2, "name": "Antioxidant Toner", "note": "Green tea / Niacinamide"},
            {"step": 3, "name": "Vitamin C Serum", "note": "Glow & protection"},
            {"step": 4, "name": "Light Moisturizer", "note": "Balanced hydration"},
            {"step": 5, "name": "SPF 50+", "note": "Daily protection"},
        ],
        "night_routine": [
            {"step": 1, "name": "Micellar Cleanser", "note": "Remove SPF"},
            {"step": 2, "name": "Peptide Serum", "note": "Maintain skin health"},
            {"step": 3, "name": "Moisturizer", "note": "Barrier support"},
            {"step": 4, "name": "Eye Cream", "note": "Preventive care"},
        ],
        "products": [
            {
                "icon": "🧴",
                "name": "Simple Kind to Skin Cleanser",
                "category": "Cleanser · Step 1",
                "price": "₹349",
                "pros": ["No harsh chemicals", "pH balanced", "Affordable"],
                "cons": ["Minimal active ingredients", "Not for acne-prone"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
            {
                "icon": "✨",
                "name": "Dot & Key Vitamin C Serum",
                "category": "Serum · Step 3",
                "price": "₹795",
                "pros": ["Brightening", "Antioxidant protection", "Indian brand"],
                "cons": ["Vitamin C oxidizes over time", "Strong smell initially"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
            {
                "icon": "☀️",
                "name": "Re'equil Oxybenzone-free SPF 50",
                "category": "Sunscreen · Step 5",
                "price": "₹599",
                "pros": ["No oxybenzone", "Lightweight", "Broad spectrum"],
                "cons": ["Slight white cast on deep skin tones", "Needs 2 finger length application"],
                "amazon": "https://amazon.in",
                "nykaa": "https://nykaa.com",
            },
        ],
    },
}

SHADE_MATCHES = {
    "oily":   [
        {"brand": "L'Oréal", "shade": "Warm Beige W3", "hex": "#C68642"},
        {"brand": "MAC", "shade": "NC35", "hex": "#B87650"},
        {"brand": "Fenty", "shade": "245N", "hex": "#C87848"},
        {"brand": "Maybelline", "shade": "220", "hex": "#D49060"},
        {"brand": "Nykaa", "shade": "Honey Beige", "hex": "#D4956A"},
    ],
    "dry":    [
        {"brand": "L'Oréal", "shade": "Rose Ivory C1", "hex": "#E8C9A8"},
        {"brand": "MAC", "shade": "NW20", "hex": "#DDB898"},
        {"brand": "Fenty", "shade": "185W", "hex": "#D4A882"},
        {"brand": "Maybelline", "shade": "120", "hex": "#DEB898"},
        {"brand": "Nykaa", "shade": "Ivory Glow", "hex": "#E2C4A4"},
    ],
    "normal": [
        {"brand": "L'Oréal", "shade": "Natural Beige N4", "hex": "#CCAA82"},
        {"brand": "MAC", "shade": "NC25", "hex": "#C8A070"},
        {"brand": "Fenty", "shade": "215N", "hex": "#C49868"},
        {"brand": "Maybelline", "shade": "128", "hex": "#C8A878"},
        {"brand": "Nykaa", "shade": "Sand Beige", "hex": "#CCA880"},
    ],
}


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img_array = preprocess_image(contents)

        predictions = model.predict(img_array)[0]   
        print(f"Predictions: {predictions}")    

        predicted_index = int(np.argmax(predictions))
        

        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(np.max(predictions)) * 100
        print(f"Predicted class: {predicted_class}, Confidence: {confidence:.2f}%")

        skin_info = SKIN_DATA[predicted_class]
        shades = SHADE_MATCHES[predicted_class]

        return JSONResponse({
            "success": True,
            "skin_type": skin_info["skin_type"],
            "skin_score": f"{confidence:.2f}",
            "skin_tone": skin_info["skin_tone"],
            "confidence": round(confidence, 1),
            "concerns": skin_info["concerns"],
            "morning_routine": skin_info["morning_routine"],
            "night_routine": skin_info["night_routine"],
            "products": skin_info["products"],
            "shade_matches": shades,
        })

    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


@app.get("/")
def root():
    return {"status": "GlowIQ backend running ✅"}