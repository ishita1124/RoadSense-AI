from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from ..database import get_db
from ..models import Accident


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


# ============================================================
# OVERALL KPIs
# ============================================================

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):

    total_accidents = db.query(
        func.count(Accident.accident_id)
    ).scalar() or 0

    fatal_accidents = db.query(
        func.count(Accident.accident_id)
    ).filter(
        func.lower(Accident.accident_severity) == "fatal"
    ).scalar() or 0

    major_accidents = db.query(
        func.count(Accident.accident_id)
    ).filter(
        func.lower(Accident.accident_severity) == "major"
    ).scalar() or 0

    minor_accidents = db.query(
        func.count(Accident.accident_id)
    ).filter(
        func.lower(Accident.accident_severity) == "minor"
    ).scalar() or 0

    avg_risk = db.query(
        func.avg(Accident.risk_score)
    ).scalar()

    return {
        "total_accidents": total_accidents,
        "fatal_accidents": fatal_accidents,
        "major_accidents": major_accidents,
        "minor_accidents": minor_accidents,
        "average_risk_score": round(
            float(avg_risk or 0),
            3
        )
    }


# ============================================================
# ACCIDENTS BY CITY
# ============================================================

@router.get("/by-city")
def accidents_by_city(db: Session = Depends(get_db)):

    results = db.query(
        Accident.city,
        func.count(
            Accident.accident_id
        ).label("accident_count")
    ).filter(
        Accident.city.isnot(None)
    ).group_by(
        Accident.city
    ).order_by(
        func.count(
            Accident.accident_id
        ).desc()
    ).all()

    return [
        {
            "city": city,
            "accident_count": count
        }
        for city, count in results
    ]


# ============================================================
# ACCIDENTS BY STATE
# ============================================================

@router.get("/by-state")
def accidents_by_state(db: Session = Depends(get_db)):

    results = db.query(
        Accident.state,
        func.count(
            Accident.accident_id
        ).label("accident_count")
    ).filter(
        Accident.state.isnot(None)
    ).group_by(
        Accident.state
    ).order_by(
        func.count(
            Accident.accident_id
        ).desc()
    ).all()

    return [
        {
            "state": state,
            "accident_count": count
        }
        for state, count in results
    ]


# ============================================================
# ACCIDENTS BY CAUSE
# ============================================================

@router.get("/by-cause")
def accidents_by_cause(db: Session = Depends(get_db)):

    results = db.query(
        Accident.cause,
        func.count(
            Accident.accident_id
        ).label("accident_count")
    ).filter(
        Accident.cause.isnot(None)
    ).group_by(
        Accident.cause
    ).order_by(
        func.count(
            Accident.accident_id
        ).desc()
    ).all()

    return [
        {
            "cause": cause,
            "accident_count": count
        }
        for cause, count in results
    ]


# ============================================================
# ACCIDENTS BY SEVERITY
# ============================================================

@router.get("/by-severity")
def accidents_by_severity(db: Session = Depends(get_db)):

    severity_order = case(
        (func.lower(Accident.accident_severity) == "fatal", 1),
        (func.lower(Accident.accident_severity) == "major", 2),
        (func.lower(Accident.accident_severity) == "minor", 3),
        else_=4
    )

    results = db.query(
        Accident.accident_severity,
        func.count(
            Accident.accident_id
        ).label("accident_count")
    ).filter(
        Accident.accident_severity.isnot(None)
    ).group_by(
        Accident.accident_severity
    ).order_by(
        severity_order
    ).all()

    return [
        {
            "severity": severity,
            "accident_count": count
        }
        for severity, count in results
    ]


# ============================================================
# ACCIDENTS BY WEATHER
# ============================================================

@router.get("/by-weather")
def accidents_by_weather(db: Session = Depends(get_db)):

    results = db.query(
        Accident.weather,
        func.count(
            Accident.accident_id
        ).label("accident_count")
    ).filter(
        Accident.weather.isnot(None)
    ).group_by(
        Accident.weather
    ).order_by(
        func.count(
            Accident.accident_id
        ).desc()
    ).all()

    return [
        {
            "weather": weather,
            "accident_count": count
        }
        for weather, count in results
    ]


# ============================================================
# ACCIDENTS BY ROAD TYPE
# ============================================================

@router.get("/by-road-type")
def accidents_by_road_type(db: Session = Depends(get_db)):

    results = db.query(
        Accident.road_type,
        func.count(
            Accident.accident_id
        ).label("accident_count")
    ).filter(
        Accident.road_type.isnot(None)
    ).group_by(
        Accident.road_type
    ).order_by(
        func.count(
            Accident.accident_id
        ).desc()
    ).all()

    return [
        {
            "road_type": road_type,
            "accident_count": count
        }
        for road_type, count in results
    ]


# ============================================================
# ACCIDENTS BY TIME PERIOD
# ============================================================

@router.get("/by-time-period")
def accidents_by_time_period(db: Session = Depends(get_db)):

    results = db.query(
        Accident.time_period,
        func.count(
            Accident.accident_id
        ).label("accident_count")
    ).filter(
        Accident.time_period.isnot(None)
    ).group_by(
        Accident.time_period
    ).order_by(
        func.count(
            Accident.accident_id
        ).desc()
    ).all()

    return [
        {
            "time_period": time_period,
            "accident_count": count
        }
        for time_period, count in results
    ]