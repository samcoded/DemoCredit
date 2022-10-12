process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app';

const should = chai.should();
chai.use(chaiHttp);

describe('Index API Routes', () => {
    describe('GET /', function () {
        it('should return base api info', function (done) {
            chai.request(app)
                .get('/')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    done();
                });
        });
    });

    describe('GET /api', function () {
        it('should return base api info', function (done) {
            chai.request(app)
                .get('/api')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    done();
                });
        });
    });

    describe('GET /api/notExist', function () {
        it('should error 404', function (done) {
            chai.request(app)
                .get('/api/notExist')
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    done();
                });
        });
    });
});
