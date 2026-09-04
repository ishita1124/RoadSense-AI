const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// ML PREDICTION
// ============================================================

export const predictAccident = async (data) => {

  try {

    const response = await fetch(
      `${API_BASE_URL}/predict/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );


    if (!response.ok) {

      const errorData =
        await response.json().catch(
          () => null
        );


      throw new Error(
        errorData?.detail
          ? typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(
                errorData.detail
              )
          : `Prediction API Error: ${response.status}`
      );

    }


    return await response.json();

  } catch (error) {

    console.error(
      "Prediction API Error:",
      error
    );

    throw error;

  }

};


// ============================================================
// GENERIC GET REQUEST
// ============================================================

const getAnalytics = async (endpoint) => {

  try {

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`
    );


    if (!response.ok) {

      const errorData =
        await response.json().catch(
          () => null
        );


      throw new Error(
        errorData?.detail
          ? typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(
                errorData.detail
              )
          : `API Error: ${response.status}`
      );

    }


    return await response.json();

  } catch (error) {

    console.error(
      `API Error (${endpoint}):`,
      error
    );

    throw error;

  }

};


// ============================================================
// DASHBOARD ANALYTICS
// ============================================================

export const getSummary = () =>
  getAnalytics(
    "/api/analytics/summary"
  );


export const getAccidentsByCity = () =>
  getAnalytics(
    "/api/analytics/by-city"
  );


export const getAccidentsByState = () =>
  getAnalytics(
    "/api/analytics/by-state"
  );


export const getAccidentsByCause = () =>
  getAnalytics(
    "/api/analytics/by-cause"
  );


export const getAccidentsBySeverity = () =>
  getAnalytics(
    "/api/analytics/by-severity"
  );


export const getAccidentsByWeather = () =>
  getAnalytics(
    "/api/analytics/by-weather"
  );


export const getAccidentsByRoadType = () =>
  getAnalytics(
    "/api/analytics/by-road-type"
  );


export const getAccidentsByTimePeriod = () =>
  getAnalytics(
    "/api/analytics/by-time-period"
  );


// ============================================================
// ACCIDENT DATA EXPLORER + MAP
// ============================================================

export const getAccidents = async (
  params = {}
) => {

  try {

    const searchParams =
      new URLSearchParams();


    Object.entries(params).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {

          searchParams.append(
            key,
            String(value)
          );

        }

      }
    );


    const queryString =
      searchParams.toString();


    const url =
      queryString
        ? `${API_BASE_URL}/api/accidents/?${queryString}`
        : `${API_BASE_URL}/api/accidents/`;


    const response =
      await fetch(url);


    if (!response.ok) {

      const errorData =
        await response.json().catch(
          () => null
        );


      throw new Error(
        errorData?.detail
          ? typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(
                errorData.detail
              )
          : `Failed to fetch accident records: ${response.status}`
      );

    }


    const data =
      await response.json();


    /*
      Your FastAPI endpoint currently returns
      the records directly as an array.

      This also supports wrapped responses
      just in case the backend is changed later.
    */

    if (Array.isArray(data)) {
      return data;
    }


    if (Array.isArray(data?.accidents)) {
      return data.accidents;
    }


    if (Array.isArray(data?.data)) {
      return data.data;
    }


    return [];

  } catch (error) {

    console.error(
      "Accident API Error:",
      error
    );

    throw error;

  }

};