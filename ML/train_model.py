import pandas as pd
import numpy as np
import joblib
import warnings

warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

from sklearn.ensemble import (
    RandomForestClassifier,
    ExtraTreesClassifier,
    HistGradientBoostingClassifier
)

from sklearn.metrics import (
    accuracy_score,
    f1_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix
)

from xgboost import XGBClassifier


print("=" * 70)
print("ROADSENSE AI - FINAL ML MODEL OPTIMIZATION")
print("=" * 70)


# ============================================================
# 1. LOAD DATA
# ============================================================

print("\nLoading dataset...")

df = pd.read_csv(
    "dataset/cleaned/roadsense_ai_cleaned.csv"
)

print(f"Dataset shape: {df.shape}")


# ============================================================
# 2. TARGET
# ============================================================

target = "accident_severity"

print("\nTarget distribution:")
print(df[target].value_counts())


# ============================================================
# 3. FEATURE ENGINEERING
# ============================================================

print("\nCreating engineered features...")

df["casualties_per_vehicle"] = (
    df["casualties"] /
    df["vehicles_involved"].replace(0, 1)
)

df["casualty_vehicle_ratio"] = (
    df["casualties"] /
    (df["vehicles_involved"] + 1)
)

df["is_night"] = (
    (df["hour"] < 6) |
    (df["hour"] >= 22)
).astype(int)

df["is_high_traffic"] = (
    df["traffic_density"] == "high"
).astype(int)

df["is_low_visibility"] = (
    df["visibility"] == "low"
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

print("Engineered features created successfully.")


# ============================================================
# 4. FEATURES
# ============================================================

features = [
    "city",
    "state",
    "latitude",
    "longitude",
    "hour",
    "day_of_week",
    "is_weekend",
    "road_type",
    "lanes",
    "traffic_signal",
    "weather",
    "visibility",
    "temperature",
    "traffic_density",
    "cause",
    "vehicles_involved",
    "casualties",
    "is_peak_hour",
    "festival",
    "year",
    "month",
    "quarter",
    "day",
    "time_period",

    "casualties_per_vehicle",
    "casualty_vehicle_ratio",
    "is_night",
    "is_high_traffic",
    "is_low_visibility",
    "has_casualties",
    "multiple_vehicles",
    "peak_weekend",
    "traffic_visibility_risk"
]

X = df[features]
y = df[target]

print("\nFeatures being used:")
print(features)


# ============================================================
# 5. CATEGORICAL FEATURES
# ============================================================

categorical_features = [
    "city",
    "state",
    "day_of_week",
    "road_type",
    "weather",
    "visibility",
    "traffic_density",
    "cause",
    "festival",
    "time_period"
]

numerical_features = [
    "latitude",
    "longitude",
    "hour",
    "is_weekend",
    "lanes",
    "traffic_signal",
    "temperature",
    "vehicles_involved",
    "casualties",
    "is_peak_hour",
    "year",
    "month",
    "quarter",
    "day",
    "casualties_per_vehicle",
    "casualty_vehicle_ratio",
    "is_night",
    "is_high_traffic",
    "is_low_visibility",
    "has_casualties",
    "multiple_vehicles",
    "peak_weekend",
    "traffic_visibility_risk"
]


# ============================================================
# 6. TRAIN TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")


# ============================================================
# 7. PREPROCESSING
# ============================================================

numeric_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]
)

categorical_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            )
        )
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        (
            "num",
            numeric_transformer,
            numerical_features
        ),
        (
            "cat",
            categorical_transformer,
            categorical_features
        )
    ]
)


# ============================================================
# 8. LABEL ENCODING
# ============================================================

label_map = {
    "fatal": 0,
    "major": 1,
    "minor": 2
}

inverse_label_map = {
    0: "fatal",
    1: "major",
    2: "minor"
}

y_train_encoded = y_train.map(label_map)
y_test_encoded = y_test.map(label_map)

print("\nTarget encoding:")
print("fatal -> 0")
print("major -> 1")
print("minor -> 2")


# ============================================================
# 9. MODELS
# ============================================================

models = {

    # --------------------------------------------------------
    # RANDOM FOREST
    # --------------------------------------------------------

    "Random Forest Final": RandomForestClassifier(
        n_estimators=700,
        max_depth=25,
        min_samples_split=3,
        min_samples_leaf=1,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    ),


    # --------------------------------------------------------
    # EXTRA TREES
    # --------------------------------------------------------

    "Extra Trees Final": ExtraTreesClassifier(
        n_estimators=700,
        max_depth=30,
        min_samples_split=3,
        min_samples_leaf=1,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    ),


    # --------------------------------------------------------
    # HIST GRADIENT BOOSTING
    # --------------------------------------------------------

    "Hist Gradient Boosting Final":
        HistGradientBoostingClassifier(
            max_iter=400,
            learning_rate=0.05,
            max_leaf_nodes=25,
            min_samples_leaf=20,
            l2_regularization=2.0,
            random_state=42
        ),


    # --------------------------------------------------------
    # XGBOOST
    # --------------------------------------------------------

    "XGBoost Final": XGBClassifier(
        n_estimators=500,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=3,
        gamma=0.1,
        reg_alpha=0.1,
        reg_lambda=2.0,

        objective="multi:softprob",
        num_class=3,

        eval_metric="mlogloss",

        random_state=42,
        n_jobs=-1
    )
}


# ============================================================
# 10. TRAIN MODELS
# ============================================================

results = []
trained_models = {}

for model_name, model in models.items():

    print("\n")
    print("=" * 70)
    print(model_name)
    print("=" * 70)

    # --------------------------------------------------------
    # XGBoost needs encoded target
    # --------------------------------------------------------

    if "XGBoost" in model_name:

        pipeline = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("model", model)
            ]
        )

        print("\nTraining model...")

        pipeline.fit(
            X_train,
            y_train_encoded
        )

        y_pred_encoded = pipeline.predict(X_test)

        y_pred = pd.Series(
            y_pred_encoded
        ).map(
            inverse_label_map
        ).values

    else:

        pipeline = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("model", model)
            ]
        )

        print("\nTraining model...")

        pipeline.fit(
            X_train,
            y_train
        )

        y_pred = pipeline.predict(X_test)

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    accuracy = accuracy_score(
        y_test,
        y_pred
    )

    macro_f1 = f1_score(
        y_test,
        y_pred,
        average="macro"
    )

    weighted_f1 = f1_score(
        y_test,
        y_pred,
        average="weighted"
    )

    balanced_accuracy = balanced_accuracy_score(
        y_test,
        y_pred
    )

    # Balanced score gives equal importance to:
    # accuracy + macro F1 + balanced accuracy

    balanced_score = (
        accuracy +
        macro_f1 +
        balanced_accuracy
    ) / 3

    print("\nAccuracy:")
    print(round(accuracy, 4))

    print("\nMacro F1:")
    print(round(macro_f1, 4))

    print("\nWeighted F1:")
    print(round(weighted_f1, 4))

    print("\nBalanced Accuracy:")
    print(round(balanced_accuracy, 4))

    print("\nBalanced Score:")
    print(round(balanced_score, 4))

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            y_pred,
            digits=3
        )
    )

    print("\nConfusion Matrix:")

    print(
        confusion_matrix(
            y_test,
            y_pred
        )
    )

    results.append({
        "Model": model_name,
        "Accuracy": accuracy,
        "Macro_F1": macro_f1,
        "Weighted_F1": weighted_f1,
        "Balanced_Accuracy": balanced_accuracy,
        "Balanced_Score": balanced_score
    })

    trained_models[model_name] = pipeline


# ============================================================
# 11. MODEL COMPARISON
# ============================================================

results_df = pd.DataFrame(results)

results_df = results_df.sort_values(
    by="Balanced_Score",
    ascending=False
).reset_index(drop=True)


print("\n")
print("=" * 70)
print("FINAL MODEL COMPARISON")
print("=" * 70)

print(
    results_df.to_string(
        index=False
    )
)


# ============================================================
# 12. SELECT BEST MODEL
# ============================================================

best_model_name = results_df.iloc[0]["Model"]

best_model = trained_models[
    best_model_name
]

best_accuracy = results_df.iloc[0]["Accuracy"]

best_macro_f1 = results_df.iloc[0]["Macro_F1"]

best_balanced_accuracy = results_df.iloc[0][
    "Balanced_Accuracy"
]

best_balanced_score = results_df.iloc[0][
    "Balanced_Score"
]


print("\n")
print("=" * 70)
print("BEST MODEL")
print("=" * 70)

print(
    f"Model: {best_model_name}"
)

print(
    f"Accuracy: {best_accuracy:.4f}"
)

print(
    f"Macro F1: {best_macro_f1:.4f}"
)

print(
    f"Balanced Accuracy: "
    f"{best_balanced_accuracy:.4f}"
)

print(
    f"Balanced Score: "
    f"{best_balanced_score:.4f}"
)


# ============================================================
# 13. SAVE BEST MODEL
# ============================================================

model_path = (
    "ML/roadsense_severity_model.pkl"
)

joblib.dump(
    best_model,
    model_path
)

print("\nModel saved successfully:")
print(model_path)


# ============================================================
# 14. SAVE LABEL ENCODER
# ============================================================

encoder_path = (
    "ML/label_encoder.pkl"
)

joblib.dump(
    {
        "label_map": label_map,
        "inverse_label_map": inverse_label_map
    },
    encoder_path
)

print("\nLabel encoder saved:")
print(encoder_path)


# ============================================================
# 15. SAVE RESULTS
# ============================================================

results_path = (
    "ML/model_results.csv"
)

results_df.to_csv(
    results_path,
    index=False
)

print("\nResults saved:")
print(results_path)


# ============================================================
# 16. FINAL STATUS
# ============================================================

print("\n")
print("=" * 70)
print("ROADSENSE AI ML PHASE COMPLETED")
print("=" * 70)

print(
    f"\nSelected model: {best_model_name}"
)

print(
    f"Final accuracy: "
    f"{best_accuracy * 100:.2f}%"
)

print(
    f"Final macro F1: "
    f"{best_macro_f1 * 100:.2f}%"
)

print(
    f"Final balanced accuracy: "
    f"{best_balanced_accuracy * 100:.2f}%"
)

print("\nNext phase:")
print("ML model -> FastAPI prediction endpoint -> Frontend")

print("\n" + "=" * 70)