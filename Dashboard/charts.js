// Chart.defaults.backgroundColor = '#FFF';
// Chart.defaults.borderColor = '#FFF';
Chart.defaults.color = '#778899';

(async function() {

  new Chart(
    document.getElementById('cpuUsage'),
    {
      type: 'line',
      data: {
        labels: time,//data.map(row => row.year),
        datasets: [
          {
            label: 'CPU Usage',
            data: cpuX//data.map(row => row.count)
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
            x: {
              display:false
           }
        }
      }
    }
  );
})();

(async function() {

  new Chart(
    document.getElementById('ramUsage'),
    {
      type: 'line',
      data: {
        labels: time,
        datasets: [
          {
            label: 'RAM Usage',
            data: cpuX
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
            x: {
              display:false
           }
        }
      }
    }
  );
})();

(async function() {

  new Chart(
    document.getElementById('diskUsage'),
    {
      type: 'line',
      data: {
        labels: time,
        datasets: [
          {
            label: 'Disk Usage',
            data: cpuX
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
            x: {
              display:false
           }
        }
      }
    }
  );
})();

(async function() {

  new Chart(
    document.getElementById('netUsage'),
    {
      type: 'line',
      data: {
        labels: time,
        datasets: [
          {
            label: 'Net Usage',
            data: cpuX
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
            x: {
              display:false
           }
        }
      }
    }
  );
})();

(async function() {

  new Chart(
    document.getElementById('avgUsage'),
    {
      type: 'line',
      data: {
        labels: time,
        datasets: [
          {
            label: 'Average Usage',
            data: cpuX
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
            x: {
              display:false
           }
        }
      }
    }
  );
})();