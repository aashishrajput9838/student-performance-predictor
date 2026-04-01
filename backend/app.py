"""
app.py
======
Flask REST API for the UCI Student Performance Predictor.
Serves the trained Random Forest model (uci_rf_model.pkl) via a /predict endpoint.

Endpoints:
  GET  /         — health check (wakes Render from sleep)
  GET  /health   — JSON health status
  POST /predict  — accepts 30-feature JSON, returns prediction result
"""

import os
import json
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# ── App setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)

# Allow requests from any Vercel deployment + localhost dev
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.vercel.app",
    os.environ.get("FRONTEND_URL", ""),
])

# ── Load model artifacts ──────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "uci_rf_model.pkl"), "rb") as f:
    RF_MODEL = pickle.load(f)

with open(os.path.join(BASE_DIR, "uci_model_info.json"), "r") as f:
    MODEL_INFO = json.load(f)

FEATURE_NAMES = MODEL_INFO["feature_names"]          # ordered list of 30 features
CAT_ENCODERS  = MODEL_INFO["categorical_encoders"]   # {col: [class0, class1, ...]}

print(f"✅ Model loaded — features: {len(FEATURE_NAMES)}, accuracy: {MODEL_INFO['rf_accuracy']}")

# ── Categorical encoders ──────────────────────────────────────────────────────
# Each entry maps a string value → its LabelEncoder integer index
def label_encode(col: str, value: str) -> int:
    """Reproduce sklearn LabelEncoder.transform for a single value."""
    classes = CAT_ENCODERS[col]
    val_str = str(value).strip()
    if val_str in classes:
        return classes.index(val_str)
    # Fallback: return 0 (most common class)
    return 0

# ── Feature encoding ──────────────────────────────────────────────────────────
def encode_features(data: dict) -> np.ndarray:
    """
    Convert raw user input (same format as React predictor.js) into the
    ordered numeric feature vector expected by the Random Forest model.
    """
    row = []
    for feat in FEATURE_NAMES:
        raw = data.get(feat)
        if feat in CAT_ENCODERS:
            # Categorical → label encode
            row.append(label_encode(feat, raw if raw is not None else CAT_ENCODERS[feat][0]))
        else:
            # Numeric → cast to float, use sensible default if missing
            DEFAULTS = {
                "age": 16.7, "Medu": 2.75, "Fedu": 2.52,
                "traveltime": 1.57, "studytime": 1.93,
                "failures": 0.33, "famrel": 3.9,
                "freetime": 3.23, "goout": 3.11,
                "Dalc": 1.48, "Walc": 2.29,
                "health": 3.55, "absences": 5.71,
            }
            try:
                row.append(float(raw))
            except (TypeError, ValueError):
                row.append(float(DEFAULTS.get(feat, 0)))
    return np.array(row, dtype=float).reshape(1, -1)

# ── Feature importance metadata ────────────────────────────────────────────────
FEATURE_LABELS = {
    "failures": "Past Failures", "higher": "Higher Education Aspiration",
    "school": "School", "absences": "Absences", "famrel": "Family Relationship",
    "Walc": "Weekend Alcohol", "freetime": "Free Time", "Fedu": "Father's Education",
    "age": "Age", "health": "Health Status", "Medu": "Mother's Education",
    "goout": "Going Out", "Dalc": "Daily Alcohol", "Mjob": "Mother's Job",
    "reason": "School Choice Reason", "studytime": "Study Time",
    "traveltime": "Travel Time", "internet": "Internet Access",
    "famsup": "Family Support", "activities": "Extracurricular Activities",
    "schoolsup": "School Support", "paid": "Paid Classes",
    "sex": "Gender", "Pstatus": "Parent Cohabitation",
    "famsize": "Family Size", "address": "Home Address",
    "romantic": "Romantic Relationship", "nursery": "Attended Nursery",
    "Fjob": "Father's Job", "guardian": "Guardian",
}

FEATURE_IMPORTANCES = MODEL_INFO.get("feature_importances", {})

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "status": "online",
        "service": "Student Performance Predictor API",
        "model": "UCI Random Forest (80% accuracy)",
        "features": len(FEATURE_NAMES),
        "endpoints": ["/health", "/predict"],
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "model_loaded": True, "accuracy": MODEL_INFO["rf_accuracy"]})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        # Encode → predict
        X = encode_features(data)

        prediction    = int(RF_MODEL.predict(X)[0])          # 0=Fail, 1=Pass
        probabilities = RF_MODEL.predict_proba(X)[0].tolist() # [p_fail, p_pass]
        p_pass        = probabilities[1]
        p_fail        = probabilities[0]
        confidence    = round(max(p_pass, p_fail) * 100, 1)

        # Build breakdown for top features
        breakdown = []
        for feat, imp in sorted(FEATURE_IMPORTANCES.items(), key=lambda x: -x[1]):
            raw_val = data.get(feat, "N/A")
            breakdown.append({
                "key":        feat,
                "label":      FEATURE_LABELS.get(feat, feat),
                "importance": round(float(imp) * 100, 2),
                "value":      raw_val,
            })

        return jsonify({
            "result":       "Pass" if prediction == 1 else "Fail",
            "prediction":   prediction,
            "confidence":   confidence,
            "probability":  {"pass": round(p_pass * 100, 1), "fail": round(p_fail * 100, 1)},
            "model":        "Random Forest (UCI)",
            "accuracy":     MODEL_INFO["rf_accuracy"],
            "breakdown":    breakdown[:10],
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
