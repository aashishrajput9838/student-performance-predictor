"""
explore_uci.py
==============
Explore the UCI Student Performance dataset (ID=320) to understand
its structure, columns, target variable, and class distribution
before training any model.
"""
from ucimlrepo import fetch_ucirepo
import json

print("=== Fetching UCI Student Performance Dataset (ID=320) ===")
student_performance = fetch_ucirepo(id=320)

# Metadata
print("\n=== METADATA ===")
meta = student_performance.metadata
print(f"Name:         {meta.get('name')}")
print(f"Abstract:     {meta.get('abstract')}")
print(f"# Instances:  {meta.get('num_instances')}")
print(f"# Features:   {meta.get('num_features')}")
print(f"Area:         {meta.get('area')}")
print(f"Task:         {meta.get('tasks')}")
print(f"License:      {meta.get('license')}")
print(f"DOI:          {meta.get('doi')}")
print(f"URL:          {meta.get('dataset_url')}")

# Variable info
print("\n=== VARIABLES ===")
print(student_performance.variables.to_string())

# Features and Target
X = student_performance.data.features
y = student_performance.data.targets

print(f"\n=== FEATURES SHAPE: {X.shape} ===")
print(f"Columns: {X.columns.tolist()}")
print("\nFirst 5 rows of X:")
print(X.head())

print(f"\n=== TARGET SHAPE: {y.shape} ===")
print(f"Target columns: {y.columns.tolist()}")
print("\nFirst 5 rows of y:")
print(y.head())

print("\n=== TARGET VALUE COUNTS ===")
for col in y.columns:
    print(f"\n{col}:")
    print(y[col].value_counts().head(10))

print("\n=== FEATURE DTYPES ===")
print(X.dtypes)

print("\n=== MISSING VALUES ===")
print(X.isnull().sum())
