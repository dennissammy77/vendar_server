const request = require('supertest');
const app = require('../../app.js');

describe('GET /', () => { 
    it('should respond with a 200', (done) => {
        request(app)
       .get('/')
       .expect(200)
       .expect(function(res){
            res.body.hasOwnProperty('Hello This is Vendar server page!! Good Luck Sam!!:)')
       })
       .end(done);
    });
 })