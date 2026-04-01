import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Load Data
print("--- Loading Student Data ---")
df = pd.read_csv('student_data.csv')
print(f"Dataset loaded with {len(df)} records.")

# 2. Preprocessing
print("\n--- Preprocessing Data ---")
le = LabelEncoder()
df['Family_Support'] = le.fit_transform(df['Family_Support']) # Yes=1, No=0
df['Performance'] = le.fit_transform(df['Performance'])       # Pass=1, Fail=0
print("Data encoded: 'Performance' (1=Pass, 0=Fail)")

# 3. Splitting Data
X = df.drop('Performance', axis=1)
y = df['Performance']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Model Training
print("\n--- Training Models ---")
# Logistic Regression
lr_model = LogisticRegression()
lr_model.fit(X_train, y_train)
lr_pred = lr_model.predict(X_test)

# Random Forest
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
rf_pred = rf_model.predict(X_test)

# 5. Evaluation
print("\n--- Model Evaluation Results ---")
print(f"Logistic Regression Accuracy: {accuracy_score(y_test, lr_pred):.4f}")
print(f"Random Forest Accuracy:       {accuracy_score(y_test, rf_pred):.4f}")

print("\nRandom Forest Detailed Report:")
print(classification_report(y_test, rf_pred))

# 6. Sample Prediction
print("\n--- Sample Prediction Demo ---")
# Sample data: Study=8.5, Attend=90, Marks=80, Assign=9, Internet=2, Family=Yes(1)
sample_input = np.array([[8.5, 90.0, 80.0, 9, 2.0, 1]])
prediction = rf_model.predict(sample_input)
result = "PASS" if prediction[0] == 1 else "FAIL"
print(f"Input: Study=8.5h, Attend=90%, Marks=80, Assign=9, Internet=2h, Family=Yes")
print(f"Prediction: Student is likely to {result}")

print("\n--- Project Execution Successful ---")
