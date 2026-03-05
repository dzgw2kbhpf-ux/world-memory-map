let map
let markers=[]

const japanCenter=[36.2048,138.2529]
const worldCenter=[20,0]

let mode="world"

const totalGoal=100

let places=JSON.parse(localStorage.getItem("places")||"[]")

function initMap(){

map=L.map('map').setView(worldCenter,2)

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map)

places.forEach(drawMarker)

updateStats()

}

function drawMarker(place){

const marker=L.marker([place.lat,place.lng]).addTo(map)

let imgHTML=""

if(place.photo){

imgHTML=`<img src="${place.photo}" style="width:150px">`

}

marker.bindPopup(

`
<b>${place.name}</b>
<br>
${place.memo}
<br>
${imgHTML}
<br>
<button onclick="deletePlace('${place.id}')">削除</button>
`

)

markers.push(marker)

}

function addPlace(){

const name=document.getElementById("placeName").value
const lat=parseFloat(document.getElementById("lat").value)
const lng=parseFloat(document.getElementById("lng").value)
const memo=document.getElementById("memo").value
const photoInput=document.getElementById("photo")

if(!name||!lat||!lng){

alert("入力してください")
return

}

const id=Date.now()

const place={

id,
name,
lat,
lng,
memo,
photo:null

}

if(photoInput.files[0]){

const reader=new FileReader()

reader.onload=function(e){

place.photo=e.target.result

savePlace(place)

}

reader.readAsDataURL(photoInput.files[0])

}else{

savePlace(place)

}

}

function savePlace(place){

places.push(place)

localStorage.setItem("places",JSON.stringify(places))

drawMarker(place)

updateStats()

}

function deletePlace(id){

places=places.filter(p=>p.id!=id)

localStorage.setItem("places",JSON.stringify(places))

location.reload()

}

function updateStats(){

document.getElementById("placeCount").innerText=places.length

const percent=Math.min(100,(places.length/totalGoal)*100)

document.getElementById("lifePercent").innerText=

Math.floor(percent)+"%"

document.getElementById("progressBar").style.width=

percent+"%"

}

function worldMode(){

mode="world"

map.setView(worldCenter,2)

}

function japanMode(){

mode="japan"

map.setView(japanCenter,5)

}

function generateShare(){

const data=btoa(JSON.stringify(places.map(p=>{

return{

name:p.name,
lat:p.lat,
lng:p.lng,
memo:p.memo

}

})))

const url=location.origin+location.pathname+"?data="+data

navigator.clipboard.writeText(url)

alert("共有URLコピーしました")

}

function loadShared(){

const params=new URLSearchParams(location.search)

const data=params.get("data")

if(!data)return

const decoded=JSON.parse(atob(data))

decoded.forEach(p=>drawMarker(p))

}

document.getElementById("addBtn").onclick=addPlace
document.getElementById("worldMode").onclick=worldMode
document.getElementById("japanMode").onclick=japanMode
document.getElementById("shareBtn").onclick=generateShare

initMap()
loadShared()
