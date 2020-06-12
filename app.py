from flask import Flask, render_template, jsonify
import numpy as np
from config import AWS_password 
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#################################################
# Database Setup
#################################################
engine = create_engine(f"postgresql://postgres:{AWS_password}@database-1.cft8wszdkeh0.us-east-2.rds.amazonaws.com:5432/postgres")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Weather = Base.classes.weather
Pollution = Base.classes.pollution
Co2_data = Base.classes.co2_aqi
Coordinates = Base.classes.states_cord

app=Flask(__name__) #, static_url_path="", static_folder="web/static", template_folder="templates")


@app.route("/")
def home():
    return (render_template("index.html"))

@app.route("/timeline")
def timeline():
    return (render_template("timeline.html"))

@app.route("/map")
def heatmap():
    return (render_template("map.html"))

@app.route("/pie")
def pie():
    return (render_template("pie.html"))


@app.route("/api/weather")
def weather():
    
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all passengers
    results = session.query(Weather.state, Weather.year, Weather.average_temp).all()

    session.close()

    all_temp = []
    for state, year, average_temp in results:
        state_dict = {}
        state_dict["state"] = state
        state_dict["year"] = year
        state_dict["avg_temp"] = average_temp
        all_temp.append(state_dict)


    return jsonify(all_temp)

@app.route("/api/pollution")
def pollution():
    
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all passengers
    results = session.query(Pollution.state, Pollution.year, Pollution.no2, Pollution.o3, Pollution.so2, Pollution.co, Coordinates.lat, Coordinates.lng).join(Coordinates, Coordinates.city == Pollution.state).all()

    session.close()

    all_aqi = []
    for state, year, no2, o3, so2, co, lat, lng in results:
        state_dict = {}
        state_dict["state"] = state
        state_dict["year"] = year
        state_dict["no2"] = no2
        state_dict["so2"] = so2
        state_dict["o3"] = o3
        state_dict["co"] = co
        state_dict["coord"] = [lat, lng]
        all_aqi.append(state_dict)


    return jsonify(all_aqi)

@app.route("/api/co2_aqi")
def co2_aqi():
    
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all passengers
    results = session.query(Co2_data.state, Co2_data.year, Co2_data.co2).all()

    session.close()

    all_co2_aqi = []
    for state, year, co2 in results:
        state_dict = {}
        state_dict["state"] = state
        state_dict["year"] = year
        state_dict["co2"] = co2
        all_co2_aqi.append(state_dict)


    return jsonify(all_co2_aqi)


if __name__ == "__main__":
    app.run(debug=True)