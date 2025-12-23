const API_KEY = "cca58988e1b3fa460ffe4aaf9d1cfd58";

async function getWeather() {
  const loader = document.getElementById('loader');
loader.style.display = 'block'; 
document.getElementById('weatherInfo').style.display = 'none'; 

  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;

  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
  if (!res.ok) {
    alert('City not found');
    return;
  }
  const data = await res.json();
  console.log('Weather from API:', data.weather[0].main, '|', data.weather[0].description);


  document.getElementById('temp').textContent = Math.round(data.main.temp) + '°C';
  document.getElementById('desc').textContent = data.weather[0].description;
  document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
  saveToHistory(data.name);
  loader.style.display = 'none';
  document.getElementById('weatherInfo').style.display = 'block'; 


  applyEffect(data.weather[0].main.toLowerCase());
}

function applyEffect(condition) {
  const body = document.body;
  clearEffects();

  if (condition.includes('rain') || condition.includes('drizzle')) {
    body.style.background = 'var(--bg-rain)';
    makeRain(150);
  } else if (condition.includes('snow')) {
    body.style.background = 'var(--bg-snow)';
    makeSnow(100);
  } else if (condition.includes('cloud')) {
    body.style.background = 'var(--bg-clouds)';
    makeClouds(10);
  } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    body.style.background = 'var(--bg-fog)';
    document.getElementById('fog').style.opacity = 1;
  } else if (condition.includes('thunder')) {
    body.style.background = 'var(--bg-thunder)';
    makeRain(200);
    flashThunder();
  } else {
    body.style.background = 'var(--bg-clear)';
  }
}

function clearEffects() {
  document.getElementById('rain').innerHTML = '';
  document.getElementById('snow').innerHTML = '';
  document.getElementById('clouds').innerHTML = '';
  document.getElementById('fog').style.opacity = 0;
  document.getElementById('flash').style.opacity = 0;
}

function makeRain(count) {
  const rain = document.getElementById('rain');
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    const width = 1 + Math.random() * 1.5;
    drop.style.width = width + 'px';
    drop.style.height = 60 + Math.random() * 40 + 'px';
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDuration = 0.4 + Math.random() * 0.9 + 's';
    rain.appendChild(drop);
  }
}

function makeSnow(count) {
  const snow = document.getElementById('snow');
  for (let i = 0; i < count; i++) {
    const flake = document.createElement('div');
    flake.className = 'flake';
    const size = 4 + Math.random() * 6;
    flake.style.width = flake.style.height = size + 'px';
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.animationDuration = 4 + Math.random() * 6 + 's';
    snow.appendChild(flake);
  }
}

function makeClouds(count) {
  const container = document.getElementById('clouds');
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'cloud';
    const size = 150 + Math.random() * 250;
    c.style.width = size + 'px';
    c.style.height = size * 0.6 + 'px';
    c.style.top = Math.random() * 50 + '%';
    c.style.left = -150 - Math.random() * 250 + 'px';
    c.style.animationDuration = 40 + Math.random() * 20 + 's';
    container.appendChild(c);
  }
}

function flashThunder() {
  const flash = document.getElementById('flash');
  function lightning() {
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 100);
    const next = Math.random() * 4000 + 1500;
    setTimeout(lightning, next);
  }
  lightning();
}

function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

  history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
  history.unshift(city);

  if (history.length > 5) history.pop();

  localStorage.setItem('weatherHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  historyList.innerHTML = '';

  history.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.onclick = () => {
      document.getElementById('cityInput').value = city;
      getWeather();
    };
    historyList.appendChild(li);
  });
}

window.addEventListener('load', renderHistory);
document.addEventListener('click', (e) => {
  if (e.target.id === 'clearHistoryBtn') {
    const confirmClear = confirm('Are you sure you want to clear search history?');
    if (confirmClear) {
      localStorage.removeItem('weatherHistory');
      renderHistory();
    }
  }
});
// Load mode from localStorage
window.addEventListener('load', () => {
  const savedMode = localStorage.getItem('mode');
  if (savedMode === 'dark') {
    document.body.classList.add('dark-mode');
  }
});

// Toggle function
const toggle = document.getElementById('modeToggle');

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', toggle.checked);
  localStorage.setItem('mode', toggle.checked ? 'dark' : 'light');
});

// On load, restore state
window.addEventListener('load', () => {
  const savedMode = localStorage.getItem('mode');
  if (savedMode === 'dark') {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  }
});
const introContainer = document.getElementById('introContainer');
const video = document.getElementById('introVideo');
const app = document.querySelector('.app');
const skipBtn = document.getElementById('skipBtn');

function showApp() {
  introContainer.style.opacity = 0; // fade out
  setTimeout(() => {
    introContainer.style.display = 'none';
    app.style.display = 'block';
  }, 1000); // matches CSS transition
}

// Fade out when video ends
video.addEventListener('ended', showApp);

// Skip button
skipBtn.addEventListener('click', showApp);


