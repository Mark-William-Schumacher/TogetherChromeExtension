var config = {
  apiKey: " AIzaSyAg3pkLktL7yx-gPPuMPVs7sKS8pUvrHzI",
  databaseURL: "https://rhino-9094e.firebaseio.com/",
  storageBucket: "gs://rhino-9094e.appspot.com/"
};
var myApiKey = "AIzaSyC6-huqtlksf5M3CUYKiRHwD7k5z2rEyR8"; //Youtube
firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
}



//
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    console.log(tabId,changeInfo,tab);
    // TODO send a message to that tab. If the message comes back , then we know there
    // is a poller living there.
    // If we do not get a message back we start a content script poller at that location
    // The poller will sit on stand by until netflix or youtube.
    // Or just init a content script for each tab, and have the poller sit on standby.
  }
);

/* onSwitching tabs */
chrome.tabs.onActivated.addListener(function(activeInfo){
    console.log(activeInfo);
});





//TODO
//Set it up so that when the user is navigating around the tabs we are potentially executing
// our poller to run on those tabs.


chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    route = request.route;

    if ("CS_LOG" === route){
      tab = request.tab;
      console.log(tab.active + tab.url +" id ="+ tab.id + "\nMsg: " + request.msg);
    }

    if ("YOUTUBE_SCRAPE" === route){
      console.log(sender.tab ?  "from a content script:" + sender.tab.url :  "from the extension");
      parseData(request);
      sendResponse({});
    }
});

var lastId = -1;

function parseData(data){
    const uri =           data.baseURI
    const currentTime =   data.currentTime
    const title =         data.title
    const duration =      data.duration
    const eventtype =     data.type
    const id = youtube_parser(uri);
    if (lastId != id ){
      lastId = id;
      asyncCallForYoutube3Api(id,myApiKey, function(data){
        if (typeof(data.items[0]) != "undefined") {
            const videoDescription =  data.items[0].snippet.description;
            const thumbnailMax =      data.items[0].snippet.thumbnails.maxres.url;
            const thumbnailMedium =   data.items[0].snippet.thumbnails.medium.url;
            const channelId =         data.items[0].snippet.channelId;
            const channelTitle =      data.items[0].snippet.channelTitle;
         } else {
           console.log('error finding the video with the id given: '+id);
         }
         //TODO
         // STORE IN FIREBASE HERE:
         return;
       });
     } else{
        console.log("user is still on the same video, no need to call api again");
        //TODO
        // STATUS UPDATE TO FIREBASE -> use it as a ping to the server that the user is currently watching
     }
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function asyncCallForYoutube3Api(videoId, myApiKey, callback){
    $.getJSON("https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key="+ myApiKey + "&part=snippet", callback)
};

window.onload = function() {
  initApp();
};
