/*
  Coming here from a page load at the URL , youtube.com , since we have problems
  rekicking off this content script. We need to use a poller to keep this script alive
  while the user may be navigating through youtube/ netflix.
  The content script does not get re kicked off on same site navigations.
*/

chrome.runtime.onMessage.addListener( function(request, sender, callback) {
    console.log(request);
    console.log(sender);
    if (request.service == "ping") {
      callback({response: "here"});
    }

    else if (request.service =="youtube_data_request") {
      var video = document.getElementsByTagName("video")[0];
      if (video && video.duration) {
        var eventType = "unknown";
        if (video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2) {  // PLAYING
          eventType = "playing";
        }else if (video.paused){
          eventType = "paused";
        } else if (video.ended){
          eventType = "ended"
        }
        var videojson = {
            baseURI: video.baseURI,
            currentTime: video.currentTime,
            title: video.title,
            duration: video.duration,
            type: eventType
        };
        callback(videojson);/**/
      } else{
        callback(null);
      }
    }
});
