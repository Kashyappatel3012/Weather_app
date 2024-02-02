// Function triggered on clicking the search button
function city() {
    // Getting reference to the input field
    const city = document.getElementById('city');
    // Extracting city name from the input field
    const cityName = city.value;
    // Getting references to HTML elements to display weather information
    const displayname = document.getElementById('cityName');
    const displaytemp = document.getElementById('temp');
    const displaytime = document.getElementById('time');
    // API key for OpenWeatherMap
    const key = 'a044004b4cbda6576826b9d386bf3fb5';
    // API URLs for current weather and forecast
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${key}`;
    // Getting references to HTML elements to display current weather information
    const weather = document.getElementById('main_information');
    const weather2 = document.getElementById('main_information2');

    // Function to update time
    function updateTime() {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const hour = today.getHours().toString().padStart(2, '0');
        const minute = today.getMinutes().toString().padStart(2, '0');
        const second = today.getSeconds().toString().padStart(2, '0');
        // Creating a formatted string for the current time
        const time = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
        // Updating the time in the HTML element
        displaytime.innerHTML = time;
    }

    // Initial call to set the time
    updateTime();

    // Set interval to update the time every second
    const intervalId = setInterval(updateTime, 1000);

    // Fetch current weather data from OpenWeatherMap API
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(currentData => {
            console.log(currentData);
            // Extracting temperature information and displaying it
            const temp = Math.round(currentData.main.temp - 273.15);
            displayname.innerHTML = `${cityName}, ${currentData.sys.country}`;
            displaytemp.innerHTML = temp;

            // Creating strings for weather information
            const weatherinfo = `Weather: ${currentData.weather[0].description} &nbsp;&nbsp;&nbsp; visibility: ${currentData.visibility} &nbsp;&nbsp;&nbsp;`;
            const weatherinfo2 = `Wind Speed: ${currentData.wind.speed} &nbsp;&nbsp;&nbsp; Wind deg: ${currentData.wind.deg} &nbsp;&nbsp;&nbsp;`;
            // Displaying weather information in HTML elements
            weather.innerHTML = weatherinfo;
            weather2.innerHTML = weatherinfo2;
        })
        .catch(error => console.error('Error fetching current weather:', error));

    // Fetch forecast data from OpenWeatherMap API
    fetch(forecastUrl)
        .then(response => response.json())
        .then(forecastData => {
            console.log(forecastData);

            // Group forecast data by day
            const groupedByDay = forecastData.list.reduce((acc, forecast) => {
                const date = forecast.dt_txt.split(' ')[0];
                acc[date] = acc[date] || [];
                acc[date].push(forecast);
                return acc;
            }, {});

            // Display the forecast data for the next 5 days
            Object.keys(groupedByDay).forEach((day, index) => {
                if (index < 5) {
                    const dayForecast = groupedByDay[day][0]; // Taking the first forecast entry for each day

                    // Generate IDs for each day container
                    const dayContainerId = `day${index + 1}-container`;

                    // Get the day container element by ID
                    const dayContainer = document.getElementById(dayContainerId);

                    // Clear existing content in the day container
                    dayContainer.innerHTML = '';

                    // Create a new div element for the day's forecast
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('day');

                    // Create an img element for the weather condition
                    const weatherImg = document.createElement('img');
                    // Get the image source based on the weather description
                    weatherImg.src = getWeatherImage(dayForecast.weather[0].description);
                    weatherImg.alt = dayForecast.weather[0].description;

                    // Update the day's forecast data
                    dayDiv.appendChild(weatherImg);
                    dayDiv.innerHTML += `
                        <br>  
                        <span id="desc${index + 1}">${dayForecast.weather[0].description}</span><br> 
                        <span id="day${index + 1}">${day}</span><br>
                        <span id="tem${index + 1}"> temperature: ${Math.round(dayForecast.main.temp - 273.15)} C</span><br>
                    `;
                    // Append the new div element to the day container
                    dayContainer.appendChild(dayDiv);
                }
            });

            // Function to get corresponding weather image based on description
            function getWeatherImage(description) {
                // Map descriptions to image paths
                const imageMap = {
                    'clear sky': 'Images/clearsky.png',
                    'snow': 'Images/snow.png',
                    'broken clouds': 'Images/brokenclouds.png',
                    'few clouds': 'Images/fewclouds.png',
                    'mist': 'Images/mist.png',
                    'scattered clouds': 'Images/scatteredclouds.png',
                    'thunder strome': 'Images/thunderstrome.png'
                    // Add more mappings as needed
                };

                // Default image if no match found
                const defaultImage = 'Images/clearsky.png';

                // Get the corresponding image path or use the default
                return imageMap[description] || defaultImage;
            }
        })
        .catch(error => console.error('Error fetching forecast:', error));
}
