# 🎓 Student Performance Predictor — React + Tailwind CSS

An AI-powered web app that predicts whether a student will **Pass or Fail** based on academic and behavioral data. Built with **React**, **Tailwind CSS**, and a calibrated **ML prediction engine**.

---

## 🚀 Live Preview
Run the app locally using the setup instructions below.

---

## 🛠️ Tech Stack

| Tool         | Purpose                     |
|--------------|-----------------------------|
| React 18     | Component-based frontend    |
| Vite         | Super-fast dev server       |
| Tailwind CSS v3 | Utility-first styling    |
| JavaScript   | Prediction logic            |

---

## 📁 Project Structure

```
react-frontend/
├── public/
│   └── hero_image.png          # AI illustration (generated)
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Sticky glassmorphic navbar
│   │   ├── Hero.jsx             # Landing hero + stats
│   │   ├── PredictorForm.jsx    # Main prediction form
│   │   ├── MetricInput.jsx      # Reusable input component
│   │   └── PredictionResult.jsx # Pass/Fail result + confidence gauge
│   ├── utils/
│   │   └── predictor.js         # ML prediction logic + sample data
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind + global styles
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1. Navigate to the project
```bash
cd react-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🧠 Prediction Logic

The prediction engine (`src/utils/predictor.js`) uses a weighted scoring system calibrated from the trained Python **Random Forest Classifier**:

| Feature              | Weight |
|----------------------|--------|
| Study Hours          | +5.0   |
| Attendance (%)       | +0.4   |
| Previous Marks (%)   | +0.3   |
| Assignments Submitted| +1.0   |
| Internet Usage (h)   | -2.0   |
| Family Support       | +5.0   |

**Pass Threshold:** Score ≥ 45

**Confidence Score:** Normalized distance from the threshold (1–99%), giving a clearer picture beyond just binary Pass/Fail.

---

## 🧪 Sample Test Data

Click **"Load Sample Data"** in the app to auto-fill:

| Field               | Value |
|---------------------|-------|
| Study Hours         | 8.5   |
| Attendance          | 90%   |
| Previous Marks      | 80%   |
| Assignments         | 9/10  |
| Internet Usage      | 2h    |
| Family Support      | Yes   |

**Expected Result:** PASS with ~84% confidence

---

## ✨ Features

- 🌑 **Dark Mode Glassmorphism** — Premium frosted glass cards
- 📊 **Confidence Gauge** — Animated progress bar showing prediction confidence
- 🔄 **Load Sample Data** — One-click dummy data for testing
- 💡 **Beginner Friendly** — Fully commented components
- 📱 **Responsive** — Works on mobile, tablet, and desktop

---

## 🎓 Project Credits
Built for **Student Performance Prediction AI/ML** college project submission.
