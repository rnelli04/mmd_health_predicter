import sys
import json
import joblib
import pandas as pd

model = joblib.load(
    "ml/hdd_failure_model.pkl"
)

data = json.loads(
    sys.argv[1]
)

df = pd.DataFrame([data])


failure_probability = (
    model.predict_proba(df)[0][1]
)

prediction = int(
    model.predict(df)[0]
)

result = {
    "prediction": prediction,
    "failureProbability": round(
        float(failure_probability) * 100,
        2
    )
}

print(
    json.dumps(result)
)