//set variable
const inputUser = document.querySelector(".inputUser");
const celciusBtn = document.querySelector(".celciusBtn");
const franheytBtn = document.querySelector(".franheytBtn");
const searchIcon = document.querySelector(".fa-magnifying-glass");
const country = document.querySelector(".country");
const city = document.querySelector(".city");
const image = document.querySelector('.image');
const spinner = document.querySelector('.spinner');
const skyCoundation = document.querySelector(".skyCoundation");
const changeContent = document.querySelectorAll(".changeContent");
const currentTime = document.querySelector(".currentTime");
const cityErrorMsg = document.querySelector(".cityErrorMsg");
const gridContainer = document.querySelector(".grid-container");


//weather icons
const iconMappings = {
    '01d': '01d.png',
    '01n': '01n.png',
    '02d': '02d.png',
    '02n': '02n.png',
    '03d': '03d.png',
    '03n': '03n.png',
    '04d': '04d.png',
    '04n': '04n.png',
    '09d': '09d.png',
    '09n': '09n.png',
    '10d': '10d.png',
    '10n': '10n.png',
    '13d': '13d.png',
    '13n': '13n.png',
    '50d': '50d.png',
    '50n': '50n.png',
};

//when press enter key works
const setQuery = (e) => {
    if (e.keyCode === 13) {
        spinner.style.display = 'inline-flex';
        getResult(inputUser.value);
        fetchWorldTime(inputUser.value);
        e.preventDefault()
    }
};
//addEventListeners
inputUser.addEventListener("keypress", setQuery);
franheytBtn.addEventListener("click", franheytButtonClick);
celciusBtn.addEventListener("click", celciusButtonClick);

//only one callculation in  updateTemperature function
function franheytButtonClick() {
    updateTemperature('F');
    franheytBtn.removeEventListener("click", franheytButtonClick);
    celciusBtn.addEventListener("click", celciusButtonClick);
}

function celciusButtonClick() {
    updateTemperature('C');
    celciusBtn.removeEventListener("click", celciusButtonClick);
    franheytBtn.addEventListener("click", franheytButtonClick)
}




//when click search button works
searchIcon.addEventListener("click", () => {
    spinner.style.display = 'inline-flex';
    getResult(inputUser.value);
    fetchWorldTime(inputUser.value);

});

//openWeather API for weather informations
const getResult = async (cityName) => {
    const url = "https://api.openweathermap.org/data/2.5/";
    const key = "1882ca3053a86bff2e348a30b9d66d62";
    const query = `${url}weather?q=${cityName}&appid=${key}&lang=en`;

    try {
        const response = await fetch(query);
        if (response.ok) {
            const result = await response.json();
            displayResult(result);
            cityErrorMsg.style.display = "none"
            gridContainer.style.visibility = 'visible';
        } else {
            gridContainer.style.visibility = 'hidden'
            cityErrorMsg.style.display = "block"
            spinner.style.display = 'none';
            console.error("API'den data alınmadı.");
        }
    } catch (error) {
        console.error("error: ", error);
    }
};

//show UI weather info
const displayResult = (result) => {

    country.textContent = result.sys.country
    city.textContent = result.name + ","

    sunRiseSunSet(result.coord.lat, result.coord.lon)

    //setting icons to UI
    const iconCode = result.weather[0].icon;
    if (iconMappings.hasOwnProperty(iconCode)) {
        image.setAttribute("src", "icon/" + iconMappings[iconCode]);
    } else {
        image.setAttribute("src", "icon/02d")
    }
    //weather info
    let windSpeed = Math.round(result.wind.speed)
    let mainTemp = Math.round(result.main.temp - 272.15)
    let mainFeels = Math.round(result.main.feels_like - 272.15)

    changeContent[0].textContent = windSpeed + "m/s"
    changeContent[1].textContent = result.main.humidity + "%"
    changeContent[3].textContent = mainTemp + "°C"
    changeContent[4].textContent = mainFeels + "°C"
    changeContent[5].textContent = result.weather[0].main
    changeContent[6].textContent = Math.round((result.visibility) / 1000) + "km"
    changeContent[7].textContent = result.clouds.all + "%"

    if (result.clouds.all >= 50 && result.clouds.all <= 75) {
        changeContent[8].textContent = 55 + "%"
    } else if (result.clouds.all >= 75) {
        changeContent[8].textContent = 100 + "%"
    } else {
        changeContent[8].textContent = 0 + "%"

    }
    skyCoundation.textContent = result.weather[0].description

}

//sunrisesunset API for sunrise and sunset informations
async function sunRiseSunSet(long, lat) {
    let sunriseSetArr = []
    let sunTimeUrl = await fetch(`https://api.sunrisesunset.io/json?lat=${long}&lng=${lat}`)
    try {
        if (sunTimeUrl.ok) {
            let sunTime = await sunTimeUrl.json()
            sunriseSetArr.push((sunTime.results.sunrise).slice(0, 4));
            sunriseSetArr.push((sunTime.results.sunset).slice(0, 4));
        } else {
            console.error("Could not sun timestamp")
        }
    } catch (error) {
        console.error("timestamp error:", error)
    }
    changeContent[9].textContent = sunriseSetArr[sunriseSetArr.length - 2]

    let newSunSetHour = Number((sunriseSetArr[sunriseSetArr.length - 1]).slice(0, 1)) + 12
    let newSunSetMinute = Number((sunriseSetArr[sunriseSetArr.length - 1]).slice(2, 4))

    newSunSetMinute = newSunSetMinute < 10 ? "0" + newSunSetMinute : newSunSetMinute
    changeContent[10].textContent = `${newSunSetHour}:${newSunSetMinute}`
}


//get local time API from ninjas API
async function fetchWorldTime(valu) {
    const apiKey = 'ukr3HjcLVzkSaVIshIPQ/A==8ZXgpQjvJlXjNeiY';
    const url = `https://api.api-ninjas.com/v1/worldtime?city=${valu}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            spinner.style.display = 'none';
            localeTime(result)
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
//show UI city's of local time
function localeTime(time) {
    let originalDate = new Date(`${time.date}`)
    let day = originalDate.getDate()
    let month = originalDate.getMonth() + 1
    let year = originalDate.getFullYear()

    day = day < 10 ? "0" + day : day
    month = month < 10 ? "0" + month : month
    //reverse time format
    let formattedDte =
        `${time.day_of_week} ${day} ${nameMonth(month)} ${year} | ${(time.datetime).slice(11, 16)}`
    currentTime.textContent = formattedDte

}
//change number of month to word format
function nameMonth(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return monthNames[month - 1]
}

//change measurements
function updateTemperature(unit) {
    let toSpeed = changeContent[0].textContent.slice(0, -3);
    let mainTemp = changeContent[3].textContent.slice(0, -2);
    let feelsTemp = changeContent[4].textContent.slice(0, -2);

    if (unit === 'F') {
        changeContent[0].textContent = Math.round(toSpeed * 2.24) + "mph";
        changeContent[3].textContent = Math.round(Number(mainTemp * 9 / 5) + 32) + "°F";
        changeContent[4].textContent = Math.round(Number(feelsTemp * 9 / 5) + 32) + "°F";
    } else if (unit === 'C') {
        changeContent[0].textContent = Math.round(toSpeed / 2.24) + "m/s";
        changeContent[3].textContent = Math.round((Number(mainTemp) - 32) * 5 / 9) + "°C";
        changeContent[4].textContent = Math.round((Number(feelsTemp) - 32) * 5 / 9) + "°C";
    }
}





