//this is for the backend of the application
//for the midterm project 
import express from 'express';
import * as os from 'os';
import { exec } from 'child_process';
import fs from 'fs';
import cors from 'cors';
//const cors = require('cors');
//import 'module';
const app = express();
//const os = require('os');
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//for disk
//const { exec } = require('child_process');
//for network
//const fs = require('fs');


// store CPU
function getCPUUsage(delay = 100) {
    return new Promise((resolve) => {
        const cpus1 = os.cpus();

        setTimeout(() => {
            const cpus2 = os.cpus();
            let idleDiff = 0;
            let totalDiff = 0;

            for (let i = 0; i < cpus1.length; i++) {
                const cpu1 = cpus1[i].times;
                const cpu2 = cpus2[i].times;

                const idle1 = cpu1.idle;
                const idle2 = cpu2.idle;

                const total1 = Object.values(cpu1).reduce((a, b) => a + b, 0);
                const total2 = Object.values(cpu2).reduce((a, b) => a + b, 0);

                idleDiff += idle2 - idle1;
                totalDiff += total2 - total1;
            }

            const usage = 1 - idleDiff / totalDiff;
            resolve((usage * 100).toFixed(2));
        }, delay);
    });
}
//store memory
function getMemoryInfo() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {
        totalMB: (total / 1024 / 1024).toFixed(2),
        usedMB: (used / 1024 / 1024).toFixed(2),
        freeMB: (free / 1024 / 1024).toFixed(2),
    };
}

//store disk
function getDiskSpace() {
    return new Promise((resolve, reject) => {
        exec("df -h --output=source,size,used,avail,pcent,target -x tmpfs -x devtmpfs", (err, stdout, stderr) => {
            if (err) return reject(err);
            
            const lines = stdout.trim().split('\n');
            const headers = lines[0].split(/\s+/);
            const disks = lines.slice(1).map(line => {
                const parts = line.trim().split(/\s+/);
                return {
                    filesystem: parts[0],
                    size: parts[1],
                    used: parts[2],
                    available: parts[3],
                    percentUsed: parts[4],
                    mount: parts[5],
                };
            });
            resolve(disks);
        });
    });
}

//store network
function getNetworkStats() {
    const raw = fs.readFileSync('/proc/net/dev', 'utf8');
    const lines = raw.trim().split('\n').slice(2); // skip headers
    const interfaces = {};

    lines.forEach(line => {
        const [iface, rest] = line.trim().split(':');
        const data = rest.trim().split(/\s+/);

        interfaces[iface.trim()] = {
            receiveBytes: parseInt(data[0]),
            transmitBytes: parseInt(data[8])
        };
    });

    return interfaces;
}

//store load average
function getLoadAverage() {
    const [one, five, fifteen] = os.loadavg();
    return {
        '1min': one.toFixed(2),
        '5min': five.toFixed(2),
        '15min': fifteen.toFixed(2),
    };
}

//send data in json
app.get('/stats', async (req, res) => {
  try {
    const cpuUsage = await getCPUUsage();  // await here!
    const memory = getMemoryInfo();
    const load = getLoadAverage();
    const diskSpace = await getDiskSpace();
    const network = getNetworkStats(); // synchronous function

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      timestamp: new Date().toISOString(),
      cpuUsagePercent: cpuUsage,
      memory,
      loadAverage: load,
      disk: {
        space: diskSpace,
        io: null  // no diskIO for now
      },
      network
    });
  } catch (err) {
    console.error('Error in /stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/',(req,res)=>{
    //const name = '';
    res.send('Server is running?');

});


app.listen(80, "0.0.0.0",() => {
    console.log('Server listening on http://0.0.0.0:80');
    //console.log("opened server on", server.address());
});

//console.log("Main class made");
//var m = new main();
