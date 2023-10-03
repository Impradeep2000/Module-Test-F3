const container = document.getElementById("container");
const dataContainer = document.getElementById("data-container");
const submitBtn = document.getElementById("submit-btn");

var array = [];


submitBtn.addEventListener("click",()=>{
    container.style.display = "none";
    dataContainer.style.display = "flex";
    fetchData();
});

function getIpAddress(){
    $.getJSON("https://api.ipify.org?format=json", function(data) {         
    $("#ip-address").text(data.ip);
    }).fail(function(jqxhr, textStatus , error){
        var err = textStatus + ", " + error;
        console.error("Request Failed: " + err);
    });
}

async function fetchData(){
    var ipAdd=document.getElementById("ip-address").innerText;
    const url = `https://ipapi.co/${ipAdd}/json/`;
    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        renderData(data);
    }
    catch(error){
        console.error("Error", error);
    }
}

const ipAddress = document.getElementById("ipAdd");
const latitude = document.getElementById("lat");
const longitude = document.getElementById("long");
const city = document.getElementById("city");
const region = document.getElementById("region");
const organisation = document.getElementById("organisation");
const hostname = document.getElementById("hostname");

const timeZone = document.getElementById("timeZone");
const DateTime = document.getElementById("DateTime");
const pincode = document.getElementById("pincode");


function renderData(data){
    ipAddress.innerText = `${data.ip}`;
    latitude.innerText = `${data.latitude}`;
    longitude.innerText = `${data.longitude}`;
    city.innerText = `${data.city}`;
    region.innerText = `${data.region}`;
    organisation.innerText = `${data.org}`;
    hostname.innerText = `${data.asn}`;

    timeZone.innerText = `${data.timezone}`;
    DateTime.innerText =new Date().toLocaleString("en-US", {timeZone: `${data.timezone}`});
    pincode.innerText = `${data.postal}`;

    let lat = data.latitude;
    let long = data.longitude;
    let pin = data.postal;
    renderPostOfficeData(pin);
    // document.getElementById("map").setAttribute("src",`https://maps.google.com/maps/?q=${lat},${long}&output=embed`);
    renderMap(lat,long);
}
const mapContainer = document.getElementById("map-container");

function renderMap(lat,long){
    document.getElementById("map").setAttribute("src",`https://maps.google.com/maps/?q=${lat},${long}&output=embed`);
}

const message = document.getElementById("message");
async function renderPostOfficeData(pin){
    const url = `https://api.postalpincode.in/pincode/${pin}`;
    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        message.innerText = data[0].Message;
        console.log(data);
        array=data[0].PostOffice;
        renderPostals(data[0].PostOffice);
    }
    catch(error){
        console.error("Error", error);
    }

}
function renderPostals(data){
    const cardSection = document.querySelector(".cards");
    cardSection.innerHTML="";
    data.forEach((element)=>{
        const card = document.createElement("div");
        card.setAttribute("class","card color");
        card.innerHTML=`
        <p>Name: ${element.Name}</p>
        <p>Branch Type: ${element.BranchType}</p>
        <p>Delivery Status: ${element.DeliveryStatus}</p>
        <p>District: ${element.District}</p>
        <p>Division: ${element.Division}</p>
        `
        cardSection.appendChild(card);
    });
}
const search = document.getElementById("search");
search.addEventListener("blur",(event)=>{
    let searchInput = search.value;
    let searchData = [];
    array.forEach((element)=>{
        if(searchInput.trim()==element.Name.trim() || searchInput.trim()==element.BranchType.trim()){
                searchData.push(element);   
        }
    });
    renderPostals(searchData);
})


window.addEventListener("load", getIpAddress);
