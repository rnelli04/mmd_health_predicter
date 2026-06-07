import sys
import json
import joblib
import pandas as pd

# NEW MODEL
model = joblib.load("ml/hdd_failure_model2.pkl")


def get_brand(model_name):

    model_name = str(model_name)

    if model_name.startswith("ST") or "Seagate" in model_name:
        return "Seagate"

    if model_name.startswith("WDC") or model_name.startswith("WD"):
        return "WD"

    if model_name.startswith("HGST"):
        return "HGST"

    if model_name.startswith("TOSHIBA"):
        return "Toshiba"

    return "Other"


smart = json.loads(sys.argv[1])

brand = get_brand(
    smart.get("model", "")
)

row = {
    "rawReadErrorRate": smart.get("rawReadErrorRate", 0),
    "spinUpTime": smart.get("spinUpTime", 0),
    "startStopCount": smart.get("startStopCount", 0),
    "reallocatedSectors": smart.get("reallocatedSectors", 0),
    "seekErrorRate": smart.get("seekErrorRate", 0),
    "powerOnHours": smart.get("powerOnHours", 0),
    "spinRetryCount": smart.get("spinRetryCount", 0),
    "powerCycleCount": smart.get("powerCycleCount", 0),
    "reportedUncorrect": smart.get("reportedUncorrect", 0),
    "loadCycleCount": smart.get("loadCycleCount", 0),
    "temperature": smart.get("temperature", 0),
    "pendingSectors": smart.get("pendingSectors", 0),
    "offlineUncorrectable": smart.get("offlineUncorrectable", 0),
    "crcErrorCount": smart.get("crcErrorCount", 0),

    "brand_HGST": 0,
    "brand_Other": 0,
    "brand_Seagate": 0,
    "brand_Toshiba": 0,
    "brand_WD": 0
}

brand_column = f"brand_{brand}"

if brand_column in row:
    row[brand_column] = 1
else:
    row["brand_Other"] = 1

df = pd.DataFrame([row])

failure_probability = model.predict_proba(df)[0][1]
prediction = model.predict(df)[0]

result = {
    "prediction": int(prediction),
    "failureProbability": round(
        float(failure_probability) * 100,
        2
    )
}

print(json.dumps(result))