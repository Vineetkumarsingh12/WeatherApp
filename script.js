let yWeather=document.querySelector(".YWeather");
let sWeather=document.querySelector(".SWeather");
let gLocation=document.querySelector(".GLocation");
let serachForm=document.querySelector(".WeatherSerach");
let loadingScreen=document.querySelector(".loading-container")
let userWeather=document.querySelector(".weatherInfo");
let gAccessBtn=document.querySelector(".AccessBtn");
let err=document.querySelector(".error");
let errorMsg=document.querySelector(".errorMsg");
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
let currentTab=yWeather;
currentTab.classList.add("btn");
getformSessinStorage(); 

function switchTab(clickedTab){
    
    if(clickedTab!=currentTab){
        currentTab.classList.remove("btn");
        currentTab=clickedTab;
        currentTab.classList.add("btn");
   if(!serachForm.classList.contains("active")){
    userWeather.classList.remove("active"); 
    gLocation.classList.remove("active");
    serachForm.classList.add("active");  
   }else{
    serachForm.classList.remove("active"); 
    userWeather.classList.remove("active");

    
    getformSessinStorage();
   }
    }
}



yWeather.addEventListener('click',()=>
{
switchTab(yWeather);
});
sWeather.addEventListener('click',()=>
{
switchTab(sWeather);
});

function getformSessinStorage(){
    const localCoordinates=sessionStorage.getItem("user-codinates");
    if(!localCoordinates){
        gLocation.classList.add("active");
        
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fectchUserWeatherInfo(coordinates);
        
    }

}

async function fectchUserWeatherInfo(coordinates){
    
   const {lat,lon}=coordinates; 
   
   gLocation.classList.remove("active");
   loadingScreen.classList.add("active");

//    Api call
try{
   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
   

   const data=await response.json();

   loadingScreen.classList.remove("active");
   userWeather.classList.add("active");
   console.log("vineet");

   renderWeatherInfo(data);

}
catch(e){
loadingScreen.classList.remove("active"); 
errorMsg.textContent=e;
err.classList.add("active");
}
}

function renderWeatherInfo(data){
    const cityName=document.querySelector("[cityName]");
    const cFlag=document.querySelector("[countryImg]");
    const description=document.querySelector(".data-Description");
    const wIcon=document.querySelector('[weatherImg]');
    const tempreature=document.querySelector(".tempature")
   const wSpeed= document.querySelector("[wSpeed]");
   const  humidity=document.querySelector("[humidity]");
   const clouds=document.querySelector("[clouds]");
  cityName.textContent=data?.name;
  cFlag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  description.textContent=data?.weather?.[0]?.description;

 wIcon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
 tempreature.textContent=`${(data?.main?.temp- 273.15).toFixed(2)} °C`;
 wSpeed.textContent=`${data?.wind?.speed} m/s`;
 humidity.textContent=`${data?.main?.humidity}%`;
 clouds.textContent=`${data?.clouds?.all}%`;

}
function getLocation(){
    if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}
function showPosition(position){
    const userCoordinate={
        lat: position.coords.latitude,
        lon: position.coords.longitude, 
    }
    sessionStorage.setItem("user-codinates",JSON.stringify(userCoordinate));
    fectchUserWeatherInfo(userCoordinate);
}
gAccessBtn.addEventListener('click',getLocation);

let sData=document.querySelector(".cityData");

serachForm.addEventListener("submit",(e)=>{
e.preventDefault();
if(sData.value === "") return;
fectchSerachWeatherInfo(sData.value);
});
 async function fectchSerachWeatherInfo(city){
   loadingScreen.classList.add("active");
     userWeather.classList.remove("active");
     gLocation.classList.remove("active");
     try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userWeather.classList.add("active");
        renderWeatherInfo(data);
        
     }
     catch{
        errorMsg.textContent=e;
        err.classList.add("active");
     }
 }
