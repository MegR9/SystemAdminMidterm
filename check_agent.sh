#!/bin/bash

SERVICE=agent.service

# when agent.service is down, sends a restart message to log and resets service
if ! systemctl is-active --quiet $SERVICE; then
    echo "$(date): $SERVICE was down, restarting..." >> /var/log/agent_restart.log
    systemctl restart $SERVICE
fi

