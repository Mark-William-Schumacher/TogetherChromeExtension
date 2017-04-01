var config = {
  apiKey: " AIzaSyAg3pkLktL7yx-gPPuMPVs7sKS8pUvrHzI",
  databaseURL: "https://rhino-9094e.firebaseio.com/",
  storageBucket: "gs://rhino-9094e.appspot.com/"
};
var myApiKey = "AIzaSyC6-huqtlksf5M3CUYKiRHwD7k5z2rEyR8"; //Youtube
firebase.initializeApp(config);

 var pollerIsRunning = false;
 var poller = {
    failed: 0,               // number of failed requests
    interval: 2500,          // kicks off the setTimeout
    init: function(){        // starting interval - 5 seconds
        console.log("Init called on poller")
        setTimeout(
            $.proxy(this.getData, this), this.interval
        );
        pollerIsRunning = true;
    }, // get AJAX data + respond to it
    getData: function(){
        var self = this;
        pollYoutubeTabs();
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

function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
  poller.init();
}

function pollYoutubeTabs(){
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0 ; i< tabs.length ; i+=1){
        if (re.test(tabs[i].url)){
          var id = youtube_parser(tabs[i].url);
            if (id){
                console.log("Youtube video found = " + id);
                console.log("for tab = " + tabs[i].id);
               pingMessagePromise(tabs[i].id)
                .then(loadContentScriptPromise)
                .then(dataRequestPromise)
                .then(readYoutubeResponse).then(function (res) {
                   console.log(res);
               })
                .catch(function (err){
                  console.log(err);
                });
              }
            }
    }
  });
}

function pingMessagePromise(tabId){
  return new Promise(function(resolve, reject) {
    chrome.tabs.sendMessage(tabId, {service: "ping"}, function(response) {
      if (response) {
        console.log("Already there");
        return resolve({'hasScript':true,'id':tabId});
      } else {
        console.log("Not there: "+tabId);
        return resolve({'hasScript':false,'id':tabId});
      }
    });
  });
}
function loadContentScriptPromise(obj){
  return new Promise(function(resolve, reject) {
      if (obj.hasScript) {
        resolve(obj);
      } else {
        resolve(executeScriptPromise(obj));
      }
  });
}

function executeScriptPromise(obj){
  console.log(obj);
  return new Promise(function(resolve, reject) {
    chrome.tabs.executeScript(obj.id, {file: "contentscript.js"}, function(response) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            reject(new Error('Illegal injection on a chrome tab'));
            return;
        }
        resolve(obj);
      });
    });
}

function dataRequestPromise(obj){
  return new Promise(function(resolve, reject) {
    chrome.tabs.sendMessage(obj.id, {service:"youtube_data_request"},function(response){
          resolve(response);
      });
    });
  }

function readYoutubeResponse(data){
    return new Promise(function (resolve, reject) {
        if (data) {
            const id = youtube_parser(data.baseURI);
            asyncCallForYoutube3Api(id, myApiKey, function (dataapi) {
                if (typeof(dataapi.items[0]) != "undefined") {
                    var obj = {
                        videoId: id,
                        videoDescription: dataapi.items[0].snippet.description,
                        thumbnailMax: dataapi.items[0].snippet.thumbnails.standard.url,
                        thumbnailMedium : dataapi.items[0].snippet.thumbnails.medium.url,
                        channelId : dataapi.items[0].snippet.channelId,
                        channelTitle : dataapi.items[0].snippet.channelTitle,
                        uri : data.baseURI,
                        currentTime : data.currentTime,
                        title : dataapi.items[0].snippet.title,
                        duration : data.duration,
                        eventtype : data.type
                    };
                    resolve(obj)
                }
            });
        }else{
            console.log('error finding the video with the id given: ' + id);
            reject(new Error('Unable to get back api data'));
        }
    });
}

// MAP the tab to a video Object onto a -
var map = {};
var re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;


function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function asyncCallForYoutube3Api(videoId, myApiKey, callback){
    $.getJSON("https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key="+ myApiKey + "&part=snippet", callback)
 }

window.onload = function() {
  initApp();
};
