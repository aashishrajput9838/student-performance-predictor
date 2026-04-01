"""
explore_dataset.py
Quick script to inspect the uploaded Excel dataset columns, shape, and sample rows.
"""
import sys

try:
    import pandas as pd
except ImportError:
    print("pandas not found"); sys.exit(1)

try:
    import openpyxl
except ImportError:
    print("openpyxl not found"); sys.exit(1)

df = pd.read_excel("student_performance_prediction dataset 2.xlsx")

print("=== Shape ===")
print(df.shape)

print("\n=== Columns ===")
print(df.columns.tolist())

print("\n=== Dtypes ===")
print(df.dtypes)

print("\n=== First 5 Rows ===")
print(df.head())

print("\n=== Null Values ===")
print(df.isnull().sum())

print("\n=== Value Counts for each object/categorical column ===")
for col in df.select_dtypes(include='object').columns:
    print(f"\n{col}:")
    print(df[col].value_counts())
