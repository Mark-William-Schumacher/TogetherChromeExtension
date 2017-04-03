/**
 * cd /Users/mobile/dev/Rhino/TogetherChromeExtension/test/localfirebase
 * firebase serve
 *
 */
describe('hooks', function() {

    before(function() {
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

    it('should save without error', function(done) {
            createASession(firebase,2,2,2).then(function() {
                console.log("done");
                done();
                }
            ),
            function (errHandler) {
                console.log()(errHandler);
                throw  errHandler;
            };
        });
});