/**
 * cd /Users/mobile/dev/Rhino/TogetherChromeExtension/test/localfirebase
 * firebase serve
 *
 */
    it('should save without error', function(done) {
            createASession(firebase,10,20,30).then(function() {
                console.log("done");
                done();
                }
            ),
            function (errHandler) {
                console.log()(errHandler);
                throw  errHandler;
            };
        });


    it('should should see if session exist', function(done) {
        createASession(firebase,3,3,3).then(function(valu) {
                sessionExists(firebase,3,3).then( function (bool){
                    if (bool) {
                        console.log("Found session");
                        done();
                    }else{
                        console.log("no session");
                        throw new Error();
                    }
                    }
                )
        });
    });

    it('session should not exist', function(done) {
            sessionExists(firebase,90,90).then( function (bool){
                    if (bool) {
                        console.log("Found session");
                        throw new Error();
                    }else{
                        console.log("no session");
                        done();
                    }
                }
            )
        });

    describe('Query all Sessions', function() {
        this.timeout(15000);
        it('session should not exist', function (done) {
            var p1 = createASession(firebase, 1, 1, 1);
            var p2 = createASession(firebase, 1, 2, 2);
            var p3 = createASession(firebase, 1, 3, 3);
            var p4 = createASession(firebase, 1, 4, 4);
            Promise.all([p1, p2, p3, p4]).then(function (values) {
                queryCurrentSessions(firebase, 1).then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        console.log(childSnapshot.key+ ":" +childSnapshot.child("/videoId").val())
                        assert(childSnapshot.key == childSnapshot.child("/videoId").val())
                    });
                    done();
                });
            });
        })
    });