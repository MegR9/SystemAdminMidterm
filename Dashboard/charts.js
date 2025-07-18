// Chart.defaults.backgroundColor = '#FFF';
Chart.defaults.elements.line.borderColor = '#37A2EB';
Chart.defaults.elements.line.borderJoinStyle = 'round'
Chart.defaults.elements.point.backgroundColor = '#37A2EB';
Chart.defaults.color = '#778899';
Chart.defaults.plugins.colors = false;

(async function () {

  const data = [
    { year: 2010, count: 1 },
    { year: 2011, count: 2 },
    { year: 2012, count: 1 },
    { year: 2013, count: 2 },
    { year: 2014, count: 2 },
    { year: 2015, count: 30 },
    { year: 2016, count: 38 },
    { year: 2017, count: 49 },
    { year: 2018, count: 70 },
    { year: 2019, count: 80 },
    { year: 2020, count: 80 },
    { year: 2021, count: 80 },
    { year: 2022, count: 80 },
    { year: 2023, count: 80 },
    { year: 2024, count: 10 },
    { year: 2025, count: 20 },
    { year: 2026, count: 15 },
    { year: 2027, count: 25 },
    { year: 2028, count: 22 },
    { year: 2029, count: 30 },
    { year: 2030, count: 28 },
    { year: 2031, count: 10 },
    { year: 2032, count: 20 },
    { year: 2034, count: 15 },
    { year: 2035, count: 25 },
    { year: 2036, count: 22 },
    { year: 2037, count: 30 },
    { year: 2038, count: 28 },
    { year: 2039, count: 10 },
    { year: 2040, count: 20 },
    { year: 2041, count: 15 },
    { year: 2042, count: 25 },
    { year: 2043, count: 22 },
    { year: 2044, count: 30 },
    { year: 2045, count: 28 },
    { year: 2046, count: 10 },
    { year: 2047, count: 20 },
    { year: 2048, count: 15 },
    { year: 2049, count: 25 },
    { year: 2050, count: 22 },
    { year: 2051, count: 30 },
    { year: 2052, count: 28 },
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
        animation: true,
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
            display: false,
          },
          y: {
            min: 0,
            max: 100,
          }
        }
      }
    }
  );
})();

(async function () {

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
        animation: true,
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
            display: false
          }
        }
      }
    }
  );
})();

(async function () {

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
        animation: true,
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
            display: false
          }
        }
      }
    }
  );
})();

(async function () {

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
        animation: true,
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
            display: false
          }
        }
      }
    }
  );
})();

(async function () {

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
        animation: true,
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
            display: false
          }
        }
      }
    }
  );
})();

(async function () {

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
        animation: true,
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
            display: false
          }
        }
      }
    }
  );
})();