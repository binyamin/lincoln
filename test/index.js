const { expect } = require("chai");

const lincoln = require("..");

const serve = require("../lib/serve");
const srvr = new serve("./fixtures");

describe("lincoln - test for broken links", () => {

    before((done) => {
        srvr.start()
        done()
    })

    after((done) => {
        srvr.stop();
        done()
    })

    it("should throw error, when param url is missing", () => {
        expect(lincoln).to.throw;
    });

    it("should be empty, when no links are present", () => {
        lincoln("http://localhost:3000/none-present")
        .then(out => {
            expect(out.total).to.be.a("number");
            expect(out.total).to.equal(0)
        }).catch(e => {
            throw e;
        })
    })
    it("should return empty `broken`, when no links are broken", () => {
        lincoln("http://localhost:3000/none-broken")
        .then(out => {
            expect(out.broken).to.have.lengthOf(0);
        }).catch(e => {
            throw e;
        })
    })
    it("should return positive `total`, when some links are present", () => {
        lincoln("http://localhost:3000/none-broken")
        .then(out => {
            expect(out.total).to.be.gt(0);
        }).catch(e => {
            throw e;
        })
    })
    it("should return positive `broken`, if some links are broken", () => {
        lincoln("http://localhost:3000/some-broken")
        .then(out => {
            expect(out.broken.length).to.be.gte(out.total);
            expect(out.broken.length).to.be.gt(0);

            expect(out.broken).to.be.an("array");
            expect(out.broken[0].url).to.be.a("string")
            expect(out.broken[0].src).to.be.a("string")
            expect(out.broken[0].response_code).to.be.a("number");
            expect(out.broken[0].msg).to.be.a("string")
        }).catch(e => {
            throw e;
        })
    })
})
