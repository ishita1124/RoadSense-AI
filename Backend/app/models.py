from sqlalchemy import Column, Integer, String, DECIMAL, Date, Time, DateTime
from .database import engine
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Accident(Base):
    __tablename__ = "accidents"

    accident_id = Column(Integer, primary_key=True)

    city = Column(String(50))
    state = Column(String(50))

    latitude = Column(DECIMAL(10, 6))
    longitude = Column(DECIMAL(10, 6))

    date = Column(Date)
    time = Column(Time)
    datetime = Column(DateTime)

    year = Column(Integer)
    month = Column(Integer)
    month_name = Column(String(20))
    quarter = Column(Integer)
    day = Column(Integer)
    hour = Column(Integer)

    day_of_week = Column(String(20))
    time_period = Column(String(20))

    is_weekend = Column(Integer)

    road_type = Column(String(20))
    lanes = Column(Integer)
    traffic_signal = Column(Integer)

    weather = Column(String(20))
    visibility = Column(String(20))
    temperature = Column(Integer)
    traffic_density = Column(String(20))

    cause = Column(String(50))
    accident_severity = Column(String(20))

    is_severe = Column(Integer)
    is_fatal = Column(Integer)

    vehicles_involved = Column(Integer)
    casualties = Column(Integer)

    is_peak_hour = Column(Integer)

    festival = Column(String(30))

    risk_score = Column(DECIMAL(4, 2))
    risk_band = Column(String(20))