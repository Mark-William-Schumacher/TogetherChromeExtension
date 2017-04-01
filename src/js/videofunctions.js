module.exports = {

createVideoJson: function ( uri ,videoId, currentTime, title, duration, eventType , videoDescription, thumbnailMax, thumbnailMedium, channelId, channelTitle){
    return {
      "uri":uri,
      "videoId":videoId,
      "currentTime":currentTime,
      "title":title,
      "duration": duration,
      "eventType": eventType,
      "channelId": channelId,
      "channelTitle": channelTitle,
      "thumbnailMax": thumbnailMax,
      "thumbnailMedium": thumbnailMedium
    };
  },

  createDefaultVideoJson: function (){
    return createVideoJson("","","","","","","","","","","");
  },

  sameVideo: function (id,video){
    try{
      return (id === videoId );
    }catch(e){
      console.log("error reading video");
    }
    return false;
  },

  finshVideo: function (id,video){

  }

};
