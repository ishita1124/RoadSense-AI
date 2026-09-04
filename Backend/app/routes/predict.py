from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

import joblib
import pandas as pd
import os

from ..database import SessionLocal
from ..models import Accident


router = APIRouter(
    prefix="/predict",
    tags=["ML Prediction"]
)


# ============================================================
# DATABASE
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

MODEL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../../ML/roadsense_severity_model.pkl"
    )
)

try:
    model = joblib.load(MODEL_PATH)

    print("RoadSense ML model loaded successfully.")

except Exception as e:
    model = None

    print(
        f"WARNING: Could not load ML model: {e}"
    )


# ============================================================
# REQUEST MODEL
# ============================================================

class AccidentPredictionRequest(BaseModel):

    city: str
    state: str

    latitude: float
    longitude: float

    hour: int

    day_of_week: str
    is_weekend: int

    road_type: str
    lanes: int
    traffic_signal: int

    weather: str
    visibility: str
    temperature: float

    traffic_density: str
    cause: str

    vehicles_involved: int
    casualties: int

    is_peak_hour: int

    festival: str

    year: int
    month: int
    quarter: int
    day: int

    time_period: str


# ============================================================
# PREDICTION ENDPOINT
# ============================================================

@router.post("/")
def predict_accident_severity(
    request: AccidentPredictionRequest,
    db: Session = Depends(get_db)
):

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="ML model could not be loaded."
        )

    try:

        # ====================================================
        # CREATE DATAFRAME
        # ====================================================

        data = {

            "city": [request.city],
            "state": [request.state],

            "latitude": [request.latitude],
            "longitude": [request.longitude],

            "hour": [request.hour],

            "day_of_week": [
                request.day_of_week
            ],

            "is_weekend": [
                request.is_weekend
            ],

            "road_type": [
                request.road_type
            ],

            "lanes": [
                request.lanes
            ],

            "traffic_signal": [
                request.traffic_signal
            ],

            "weather": [
                request.weather
            ],

            "visibility": [
                request.visibility
            ],

            "temperature": [
                request.temperature
            ],

            "traffic_density": [
                request.traffic_density
            ],

            "cause": [
                request.cause
            ],

            "vehicles_involved": [
                request.vehicles_involved
            ],

            "casualties": [
                request.casualties
            ],

            "is_peak_hour": [
                request.is_peak_hour
            ],

            "festival": [
                request.festival
            ],

            "year": [
                request.year
            ],

            "month": [
                request.month
            ],

            "quarter": [
                request.quarter
            ],

            "day": [
                request.day
            ],

            "time_period": [
                request.time_period
            ]
        }

        df = pd.DataFrame(data)


        # ====================================================
        # ENGINEERED FEATURES
        # ====================================================

        df["casualties_per_vehicle"] = (
            df["casualties"] /
            df["vehicles_involved"].replace(0, 1)
        )

        df["casualty_vehicle_ratio"] = (
            df["casualties"] /
            df["vehicles_involved"].replace(0, 1)
        )

        df["is_night"] = (
            (df["hour"] >= 22) |
            (df["hour"] <= 5)
        ).astype(int)

        df["is_high_traffic"] = (
            df["traffic_density"]
            .str.lower()
            .eq("high")
        ).astype(int)

        df["is_low_visibility"] = (
            df["visibility"]
            .str.lower()
            .eq("low")
        ).astype(int)

        df["has_casualties"] = (
            df["casualties"] > 0
        ).astype(int)

        df["multiple_vehicles"] = (
            df["vehicles_involved"] > 1
        ).astype(int)

        df["peak_weekend"] = (
            (df["is_peak_hour"] == 1) &
            (df["is_weekend"] == 1)
        ).astype(int)

        df["traffic_visibility_risk"] = (
            df["is_high_traffic"] +
            df["is_low_visibility"]
        )


        # ====================================================
        # ML PREDICTION
        # ====================================================

        prediction = model.predict(df)[0]

        severity = str(prediction).lower()


        # ====================================================
        # PROBABILITIES
        # ====================================================

        probabilities = {}

        if hasattr(model, "predict_proba"):

            probability_values = (
                model.predict_proba(df)[0]
            )

            classes = model.classes_

            probabilities = {

                str(cls): round(
                    float(prob),
                    4
                )

                for cls, prob
                in zip(
                    classes,
                    probability_values
                )
            }


        # ====================================================
        # CONFIDENCE
        # ====================================================

        confidence = None

        if probabilities:

            confidence = round(
                max(probabilities.values()),
                4
            )


        # ====================================================
        # RISK BAND
        # ====================================================

        if severity == "fatal":

            risk_band = "Very High"

        elif severity == "major":

            risk_band = "High"

        else:

            risk_band = "Medium"


        # ====================================================
        # RISK SCORE
        # ====================================================
        #
        # Use model confidence as the basis for the
        # stored risk score.
        #
        # This keeps the score between 0 and 1.
        # ====================================================

        risk_score = confidence or 0


        # ====================================================
        # SEVERITY FLAGS
        # ====================================================

        is_severe = (
            1
            if severity in ["major", "fatal"]
            else 0
        )

        is_fatal = (
            1
            if severity == "fatal"
            else 0
        )


        # ====================================================
        # DATE / TIME
        # ====================================================

        accident_date = datetime(
            request.year,
            request.month,
            request.day
        ).date()

        accident_time = datetime.strptime(
            f"{request.hour}:00",
            "%H:%M"
        ).time()


        accident_datetime = datetime(
            request.year,
            request.month,
            request.day,
            request.hour,
            0
        )


        # ====================================================
        # MONTH NAME
        # ====================================================

        month_name = accident_date.strftime(
            "%B"
        )


        # ====================================================
        # SAVE PREDICTION
        # ====================================================

        accident = Accident(

            city=request.city,
            state=request.state,

            latitude=request.latitude,
            longitude=request.longitude,

            date=accident_date,
            time=accident_time,
            datetime=accident_datetime,

            year=request.year,
            month=request.month,
            month_name=month_name,
            quarter=request.quarter,
            day=request.day,
            hour=request.hour,

            day_of_week=request.day_of_week,
            time_period=request.time_period,

            is_weekend=request.is_weekend,

            road_type=request.road_type,
            lanes=request.lanes,
            traffic_signal=request.traffic_signal,

            weather=request.weather,
            visibility=request.visibility,
            temperature=int(
                request.temperature
            ),

            traffic_density=request.traffic_density,

            cause=request.cause,
            accident_severity=severity,

            is_severe=is_severe,
            is_fatal=is_fatal,

            vehicles_involved=(
                request.vehicles_involved
            ),

            casualties=request.casualties,

            is_peak_hour=request.is_peak_hour,

            festival=request.festival,

            risk_score=risk_score,
            risk_band=risk_band
        )


        db.add(accident)

        db.commit()

        db.refresh(accident)


        # ====================================================
        # RESPONSE
        # ====================================================

        return {

            "success": True,

            "message": (
                "Prediction completed and "
                "saved successfully."
            ),

            "prediction": {

                "severity": severity,

                "risk_band": risk_band,

                "confidence": confidence,

                "risk_score": risk_score

            },

            "probabilities": probabilities,

            "accident_id": accident.accident_id,

            "input": {

                "city": request.city,

                "state": request.state,

                "weather": request.weather,

                "visibility": request.visibility,

                "traffic_density":
                    request.traffic_density,

                "cause": request.cause,

                "vehicles_involved":
                    request.vehicles_involved,

                "casualties":
                    request.casualties

            }

        }


    except Exception as e:

        db.rollback()

        print(
            f"Prediction failed: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Prediction failed: {str(e)}"
            )
        )