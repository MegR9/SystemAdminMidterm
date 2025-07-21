#!/usr/bin/env python3

import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objs as go
import json
import threading
import time
import os

PIPE_PATH = "/tmp/sysstats"

# Shared in-memory store for metrics (last 20 values)
data_store = {
    "cpu": [],
    "mem": [],
    "disk": [],
    "rx": [],
    "tx": []
}

# Background thread: reads data from the pipe
def pipe_reader():
    while True:
        try:
            with open(PIPE_PATH, "r") as f:
                line = f.readline().strip()
                if not line:
                    continue  # skip empty lines

                stats = json.loads(line)

                # Append new data points
                data_store["cpu"].append(stats["cpu_percent"])
                data_store["mem"].append(stats["memory_percent"])
                data_store["disk"].append(stats["disk_percent"])
                data_store["rx"].append(stats["rx_bytes"])
                data_store["tx"].append(stats["tx_bytes"])

                # Keep only last 20 points
                for key in data_store:
                    data_store[key] = data_store[key][-20:]

        except Exception as e:
            print("Reader error:", e)
            time.sleep(2)

# Start pipe reader thread
threading.Thread(target=pipe_reader, daemon=True).start()

# Dash app setup
app = dash.Dash(__name__)
app.title = "Server Performance Dashboard"

app.layout = html.Div([
    html.H2("Real-Time Linux Server Performance", style={"textAlign": "center"}),

    dcc.Graph(id="live-graph"),

    dcc.Interval(
        id="interval-component",
        interval=2000,  # every 2 seconds
        n_intervals=0
    )
])

@app.callback(Output("live-graph", "figure"), [Input("interval-component", "n_intervals")])
def update_graph(n):
    return {
        "data": [
            go.Scatter(y=data_store["cpu"], name="CPU %"),
            go.Scatter(y=data_store["mem"], name="Memory %"),
            go.Scatter(y=data_store["disk"], name="Disk %"),
            go.Scatter(y=data_store["rx"], name="RX Bytes", yaxis="y2"),
            go.Scatter(y=data_store["tx"], name="TX Bytes", yaxis="y2"),
        ],
        "layout": go.Layout(
            title="Live Server Metrics",
            yaxis=dict(title="Usage (%)", range=[0, 100]),
            yaxis2=dict(
                title="Network Bytes",
                overlaying="y",
                side="right",
                showgrid=False
            ),
            legend=dict(x=0, y=1.1, orientation="h")
        )
    }

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8050)
