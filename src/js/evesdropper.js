/**
 * Created by mobile on 2017-03-31.
 */
// If the video is currently playing , we will add 3 seconds of playtime to the video
// Add videos that are currently playing to a users watching list.


// Poller adds the video into a session ,
// EvesDropper  actively listened to record data, Eves dropper removes sessions, and upon removal

// EvesDropper listens for additions on currentSessions and then injects a content script to monitor the tab
    /**
     *
     * @param evesdropper
     * @param firebase
     */
function listenForSessionAdditions(evesdropper, firebase){
    firebase.database().ref('sessions/' + userId).on('child_added', function (session) {
        //Execute content script
        //RegisterListeners for playback events
        // On Session Addition, set up new content script on tab , Upon completion , register listeners for those
        // playback events . Each playback event will give the tab object we can use to query the videoID and the activeTab, playbackTime.
        // while playing -> loop to collect datapoints every second.
    });
}


// Done by poller to see if a session needs to be created.
/**
 * @param {firebase.database}  fb
 * @param userId
 */
function queryCurrentSessions(fb, userId) {
    var a = fb.database();
    fb.database().ref('sessions/' + userId).once('value', function (listOfSessions) {
        console.log(listOfSessions);
        return listOfSessions;
    });
}

// PATH =  {sessions/userId/sessionId/:
//
//          sessions
//             tabId
//             videoId
//             dataPoints
//                 playbackTime
//                 statusOfVideo
//                 serverTime
//                 activeTab
// }
// Done by the poller
/**
 * @param {} firebase
 * @returns {Promise<void>}
 * /Sessions/userId/sessionId/  = data
 */
function createASession(firebase, userId, videoId, tabId) {
    return firebase.database()
        .ref()
        .child('sessions')
        .child(userId)
        .push().ref
        .set({tabId: tabId, videoId: videoId});
}

/**
 *
 * @param userId
 * @param sessionId
 * @returns {!firebase.Promise.<void>}
 */
function updateASession(userId, sessionId) {
    return firebase.database()
        .ref()
        .child('sessions')
        .child(userId)
        .child(sessionId)
        .child()
        .set({tabId: tabId, videoId: videoId});
}

// Remove session from active session and place it under
// userId
//     pastSessions
//        videoId
//        playbackTime
//        statusOfVideo
//        serverTime
//         activeTab
function finishSession() {

}
