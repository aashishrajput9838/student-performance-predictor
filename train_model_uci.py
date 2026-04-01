"""
train_model_uci.py
==================
Trains ML models on the UCI Student Performance dataset (ID=320).
Source: https://archive.ics.uci.edu/dataset/320/student+performance

Dataset: 649 students, 30 features, target = G3 (final grade 0-20)
Task: Binary Classification — Pass (G3 >= 10) vs Fail (G3 < 10)

Steps:
  1. Fetch dataset via ucimlrepo
  2. Create binary Pass/Fail target from G3
  3. Encode categorical features (Label Encoding)
  4. Train Logistic Regression + Random Forest
  5. Evaluate & compare, print feature importances
  6. Save model artifacts for the React predictor
"""

import sys
import json
import pickle
import numpy as np

from ucimlrepo import fetch_ucirepo
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    confusion_matrix, classification_report
)

print("=== Fetching UCI Student Performance Dataset (ID=320) ===")
student_performance = fetch_ucirepo(id=320)

X = student_performance.data.features.copy()
y_grades = student_performance.data.targets['G3'].copy()

print(f"Dataset shape: {X.shape}")
print(f"G3 grade range: {y_grades.min()} – {y_grades.max()}")

# ---- Create binary target: Pass = G3 >= 10, Fail = G3 < 10 -----------------
y = (y_grades >= 10).astype(int)
print(f"\nPass/Fail distribution:")
print(f"  Pass (G3>=10): {y.sum()} ({y.sum()/len(y)*100:.1f}%)")
print(f"  Fail (G3<10):  {(y==0).sum()} ({(y==0).sum()/len(y)*100:.1f}%)")

# ---- Drop G1, G2 if they leaked into features (they won't via ucimlrepo) ----
# Also drop columns unlikely to be available at prediction time
# Keep: studytime, absences, failures, Medu, Fedu, famrel, goout, health
# + binary encoded: higher, internet, activities, schoolsup, famsup, paid, romantic

# Encode all categorical string columns
cat_cols = X.select_dtypes(include='object').columns.tolist()
print(f"\nEncoding {len(cat_cols)} categorical columns: {cat_cols}")

encoders = {}
X_enc = X.copy()
for col in cat_cols:
    le = LabelEncoder()
    X_enc[col] = le.fit_transform(X_enc[col].astype(str))
    encoders[col] = list(le.classes_)

print(f"Final feature shape: {X_enc.shape}")
print(f"Columns: {X_enc.columns.tolist()}")

# ---- Train/Test split (80/20) -----------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_enc, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTrain: {len(X_train)}  |  Test: {len(X_test)}")

# ---- Scale for Logistic Regression ------------------------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

# ---- Logistic Regression ----------------------------------------------------
print("\n=== Training Logistic Regression ===")
lr = LogisticRegression(max_iter=1000, random_state=42, C=1.0)
lr.fit(X_train_scaled, y_train)
lr_pred = lr.predict(X_test_scaled)

lr_acc  = accuracy_score(y_test, lr_pred)
lr_prec = precision_score(y_test, lr_pred)
lr_rec  = recall_score(y_test, lr_pred)
print(f"Accuracy:  {lr_acc:.4f}")
print(f"Precision: {lr_prec:.4f}")
print(f"Recall:    {lr_rec:.4f}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, lr_pred))
print(classification_report(y_test, lr_pred, target_names=['Fail', 'Pass']))

# ---- Random Forest ----------------------------------------------------------
print("\n=== Training Random Forest ===")
rf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)

rf_acc  = accuracy_score(y_test, rf_pred)
rf_prec = precision_score(y_test, rf_pred)
rf_rec  = recall_score(y_test, rf_pred)
print(f"Accuracy:  {rf_acc:.4f}")
print(f"Precision: {rf_prec:.4f}")
print(f"Recall:    {rf_rec:.4f}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, rf_pred))
print(classification_report(y_test, rf_pred, target_names=['Fail', 'Pass']))

# ---- Feature Importances ----------------------------------------------------
feature_names = X_enc.columns.tolist()
importances = rf.feature_importances_
fi_sorted = sorted(zip(feature_names, importances), key=lambda x: -x[1])

print("\n=== Top 15 Feature Importances (Random Forest) ===")
for name, imp in fi_sorted[:15]:
    bar = '█' * int(imp * 200)
    print(f"  {name:<20} {imp:.4f}  {bar}")

# ---- Winner -----------------------------------------------------------------
winner = "Random Forest" if rf_acc >= lr_acc else "Logistic Regression"
print(f"\n✅ Better Model: {winner}")
print(f"   LR Accuracy:  {lr_acc:.4f}")
print(f"   RF Accuracy:  {rf_acc:.4f}")

# ---- Save artifacts ---------------------------------------------------------
model_info = {
    "dataset":           "UCI Student Performance (ID=320)",
    "n_instances":        649,
    "n_features":         30,
    "target":             "G3 >= 10 → Pass, G3 < 10 → Fail",
    "feature_names":      feature_names,
    "categorical_encoders": encoders,
    "lr_accuracy":        round(lr_acc,  4),
    "rf_accuracy":        round(rf_acc,  4),
    "feature_importances": {
        name: round(float(imp), 4) for name, imp in fi_sorted[:15]
    },
    "top_features": [
        {"name": n, "importance": round(float(i)*100, 2)} for n, i in fi_sorted[:10]
    ]
}

with open("uci_model_info.json", "w") as f:
    json.dump(model_info, f, indent=2)

# Save models
with open("uci_rf_model.pkl", "wb") as f:
    pickle.dump(rf, f)
with open("uci_lr_model.pkl", "wb") as f:
    pickle.dump(lr, f)
with open("uci_scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("\n✅ Saved: uci_rf_model.pkl, uci_lr_model.pkl, uci_scaler.pkl, uci_model_info.json")
print("\n=== DONE ===")
