const request = require('request');

describe('calc', () => {
    it('Should multiply 2x2', () => {
        expect(2*2).toBe(4);

    });
});

describe('get messages', () => {
    // test 1
    it('Should return 200 OK', (done) => {
        request.get('http://localhost:8070/messages', (err, res) => {
            console.log(res.body);

            expect(res.statusCode).toEqual(200);

            done();
        });
        expect()
    });
    // test 2
    it('Should returna list thats not empty', (done) => {
        request.get('http://localhost:8070/messages', (err, res) => {
            console.log(res.body);

            expect(JSON.parse(res.body).length).toBeGreaterThan(0);

            done();
        });
        expect()
    });
});