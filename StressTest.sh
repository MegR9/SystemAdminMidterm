#!/bin/bash

stress-ng --cpu-load 50 --timeout 10s
sleep 5

stress-ng --vm 1 --vm-bytes 512M --timeout 10s
sleep 5

stress-ng --io 4 --timeout 10s
sleep 5

stress-ng --hdd 4 --hdd-bytes 1G --timeout 10s
sleep 5

ping -i 0.003 -f -w10 8.8.8.8
sleep 5
