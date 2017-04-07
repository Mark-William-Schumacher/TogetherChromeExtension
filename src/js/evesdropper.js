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
 * @param fb {firebase}
 * @param userId
 * @returns {!firebase.Promise.<*>}
 */
function queryCurrentSessions(fb, userId) {
    return fb.database().ref('sessions/' + userId).once('value');
}

// PATH =  {sessions/userId/sessionId/:
//
//         tabId
//             videoId
//                dataPoints
//                   playbackTime
//                   statusOfVideo
//                   serverTime
//                   activeTab
// }
// Done by the poller
/**
 * @param firebase
 * @param videoId {*}
 * @param userId {*}
 * @param tabId {*}
 * @returns {Promise<void>}
 * /Sessions/userId/sessionId/  = data
 */
function createASession(firebase, userId, tabId, videoId) {
    return firebase.database()
        .ref()
        .child('sessions')
        .child(userId)
        .child(tabId)
        .set({videoId: videoId});
}

/**
 *
 * @param firebase
 * @param userId
 * @param tabId
 * @returns {!firebase.Promise.<*>}
 */
function sessionExists(firebase, userId, tabId){
    return firebase.database()
        .ref()
        .child('sessions')
        .child(userId+"/"+tabId).once("value").then(function(snapshot) {
            console.log("snapshot.val:"+snapshot.val());
                return (snapshot.val() !== null);
            });
}

/**
 *
 * @param firebase
 * @param userId
 * @param tabId
 * @param status
 * @param activeTab
 * @param currentTime
 * @returns {!firebase.database.ThenableReference}
 */
function updateASession(firebase, userId, tabId, status, activeTab, currentTime) {
    return sessionExists(firebase, userId, tabId).then(function (bool){
        if (bool) {
            return firebase.database()
                .ref()
                .child('sessions/' + userId + '/' + tabId + '/dataPoints')
                .push({
                    time: firebase.database.ServerValue.TIMESTAMP,
                    status: status,
                    activeTab: activeTab,
                    playbackTime: currentTime,
                }).then(function(s){
                    return s.ref.key;
                });
        }
        else{
            throw new Error("FSADF");
        }
    });
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
