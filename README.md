# 🚦 RoadSense AI

### AI-Powered Road Accident Risk, Severity Prediction & Analytics Platform

<p align="center">
  <b>Turning road accident data into actionable insights for safer roads.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi" />
  <img src="https://img.shields.io/badge/MySQL-Database-orange?logo=mysql" />
  <img src="https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-yellow?logo=scikitlearn" />
  <img src="https://img.shields.io/badge/Status-Completed-success" />
</p>

---

## 🌐 Overview

**RoadSense AI** is an AI-powered road safety analytics platform designed to analyze historical road accident data, visualize accident patterns, and predict accident severity based on road, environmental, temporal, and contextual factors.

The platform combines:

- 🤖 Machine Learning
- 📊 Data Analytics
- 🗺️ Interactive Geospatial Visualization
- ⚡ FastAPI REST APIs
- 💻 React-based Web Interface
- 🗄️ MySQL Database

into a unified system for understanding **where, when, and under what conditions road accidents are more likely to occur and how severe they may be.**

---

## 🎯 Problem Statement

Road accident datasets contain valuable information about accident locations, causes, weather conditions, road types, timings, and severity.

However, raw accident records alone are difficult to interpret and do not provide an interactive way to:

- Identify accident-prone locations
- Understand accident patterns
- Compare accident severity
- Analyze major contributing factors
- Explore geographical accident distributions
- Predict the potential severity of a new accident

**RoadSense AI addresses this gap by transforming raw accident data into an interactive analytics and prediction platform.**

---

# ✨ Key Features

## 📊 Interactive Dashboard

A centralized dashboard providing an overview of road accident patterns and key statistics.

### Includes:

- Total accident records
- Severity distribution
- Accident trends
- State-wise analysis
- City-wise analysis
- Weather-based analysis
- Road-type analysis
- Accident cause analysis

---

## 🗺️ Interactive Accident Map

Explore accident locations geographically through an interactive map.

### Features:

- 📍 Accident location visualization
- 🔢 Accident clustering
- 🎨 Severity-based visualization
- 🔍 Zoom-based adaptive aggregation
- 🖱️ Hover information cards
- 📌 Clickable accident details
- 🌎 City and state level exploration

The map dynamically adapts the visualization depending on the zoom level, making it possible to explore both large-scale accident patterns and individual accident records.

---

## 🔎 Accident Explorer

Explore individual accident records from the database.

### Supports filtering by:

- City
- State
- Severity
- Risk Band
- Cause
- Weather
- Road Type

Users can navigate through accident records using pagination and inspect detailed accident information.

---

## 🤖 AI Severity Prediction

RoadSense AI includes a Machine Learning prediction system that estimates accident severity based on input conditions.

The prediction pipeline uses factors such as:

- Location
- Weather
- Road characteristics
- Accident cause
- Time-related information
- Other accident attributes

The trained ML model generates a predicted severity classification and corresponding risk information.

---

## 📈 Analytics

The platform provides multiple analytical views to identify patterns hidden within the accident dataset.

### Analytics include:

- 🏙️ City-wise accidents
- 🗺️ State-wise accidents
- 🌧️ Weather-wise accidents
- 🛣️ Road-type analysis
- ⚠️ Cause-wise analysis
- 🕒 Time-period analysis
- 🚨 Severity analysis

---

# 🧠 Machine Learning

The Machine Learning component was developed using **Python and Scikit-learn**.

Multiple classification approaches were evaluated during the model development process, with **Random Forest** selected as the final model for the prediction pipeline.

### Final Model

**Random Forest Classifier**

| Metric | Score |
|---|---:|
| Accuracy | ~50.90% |
| Macro F1 Score | ~44.86% |
| Balanced Accuracy | ~54.25% |

> These results are based on the evaluation performed during the project development process.

The model artifacts are intentionally not included in the GitHub repository because the trained model file exceeds GitHub's individual file-size limit.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │       React Frontend    │
                    │     React + Vite + CSS   │
                    └────────────┬────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend     │
                    │        Python API        │
                    └───────────┬─────────────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                  ▼                           ▼
        ┌───────────────────┐       ┌───────────────────┐
        │    MySQL Database │       │ Machine Learning  │
        │    roadsense_db   │       │   Scikit-learn    │
        └───────────────────┘       └───────────────────┘
                  │                           │
                  │                           │
                  └─────────────┬─────────────┘
                                ▼
                     ┌─────────────────────┐
                     │ Analytics &         │
                     │ Prediction Results  │
                     └─────────────────────┘


## 🛠️ Technology Stack

### 🎨 Frontend

- **React**
- **Vite**
- **JavaScript**
- **CSS**
- **React Leaflet**
- **Recharts**

### ⚙️ Backend

- **Python**
- **FastAPI**
- **Uvicorn**
- **SQLAlchemy**
- **Pydantic**

### 🗄️ Database

- **MySQL**
- **Database Name:** `roadsense_db`

### 🤖 Machine Learning

- **Python**
- **Pandas**
- **NumPy**
- **Scikit-learn**
- **Joblib**

### 🧰 Development Tools

- **VS Code**
- **Git**
- **GitHub**
- **Jupyter Notebook**

---

## 📁 Project Structure

```text
RoadSense-AI/
│
├── Backend/
│   └── app/
│       ├── __init__.py
│       ├── database.py
│       ├── main.py
│       ├── models.py
│       │
│       └── routes/
│           ├── __init__.py
│           ├── accidents.py
│           ├── analytics.py
│           └── predict.py
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccidentExplorer.jsx
│   │   │   ├── AccidentMap.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PredictionForm.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── ExplorerPage.jsx
│   │   │   ├── PredictionPage.jsx
│   │   │   ├── Home.jsx
│   │   │   └── LandingPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── ML/
│   ├── train_model.py
│   ├── label_encoder.pkl
│   └── model_results.csv
│
├── dataset/
│   ├── raw/
│   │   └── indian_road_accidents.csv
│   │
│   └── cleaned/
│       └── roadsense_ai_cleaned.csv
│
├── notebooks/
│   └── 01_data_exploration.ipynb
│
├── requirements.txt
├── .gitignore
├── README.md
├── package.json
└── package-lock.json

Note: roadsense_severity_model.pkl is excluded from version control because of its large file size.

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ishita1124/RoadSense-AI.git
cd RoadSense-AI

## 🐍 Backend Setup

Navigate to the backend directory:

```bash
cd Backend

Create a Python virtual environment:

python -m venv venv

Activate the virtual environment on Windows:

venv\Scripts\activate

Install the required Python dependencies:

pip install -r ../requirements.txt

## 🗄️ MySQL Database Setup

Create the RoadSense AI database in MySQL:

```sql
CREATE DATABASE roadsense_db;

Make sure MySQL is running before starting the backend.

Configure the database connection according to the backend configuration.

## 🚀 Start FastAPI Backend

From the `Backend` directory, start the FastAPI development server:

```bash
uvicorn app.main:app --reload

The backend will run at:

http://127.0.0.1:8000

### 📚 FastAPI API Documentation

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs

The Swagger UI allows you to explore and test the available API endpoints.

## 💻 Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend

Install the required dependencies:

npm install

Start the development server:

npm run dev

The frontend will be available at the URL displayed by Vite, usually:

http://localhost:5173

## 🔌 API Endpoints

### 🚗 Accident APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/accidents/` | Retrieve accident records |
| `GET` | `/api/accidents/counts` | Retrieve accident count statistics |

### 📊 Analytics APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/summary` | Retrieve overall accident analytics |
| `GET` | `/api/analytics/by-city` | Retrieve accident statistics by city |
| `GET` | `/api/analytics/by-state` | Retrieve accident statistics by state |
| `GET` | `/api/analytics/by-cause` | Retrieve accident statistics by cause |
| `GET` | `/api/analytics/by-weather` | Retrieve accident statistics by weather |
| `GET` | `/api/analytics/by-road-type` | Retrieve accident statistics by road type |
| `GET` | `/api/analytics/by-time-period` | Retrieve accident statistics by time period |
| `GET` | `/api/analytics/by-severity` | Retrieve accident statistics by severity |

### 🤖 Prediction API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict/` | Predict accident severity and risk |

## 📊 Data Pipeline

```text
Raw Accident Dataset
        │
        ▼
Data Cleaning
        │
        ▼
Exploratory Data Analysis
        │
        ▼
Feature Processing
        │
        ▼
Model Training
        │
        ▼
Model Evaluation
        │
        ▼
Selected ML Model
        │
        ▼
FastAPI Prediction API
        │
        ▼
React Prediction Interface

## 📈 Analytics Pipeline

```text
MySQL Accident Records
        │
        ▼
     FastAPI
        │
        ▼
   Aggregation
        │
        ▼
 React + Recharts
        │
        ▼
Interactive Analytics

## 🗺️ Map Visualization

RoadSense AI uses **React Leaflet** to provide an interactive geographical representation of accident records.

At lower zoom levels, accident records are aggregated to avoid overwhelming the map with thousands of individual markers.

As the user zooms in, the visualization progressively reveals more detailed accident-level information.

This provides a balance between:

- ⚡ **Performance**
- 👁️ **Readability**
- 🌍 **Geographical Exploration**
- 🔎 **Individual Accident Inspection**

## 🔐 Security & Configuration

Sensitive configuration values should never be committed to GitHub.

Recommended environment variables include:

```env
DATABASE_URL=your_database_connection

## 🚧 Current Limitations

- 📉 The current ML model has moderate predictive performance.
- 📊 Accident prediction quality depends on the quality and distribution of historical data.
- 📦 The trained model file is not stored directly in the repository because of GitHub file-size restrictions.
- 💻 The application currently runs locally and requires the backend, frontend, and MySQL database to be configured.

## 🔮 Future Enhancements

Potential improvements include:

- 📍 **Real-time Accident Data Integration**
- 🚦 **Traffic-Density Integration**
- 🌦️ **Live Weather API Integration**
- 🛰️ **More Advanced Geospatial Analysis**
- 🧠 **Improved ML Models & Hyperparameter Tuning**
- 📱 **Mobile-Responsive Optimization**
- ☁️ **Cloud Deployment**
- 🔔 **Accident-Risk Alerts**
- 🗺️ **Predictive Risk Heatmaps**
- 📊 **Advanced Forecasting**
- 👥 **User Authentication & Personalized Dashboards**

## 🎓 Project Objectives

RoadSense AI was developed with the following objectives:

- 📊 **Analyze historical road accident patterns.**
- 🔍 **Identify major factors associated with accidents.**
- 🗺️ **Visualize accident distributions geographically.**
- 🔎 **Provide interactive accident exploration.**
- 🤖 **Build an ML-based accident severity prediction system.**
- 🔗 **Integrate analytics, database management, APIs, and machine learning into a single platform.**
- 🛡️ **Provide a foundation for future intelligent road-safety systems.**

## 💡 Why RoadSense AI?

RoadSense AI brings together multiple areas of Computer Science into one practical application:

```text
                 RoadSense AI
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
  Data Science   Web Development   Database
       │              │              │
       ▼              ▼              ▼
      ML          React/FastAPI     MySQL
       │              │              │
       └──────────────┼──────────────┘
                      ▼
              Road Safety Analytics

The project demonstrates the practical implementation of:

Data → Database → API → Machine Learning → Visualization → Decision Support

## 👩‍💻 Author

**Ishita**

🎓 **B.Tech – Computer Science & Engineering (AI/ML)**

### 💡 Areas of Interest

- 📊 **Data Analytics**
- 📈 **Data Science**
- 🤖 **Machine Learning**
- 🧠 **Artificial Intelligence**
- 💻 **Full-Stack Development**

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.