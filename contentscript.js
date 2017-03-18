/*
  Coming here from a page load at the URL , youtube.com , since we have problems
  rekicking off this content script. We need to use a poller to keep this script alive
  while the user may be navigating through youtube/ netflix.
  The content script does not get re kicked off on same site navigations.
*/
var pollerIsRunning = false;
var lastEventcalled;

$(window).ready(function onPageLoad(){
  if (!pollerIsRunning){
    poller.init()
  }
  addListeners();
});

function addListeners(){
  var video = document.getElementsByTagName("video")[0];
  if (video) {
    tryToRemoveListeners();
    video.addEventListener('play',    function(e)   {lastEventcalled = e});
    video.addEventListener('pause',   function(e)   {lastEventcalled = e});
    video.addEventListener('ended',   function(e)   {lastEventcalled = e});
    video.addEventListener('playing', function(e)   {lastEventcalled = e});
  }}

function gatherData(){
  var video = document.getElementsByTagName("video")[0];
  var an = lastEventcalled;
  if (video.duration) {
        chrome.runtime.sendMessage({baseURI: video.baseURI, currentTime: video.currentTime,title: video.title,duration: video.duration, eventtype: an.type}, function(response) {
            console.log();
      });
  }
}

function tryToRemoveListeners(){
   var video = document.getElementsByTagName("video")[0];
   try{video.removeEventListener('play');}catch(err){}
   try{video.removeEventListener('pause');}catch(err){}
   try{video.removeEventListener('ended');}catch(err){}
   try{video.removeEventListener('playing');}catch(err){}
}

var poller = {
   failed: 0,               // number of failed requests
   interval: 5000,          // kicks off the setTimeout
   init: function(){        // starting interval - 5 seconds
       console.log("Init called on poller")
       setTimeout(
           $.proxy(this.getData, this), // ensures 'this' is the poller obj inside getData, not the window object
           this.interval
       );
       pollerIsRunning = true;
   }, // get AJAX data + respond to it
   getData: function(){
       var self = this;
       addListeners();
       gatherData();
       this.init()
   },
   // handle errors
   errorHandler: function(){
       if( ++this.failed < 10 ){
           // give the server some breathing room by
           // increasing the interval
          this.interval += 1000;
          // recurse
          this.init();
       } else {
         pollerIsRunning = false;
       }
   }
};
