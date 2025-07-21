#!/usr/bin/env python3

import subprocess
import time
import json
import os

pipe_path = "/tmp/sysstats"
if not os.path.exists(pipe_path):
    os.mkfifo(pipe_path)

def get_cpu_usage():
    line = subprocess.check_output("top -bn1 | grep 'Cpu(s)'", shell=True, text=True)
    idle = float(line.split(',')[3].split()[0])
    return round(100 - idle, 2)

def get_memory_usage():
    output = subprocess.check_output("free -m", shell=True, text=True)
    lines = output.splitlines()
    mem = lines[1].split()
    used = int(mem[2])
    total = int(mem[1])
    return round((used / total) * 100, 2)

def get_disk_usage():
    output = subprocess.check_output("df -h /", shell=True, text=True).splitlines()[1]
    percent = output.split()[4]
    return float(percent.strip('%'))

def get_network_rx_tx():
    output = subprocess.check_output("cat /proc/net/dev", shell=True, text=True)
    for line in output.splitlines():
        if "eth0" in line:  # Replace with actual interface if needed
            fields = line.split()
            rx = int(fields[1])
            tx = int(fields[9])
            return {"rx_bytes": rx, "tx_bytes": tx}
    return {"rx_bytes": 0, "tx_bytes": 0}

def get_data():
    return {
        "cpu_percent": get_cpu_usage(),
        "memory_percent": get_memory_usage(),
        "disk_percent": get_disk_usage(),
        **get_network_rx_tx()
    }

while True:
    with open(pipe_path, "w") as f:
        json.dump(get_data(), f)
        f.write('\n')
    time.sleep(5)
