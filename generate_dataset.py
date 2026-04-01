import pandas as pd
import numpy as np

def generate_student_data(n_records=500):
    """
    Generates a synthetic dataset for student performance prediction.
    """
    np.random.seed(42)
    
    # Generating study hours (1 to 12 hours)
    study_hours = np.random.uniform(1, 12, n_records)
    
    # Generating attendance (40% to 100%)
    attendance = np.random.uniform(40, 100, n_records)
    
    # Generating previous marks (30 to 100)
    previous_marks = np.random.uniform(30, 95, n_records)
    
    # Generating assignments submitted (0 to 10)
    assignments = np.random.randint(0, 11, n_records)
    
    # Generating internet usage (1 to 8 hours)
    internet_usage = np.random.uniform(1, 8, n_records)
    
    # Generating family support (Yes, No)
    family_support = np.random.choice(['Yes', 'No'], n_records)
    
    # Performance logic: Pass if weighted score is high
    # Score = (Study*0.4 + Attend*0.3 + Prev*0.2 + Assign*0.1)
    # Family Support gives a boost, Internet Usage gives a slight penalty
    fs_boost = np.where(family_support == 'Yes', 5, 0)
    score = (study_hours * 5) + (attendance * 0.4) + (previous_marks * 0.3) + assignments + fs_boost - (internet_usage * 2)
    
    # Threshold for Pass (Adjusted for realistic distribution)
    performance = np.where(score >= 45, 'Pass', 'Fail')
    
    df = pd.DataFrame({
        'Study_Hours': np.round(study_hours, 1),
        'Attendance_Percentage': np.round(attendance, 1),
        'Previous_Marks': np.round(previous_marks, 1),
        'Assignments_Submitted': assignments,
        'Internet_Usage_Hours': np.round(internet_usage, 1),
        'Family_Support': family_support,
        'Performance': performance
    })
    
    return df

if __name__ == "__main__":
    df = generate_student_data(500)
    df.to_csv('student_data.csv', index=False)
    print(f"Successfully generated student_data.csv with {len(df)} records.")
