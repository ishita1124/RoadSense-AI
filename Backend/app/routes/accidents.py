from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import Optional

from ..database import get_db
from ..models import Accident


router = APIRouter(
    prefix="/api/accidents",
    tags=["Accidents"]
)


# ============================================================
# COMMON FILTER FUNCTION
# ============================================================

def apply_accident_filters(
    query,
    city: Optional[str] = None,
    state: Optional[str] = None,
    severity: Optional[str] = None,
    risk_band: Optional[str] = None,
    cause: Optional[str] = None,
    weather: Optional[str] = None,
    road_type: Optional[str] = None,
):

    if city and city.strip() and city.strip().lower() != "all":
        query = query.filter(
            Accident.city.ilike(city.strip())
        )

    if state and state.strip() and state.strip().lower() != "all":
        query = query.filter(
            Accident.state.ilike(state.strip())
        )

    if severity and severity.strip() and severity.strip().lower() != "all":
        query = query.filter(
            Accident.accident_severity.ilike(
                severity.strip()
            )
        )

    if risk_band and risk_band.strip() and risk_band.strip().lower() != "all":
        query = query.filter(
            Accident.risk_band.ilike(
                risk_band.strip()
            )
        )

    if cause and cause.strip() and cause.strip().lower() != "all":
        query = query.filter(
            Accident.cause.ilike(
                cause.strip()
            )
        )

    if weather and weather.strip() and weather.strip().lower() != "all":
        query = query.filter(
            Accident.weather.ilike(
                weather.strip()
            )
        )

    if road_type and road_type.strip() and road_type.strip().lower() != "all":
        query = query.filter(
            Accident.road_type.ilike(
                road_type.strip()
            )
        )

    return query


# ============================================================
# GET ACCIDENT RECORDS
#
# Used by:
# - Accident Explorer
# - Other components that need individual records
#
# IMPORTANT:
# limit is now allowed up to 50,000.
#
# Your current database has around 20,005 records, so the
# Explorer can retrieve all current records.
# ============================================================

@router.get("/")
def get_accidents(
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    risk_band: Optional[str] = Query(None),
    cause: Optional[str] = Query(None),
    weather: Optional[str] = Query(None),
    road_type: Optional[str] = Query(None),

    limit: Optional[int] = Query(
        default=None,
        ge=1,
        le=50000,
        description="Maximum number of records to return."
    ),

    offset: int = Query(
        default=0,
        ge=0
    ),

    db: Session = Depends(get_db)
):

    query = db.query(Accident)


    # ========================================================
    # FILTERS
    # ========================================================

    query = apply_accident_filters(
        query=query,
        city=city,
        state=state,
        severity=severity,
        risk_band=risk_band,
        cause=cause,
        weather=weather,
        road_type=road_type,
    )


    # ========================================================
    # NEWEST RECORD FIRST
    # ========================================================

    query = query.order_by(
        Accident.accident_id.desc()
    )


    # ========================================================
    # DATABASE PAGINATION
    #
    # If limit is supplied, SQL limits the result.
    # If Explorer asks for 50,000, all 20,005 current rows
    # will be returned.
    # ========================================================

    if offset:
        query = query.offset(offset)

    if limit is not None:
        query = query.limit(limit)


    accidents = query.all()


    # ========================================================
    # RETURN REAL DATABASE RECORDS
    # ========================================================

    return [

        {
            "accident_id": accident.accident_id,

            "city": accident.city,

            "state": accident.state,

            "latitude": (
                float(accident.latitude)
                if accident.latitude is not None
                else None
            ),

            "longitude": (
                float(accident.longitude)
                if accident.longitude is not None
                else None
            ),

            "date": (
                str(accident.date)
                if accident.date is not None
                else None
            ),

            "time": (
                str(accident.time)
                if accident.time is not None
                else None
            ),

            "accident_severity":
                accident.accident_severity,

            "cause":
                accident.cause,

            "weather":
                accident.weather,

            "road_type":
                accident.road_type,

            "risk_score": (
                float(accident.risk_score)
                if accident.risk_score is not None
                else 0
            ),

            "risk_band":
                accident.risk_band,
        }

        for accident in accidents
    ]


# ============================================================
# REAL DATABASE COUNTS
#
# Used by the map cards.
#
# These values come directly from MySQL.
# ============================================================

@router.get("/counts")
def get_accident_counts(

    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    risk_band: Optional[str] = Query(None),
    cause: Optional[str] = Query(None),
    weather: Optional[str] = Query(None),
    road_type: Optional[str] = Query(None),

    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # TOTAL
    # --------------------------------------------------------

    total_query = db.query(Accident)

    total_query = apply_accident_filters(
        total_query,
        city,
        state,
        severity,
        risk_band,
        cause,
        weather,
        road_type,
    )

    total_accidents = (
        total_query
        .with_entities(
            func.count(
                Accident.accident_id
            )
        )
        .scalar()
        or 0
    )


    # --------------------------------------------------------
    # FATAL
    # --------------------------------------------------------

    fatal_query = db.query(Accident)

    fatal_query = apply_accident_filters(
        fatal_query,
        city,
        state,
        severity,
        risk_band,
        cause,
        weather,
        road_type,
    )

    fatal_count = (
        fatal_query
        .filter(
            Accident.accident_severity.ilike("fatal")
        )
        .with_entities(
            func.count(
                Accident.accident_id
            )
        )
        .scalar()
        or 0
    )


    # --------------------------------------------------------
    # MAJOR
    # --------------------------------------------------------

    major_query = db.query(Accident)

    major_query = apply_accident_filters(
        major_query,
        city,
        state,
        severity,
        risk_band,
        cause,
        weather,
        road_type,
    )

    major_count = (
        major_query
        .filter(
            Accident.accident_severity.ilike("major")
        )
        .with_entities(
            func.count(
                Accident.accident_id
            )
        )
        .scalar()
        or 0
    )


    # --------------------------------------------------------
    # MINOR
    # --------------------------------------------------------

    minor_query = db.query(Accident)

    minor_query = apply_accident_filters(
        minor_query,
        city,
        state,
        severity,
        risk_band,
        cause,
        weather,
        road_type,
    )

    minor_count = (
        minor_query
        .filter(
            Accident.accident_severity.ilike("minor")
        )
        .with_entities(
            func.count(
                Accident.accident_id
            )
        )
        .scalar()
        or 0
    )


    return {
        "total_accidents": int(total_accidents),
        "fatal": int(fatal_count),
        "major": int(major_count),
        "minor": int(minor_count),
    }


# ============================================================
# MAP SUMMARY
#
# IMPORTANT:
#
# The map does NOT receive 20,005 individual records.
#
# MySQL groups records by:
#
#       CITY + STATE
#
# and calculates:
#
#       REAL accident count
#       REAL fatal count
#       REAL major count
#       REAL minor count
#       REAL average latitude
#       REAL average longitude
#
# This makes the map fast and keeps the numbers accurate.
# ============================================================

@router.get("/map-summary")
def get_map_summary(

    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    risk_band: Optional[str] = Query(None),
    cause: Optional[str] = Query(None),
    weather: Optional[str] = Query(None),
    road_type: Optional[str] = Query(None),

    db: Session = Depends(get_db)
):

    city_expr = func.coalesce(
        Accident.city,
        "Unknown"
    )

    state_expr = func.coalesce(
        Accident.state,
        "Unknown"
    )


    query = db.query(

        city_expr.label("city"),

        state_expr.label("state"),

        func.avg(
            Accident.latitude
        ).label("latitude"),

        func.avg(
            Accident.longitude
        ).label("longitude"),

        func.count(
            Accident.accident_id
        ).label("total_accidents"),

        func.sum(
            case(
                (
                    func.lower(
                        Accident.accident_severity
                    ) == "fatal",
                    1
                ),
                else_=0
            )
        ).label("fatal"),

        func.sum(
            case(
                (
                    func.lower(
                        Accident.accident_severity
                    ) == "major",
                    1
                ),
                else_=0
            )
        ).label("major"),

        func.sum(
            case(
                (
                    func.lower(
                        Accident.accident_severity
                    ) == "minor",
                    1
                ),
                else_=0
            )
        ).label("minor"),
    )


    # ========================================================
    # APPLY FILTERS
    # ========================================================

    query = apply_accident_filters(
        query=query,
        city=city,
        state=state,
        severity=severity,
        risk_band=risk_band,
        cause=cause,
        weather=weather,
        road_type=road_type,
    )


    # ========================================================
    # GROUP BY CITY + STATE
    # ========================================================

    query = query.group_by(
        city_expr,
        state_expr
    )


    # ========================================================
    # ONLY LOCATIONS WITH VALID COORDINATES
    # ========================================================

    query = query.having(
        func.avg(
            Accident.latitude
        ).isnot(None)
    )

    query = query.having(
        func.avg(
            Accident.longitude
        ).isnot(None)
    )


    # ========================================================
    # HIGHEST COUNT FIRST
    # ========================================================

    query = query.order_by(
        func.count(
            Accident.accident_id
        ).desc()
    )


    results = query.all()


    # ========================================================
    # JSON RESPONSE
    # ========================================================

    return [

        {
            "city": row.city,

            "state": row.state,

            "latitude": (
                float(row.latitude)
                if row.latitude is not None
                else None
            ),

            "longitude": (
                float(row.longitude)
                if row.longitude is not None
                else None
            ),

            "total_accidents": int(
                row.total_accidents or 0
            ),

            "fatal": int(
                row.fatal or 0
            ),

            "major": int(
                row.major or 0
            ),

            "minor": int(
                row.minor or 0
            ),
        }

        for row in results
    ]