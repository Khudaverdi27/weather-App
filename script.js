const inputUser = document.querySelector(".inputUser");
const country = document.querySelector(".country");
const city = document.querySelector(".city");
const changeContent = document.querySelectorAll(".changeContent");
const url = "https://api.openweathermap.org/data/2.5/";
const key = "1882ca3053a86bff2e348a30b9d66d62";

const setQuery = (e) => {
    if (e.keyCode === 13) {
        getResult(inputUser.value);
        e.preventDefault()
    }
};

inputUser.addEventListener("keypress", setQuery);

const getResult = async (cityName) => {
    const query = `${url}weather?q=${cityName}&appid=${key}&lang=az`;

    try {
        const response = await fetch(query);
        if (response.ok) {
            const result = await response.json();
            displayResult(result);
        } else {
            console.error("API'den data alınmadı.");
        }
    } catch (error) {
        console.error("error: ", error);
    }
};

const displayResult = (result) => {
    country.textContent = result.sys.country
    city.textContent = result.name + ","
    console.log(result);
    for (let i = 0; i < changeContent.length; i++) {
        changeContent[0].textContent = result.wind.speed + "m/s"
        changeContent[1].textContent = result.main.humidity + "%"
        changeContent[3].textContent = Math.round(result.main.temp - 272.15) + "°C"
        changeContent[4].textContent = Math.round(result.main.feels_like - 272.15)
        changeContent[6].textContent = (result.visibility) / 1000 + "km"
        changeContent[7].textContent = result.clouds.all + "%"

    }
    console.log(changeContent);
};
