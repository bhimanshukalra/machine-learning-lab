import pandas as pd
from sklearn import linear_model
import numpy as np
import math
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


def predict_using_sklearn(df):
    regression_model = linear_model.LinearRegression()
    regression_model.fit(df[["math"]], df.cs)

    # print("regression_model", regression_model.coef_, regression_model.intercept_)
    return regression_model.coef_[0], regression_model.intercept_


def gradient_descent(x, y):
    m_curr = b_curr = 0
    iterations = 1000000
    n = len(x)
    learning_rate = 0.0002
    cost = 0

    for i in range(iterations):
        # y = mx + b
        y_predicted = m_curr * x + b_curr
        prev_cost = cost
        cost = (1 / n) * sum([val**2 for val in (y - y_predicted)])

        if math.isclose(prev_cost, cost, rel_tol=1e-20):
            break

        m_derivative = -(2 / n) * sum(x * (y - y_predicted))
        b_derivative = -(2 / n) * sum(y - y_predicted)

        m_curr = m_curr - learning_rate * m_derivative
        b_curr = b_curr - learning_rate * b_derivative

    return m_curr, b_curr


if __name__ == "__main__":
    df = pd.read_csv(BASE_DIR / "test_scores.csv")
    x = np.array(df.math)
    y = np.array(df.cs)

    m_curr, b_curr = gradient_descent(x, y)
    print("gradient_descent", m_curr, b_curr)

    regression_model_m, regression_model_b = predict_using_sklearn(df)
    print("regression_model", regression_model_m, regression_model_b)
