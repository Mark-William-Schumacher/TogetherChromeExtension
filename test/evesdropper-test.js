/**
 * Created by mobile on 2017-04-01.
 *
 * cd /Users/mobile/dev/Rhino/TogetherChromeExtension/test/localfirebase
 * firebase serve
 *
 */
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("../src/js/evesdropper.js");

var config = {
    apiKey: " AIzaSyAg3pkLktL7yx-gPPuMPVs7sKS8pUvrHzI",
    databaseURL: "http://localhost:5000"
};

var myApiKey = "AIzaSyC6-huqtlksf5M3CUYKiRHwD7k5z2rEyR8"; //Youtube

describe('hooks', function() {

    before(function() {
        firebase.initializeApp(config);
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    // test cases
});
describe('evesdropper', function() {
    describe('#createASession()', function() {
        it('should save without error', function(done) {
            createASession();{
                if (err) done(err);
                else done();
            });
        });
    });
});