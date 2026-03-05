const map = L.map('map').setView([35.681236,139.767125],5)

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map)

let places = JSON.parse(localStorage.getItem("places")) || []

function updateStats(){
document.getElementById("count").innerText = places.length
}

function save(){
localStorage.setItem("places",JSON.stringify(places))
}

function addPlace(){

const name=document.getElementById("placeName").value
const lat=parseFloat(document.getElementById("lat").value)
const lng=parseFloat(document.getElementById("lng").value)
const memo=document.getElementById("memo").value

if(!name || !lat || !lng){
alert("入力してください")
return
}

const place={
name,
lat,
lng,
memo
}

places.push(place)

save()

drawPlace(place)

updateStats()

}

function drawPlace(place){

const marker=L.marker([place.lat,place.lng]).addTo(map)

marker.bindPopup(
"<b>"+place.name+"</b><br>"+place.memo
)

}

places.forEach(drawPlace)

updateStats()
