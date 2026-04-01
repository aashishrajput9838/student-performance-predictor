"""
train_model.py
==============
Trains ML models on the real Excel dataset:
  student_performance_prediction dataset 2.xlsx

Columns:
  - Study Hours per Week
  - Attendance Rate
  - Previous Grades
  - Participation in Extracurricular Activities  (Yes/No -> 1/0)
  - Parent Education Level                        (ordinal encoded)
  - Passed                                        (Yes/No -> 1/0 = target)

Steps:
  1. Load & clean data
  2. Encode categoricals
  3. Impute missing values
  4. Train Logistic Regression + Random Forest
  5. Evaluate & compare models
  6. Print feature importances & best weights for the React predictor
"""

import sys
import openpyxl
import numpy as np
from collections import Counter

print("=== Loading dataset ===")
wb = openpyxl.load_workbook("student_performance_prediction dataset 2.xlsx", read_only=True, data_only=True)
ws = wb.active

rows = []
for row in ws.iter_rows(min_row=2, values_only=True):
    rows.append(row)
wb.close()

print(f"Total rows loaded: {len(rows)}")

# ---- Columns -----------------------------------------------------------------
# 0: Student ID
# 1: Study Hours per Week
# 2: Attendance Rate
# 3: Previous Grades
# 4: Participation in Extracurricular Activities  (Yes/No)
# 5: Parent Education Level
# 6: Passed (Yes/No)  <-- TARGET

# Parent Education ordinal mapping
PARENT_EDU_MAP = {
    'High School': 1,
    'Associate': 2,
    'Bachelor': 3,
    'Master': 4,
    'PhD': 5,
    None: 2,  # Default = Associate
}

data_X = []
data_y = []

skipped = 0
for row in rows:
    _, study_h, attend, prev_grades, extra, parent_edu, passed = row

    # Skip rows where target is missing
    if passed is None:
        skipped += 1
        continue

    # Encode target
    y = 1 if str(passed).strip().lower() == 'yes' else 0

    # Encode Extracurricular (Yes=1, No=0, None=0)
    extra_enc = 1 if str(extra).strip().lower() == 'yes' else 0

    # Encode Parent Education (ordinal)
    parent_enc = PARENT_EDU_MAP.get(str(parent_edu).strip() if parent_edu else None, 2)

    # Use mean values for missing numeric fields
    study_h = float(study_h) if study_h is not None else 10.0
    attend = float(attend) if attend is not None else 78.0
    prev_grades = float(prev_grades) if prev_grades is not None else 65.0

    data_X.append([study_h, attend, prev_grades, extra_enc, parent_enc])
    data_y.append(y)

print(f"Skipped rows (no target): {skipped}")
print(f"Clean samples: {len(data_X)}")
print(f"Class distribution: {Counter(data_y)}")

# ---- Convert to numpy -------------------------------------------------------
X = np.array(data_X, dtype=float)
y = np.array(data_y, dtype=int)

# ---- Feature scaling (standardize) ------------------------------------------
means = X.mean(axis=0)
stds = X.std(axis=0)
stds[stds == 0] = 1  # Avoid division by zero
X_scaled = (X - means) / stds

print(f"\nFeature means: {means}")
print(f"Feature stds:  {stds}")

# ---- Train/Test split (80/20) -----------------------------------------------
np.random.seed(42)
indices = np.random.permutation(len(X))
split = int(0.8 * len(X))
train_idx, test_idx = indices[:split], indices[split:]

X_train, X_test = X_scaled[train_idx], X_scaled[test_idx]
y_train, y_test = y[train_idx], y[test_idx]
print(f"\nTrain: {len(X_train)}  |  Test: {len(X_test)}")

# ---- Import sklearn (deferred to avoid early failure) -----------------------
try:
    from sklearn.linear_model import LogisticRegression
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, precision_score, recall_score, classification_report, confusion_matrix
    import pickle, json
except ImportError as e:
    print(f"sklearn not found: {e}")
    sys.exit(1)

# ---- Logistic Regression ----------------------------------------------------
print("\n=== Training Logistic Regression ===")
lr = LogisticRegression(max_iter=500, random_state=42)
lr.fit(X_train, y_train)
lr_pred = lr.predict(X_test)

lr_acc = accuracy_score(y_test, lr_pred)
lr_prec = precision_score(y_test, lr_pred)
lr_rec = recall_score(y_test, lr_pred)
print(f"Accuracy:  {lr_acc:.4f}")
print(f"Precision: {lr_prec:.4f}")
print(f"Recall:    {lr_rec:.4f}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, lr_pred))
print(classification_report(y_test, lr_pred))

# ---- Random Forest ----------------------------------------------------------
print("\n=== Training Random Forest ===")
rf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)

rf_acc = accuracy_score(y_test, rf_pred)
rf_prec = precision_score(y_test, rf_pred)
rf_rec = recall_score(y_test, rf_pred)
print(f"Accuracy:  {rf_acc:.4f}")
print(f"Precision: {rf_prec:.4f}")
print(f"Recall:    {rf_rec:.4f}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, rf_pred))
print(classification_report(y_test, rf_pred))

# ---- Feature Importances ----------------------------------------------------
feature_names = [
    "Study Hours per Week",
    "Attendance Rate",
    "Previous Grades",
    "Extracurricular",
    "Parent Education Level"
]
importances = rf.feature_importances_
print("\n=== Random Forest Feature Importances ===")
for name, imp in sorted(zip(feature_names, importances), key=lambda x: -x[1]):
    print(f"  {name}: {imp:.4f}")

# ---- Winner -----------------------------------------------------------------
winner = "Random Forest" if rf_acc >= lr_acc else "Logistic Regression"
print(f"\n✅ Better Model: {winner}")
print(f"   LR Accuracy:  {lr_acc:.4f}")
print(f"   RF Accuracy:  {rf_acc:.4f}")

# ---- Save model & scaler info for export ------------------------------------
model_info = {
    "feature_names": feature_names,
    "means": means.tolist(),
    "stds": stds.tolist(),
    "lr_accuracy": round(lr_acc, 4),
    "rf_accuracy": round(rf_acc, 4),
    "feature_importances": dict(zip(feature_names, [round(float(v), 4) for v in importances])),
    "parent_edu_map": PARENT_EDU_MAP,
    "pass_threshold_info": "Model uses sklearn predict — threshold = 0.5 probability"
}
with open("model_info.json", "w") as f:
    json.dump(model_info, f, indent=2)

# Save model using pickle
with open("rf_model.pkl", "wb") as f:
    pickle.dump(rf, f)
with open("scaler_params.json", "w") as f:
    json.dump({"means": means.tolist(), "stds": stds.tolist()}, f)

print("\n✅ Saved: rf_model.pkl, model_info.json, scaler_params.json")
print("\n=== DONE ===")
