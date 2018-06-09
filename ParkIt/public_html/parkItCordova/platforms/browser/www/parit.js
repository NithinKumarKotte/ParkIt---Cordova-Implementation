/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var latitude;
var longtitude;
var parkingLatitude;
var parkingLongitude;

var storage;

function init(){
    document.addEventListener("deviceready", onDeviceReady, false);
    storage= window.localStorage;
}

function onDeviceReady(){
    var node = document.createElement('link');
    node.setAttribute('rel','stylesheet');
    node.setAttribute('type','text/css');
    node.setAttribute('href','parkitandroid.css');
    window.StatusBar.backgroundColorByHexString('#1565C0');
    document.getElementsByTagName('head')[0].appendChild(node);
}

function setCss(elm,prop,val){
    var node=document.getElementById(elm).style;
    node.setProperty(prop,val);
}

function setparkinglocation(){
    navigator.geolocation.getCurrentPosition(setParkingLocationSuccess, locationError,{enableHighAccuracy:true} );
   
}

function setParkingLocationSuccess(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude; 
    storage.setItem('parkedLatitude',latitude);
    storage.setItem('parkedLongitude',longitude);
    showParkingLocation();
}

function locationError(error){
     navigator.notification.alert("Error code: "+error.code+"\n Error Message: "+error.message);
}

function showParkingLocation(){
    setCss('directions','visibility','hidden');
    setCss('instruction','display','none');
     var latLong= new google.maps.LatLng(latitude,longitude);
     var map=new google.maps.Map(document.getElementById('map'));
     map.setZoom(16);
     map.setCenter(latLong);
     var marker=new google.maps.Marker({
         position: latLong,
         map: map
     });
     marker.setMap(map);
     setCss('map','visibility','visible');
}

function getparkinglocation(){
    navigator.geolocation.getCurrentPosition(getParkingLocationSuccess, locationError,{enableHighAccuracy:true} );
}

function getParkingLocationSuccess(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude; 
    parkedLatitude=storage.getItem('parkedLatitude');
    parkedLongitude=storage.getItem('parkedLongitude')
    showDirections();
}

function showDirections(){
    var dirRenderer=new google.maps.DirectionsRenderer;
    var dirService=new google.maps.DirectionsService;
    var currentLatLong=new google.maps.LatLng(latitude,longitude);
    var parkedLatLong= new google.maps.LatLng(parkedLatitude,parkedLongitude);
    var map=new google.maps.Map(document.getElementById('map'));
    map.setZoom(16);
    map.setCenter(currentLatLong);
    dirRenderer.setMap(map);
    dirService.route({
       origin:currentLatLong,
       destination:parkedLatLong,
       travelMode:'DRIVING'
    },function(response,status){
        if(status=='OK'){
            dirRenderer.setDirections(response);
            document.getElementById('directions').innerHTML='';
            dirRenderer.setPanel(document.getElementById('directions'));
        }else{
            navigator.notification.alert("Directions failed due to: "+status)
        }
         
        setCss('map','visibility','visible');
        setCss('directions','visibility','visible');
        setCss('instructions','display','none');
        
    });
}