import express from 'express';
import * as os from 'os';
import { exec } from 'child_process';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Format uptime to hh:mm:ss
function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
}

// CPU Usage
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

// Memory
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

// Disk space
function getDiskSpace() {
  return new Promise((resolve, reject) => {
    exec("df -h --output=source,size,used,avail,pcent,target -x tmpfs -x devtmpfs", (err, stdout) => {
      if (err) return reject(err);

      const lines = stdout.trim().split('\n');
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

// Disk I/O
function getDiskIO() {
  const raw = fs.readFileSync('/proc/diskstats', 'utf8');
  const lines = raw.trim().split('\n');
  const result = {};

  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    const device = parts[2];

    if (!/^sd[a-z]$/.test(device) && !/^nvme\d+n\d+$/.test(device)) return;

    const readsCompleted = parseInt(parts[3], 10);
    const readsMerged = parseInt(parts[4], 10);
    const sectorsRead = parseInt(parts[5], 10);
    const writesCompleted = parseInt(parts[7], 10);
    const writesMerged = parseInt(parts[8], 10);
    const sectorsWritten = parseInt(parts[9], 10);

    result[device] = {
      readsCompleted,
      readsMerged,
      readsMB: (sectorsRead * 512 / 1024 / 1024),
      writesCompleted,
      writesMerged,
      writesMB: (sectorsWritten * 512 / 1024 / 1024)
    };
  });

  return result;
}

// Network
function getNetworkStats() {
  try {
    const raw = fs.readFileSync('/proc/net/dev', 'utf8');
    const lines = raw.trim().split('\n').slice(2);
    const interfaces = {};

    lines.forEach(line => {
      const [iface, rest] = line.trim().split(':');
      const data = rest.trim().split(/\s+/);

      interfaces[iface.trim()] = {
        receiveBytes: parseInt(data[0], 10),
        transmitBytes: parseInt(data[8], 10)
      };
    });

    return interfaces;
  } catch (err) {
    console.error("Error reading /proc/net/dev:", err);
    return {};
  }
}

// Load average
function getLoadAverage() {
  const [one, five, fifteen] = os.loadavg();
  return {
    '1min': one.toFixed(2),
    '5min': five.toFixed(2),
    '15min': fifteen.toFixed(2),
  };
}

// GET /stats
app.get('/stats', async (req, res) => {
  try {
    const [cpuUsage, diskSpaceRaw] = await Promise.all([
      getCPUUsage(),
      getDiskSpace()
    ]);

    const memory = getMemoryInfo();
    const load = getLoadAverage();
    const network = getNetworkStats();
    const diskIORaw = getDiskIO();

    const diskSpace = diskSpaceRaw.map(d => {
      const used = parseFloat(d.used.replace(/[A-Za-z]/g, ''));
      const total = parseFloat(d.size.replace(/[A-Za-z]/g, ''));
      return {
        mount: d.mount,
        totalGB: total,
        usedGB: used
      };
    });

    let readMB = 0;
    let writeMB = 0;
    Object.values(diskIORaw).forEach(disk => {
      readMB += disk.readsMB;
      writeMB += disk.writesMB;
    });

    res.json({
      timestamp: new Date().toISOString(),
      hostname: os.hostname(),
      uptime: formatUptime(os.uptime()),
      cpuUsagePercent: cpuUsage,
      memory,
      loadAverage: load,
      disk: {
        space: diskSpace,
        io: {
          readMB,
          writeMB
        }
      },
      network
    });
  } catch (err) {
    console.error('Error in /stats:', err);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Server is running and collecting system stats.');
});

// Start server on port 80 (requires sudo)
app.listen(80, '0.0.0.0', () => {
  console.log('Server listening on http://0.0.0.0:80');
});
