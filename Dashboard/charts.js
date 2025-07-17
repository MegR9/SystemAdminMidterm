// Chart.defaults.backgroundColor = '#FFF';
Chart.defaults.elements.line.borderColor = '#37A2EB';
Chart.defaults.elements.point.backgroundColor = '#37A2EB';
Chart.defaults.color = '#778899';
Chart.defaults.plugins.colors =  false;

(async function() {

  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];
  new Chart(
    document.getElementById('cpuUsage'),
    {
      
      type: 'line',
      data: {
        labels: data.map(row => row.year),//time,
        datasets: [
          {
            label: 'CPU Usage',
            data: data.map(row => row.count)//cpuUsage//data.map(row => row.count)
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
            data: ramUsage
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
            data: diskUsage
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
    document.getElementById('diskIOUsage'),
    {
      type: 'line',
      data: {
        labels: time,
        datasets: [
          {
            label: 'Disk IO Usage',
            data: IOUsage
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
            data: netUsage
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
            data: avgUsage
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