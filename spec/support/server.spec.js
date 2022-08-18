const request = require('request');

const user = 'sam';

describe('calc', () => {
    it('Should multiply 2x2', () => {
        expect(2*2).toBe(4);

    });
});

// 1.0 Test /messages endpoints
describe('get messages', () => {
    // 1.1 test get message endpoint for 200 OK
    it('Should return 200 OK', (done) => {
        request.get('http://localhost:8070/messages', (err, res) => {
            // console.log(res.body);

            expect(res.statusCode).toEqual(200);

            done();
        });
    });
    // 1.2 test get messages return list of messages
    it('Should returna list thats not empty', (done) => {
        request.get('http://localhost:8070/messages', (err, res) => {
            // console.log(res.body);

            expect(JSON.parse(res.body).length).toBeGreaterThan(0);

            done();
        });
    });
    // 1.3 test post messages
    it(`Should post message for user ${user}`, (done) => {
        let payload = {
            json: true,
            body: {
                name: user,
                message: `Message from ${user}`
            }
        }
        request.post('http://localhost:8070/messages', payload, (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        });
    });
});

describe('get messages from user', () => {
    it('Should return 200 OK', (done) => {
        request.get('http://localhost:8070/messages/tim', (err, res) => {
            // console.log(res.body);

            expect(res.statusCode).toEqual(200);

            done();
        });
    });
    // test : check for identity of the user
    it(`Should belongs to user:${user}`, (done) => {
        request.get('http://localhost:8070/messages/tim', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('tim');
            done();
        });
    });
});