stress --cpu 2 --timeout 10
sleep 5

stress --vm 1 --vm-bytes 512M --timeout 10
sleep 5

stress --io 4 --timeout 10
sleep 5

stress --hdd 4 --hdd-bytes 1G --timeout 10
sleep 5

ping -i 0.003 -f -w10 8.8.8.8
sleep 5