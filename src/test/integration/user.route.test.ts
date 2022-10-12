process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../app';
import db from '../../db/database';

const should = chai.should();
chai.use(chaiHttp);

describe('User API Routes', () => {
    before((done) => {
        db.migrate.rollback().then(() => {
            db.migrate.latest().then(() => {
                return db.seed.run().then(() => {
                    done();
                });
            });
        });
    });

    describe('POST /api/register', function () {
        it('should not register if email is missing', function (done) {
            chai.request(app)
                .post('/api/register')
                .send({
                    name: 'Test Test User',
                    password: '123456',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.json;
                    done();
                });
        });
        it('should not register if password is missing', function (done) {
            chai.request(app)
                .post('/api/register')
                .send({
                    name: 'Test Test User',
                    email: 'test@gmail.com',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });
        it('should register user successfully and generate auth token', function (done) {
            const testUser = {
                name: 'Test Test User',
                email: 'test@gmail.com',
                password: '123456',
            };
            chai.request(app)
                .post('/api/register')
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('token');
                    res.body.data.should.have.property('id');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('email');
                    res.body.data.should.have.property('token');
                    done();
                });
        });
    });

    describe('GET /api/login', function () {
        it('should not login if email is missing', function (done) {
            chai.request(app)
                .post('/api/login')
                .send({
                    email: 'john@gmail.com',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });
        it('should not login if password is missing', function (done) {
            chai.request(app)
                .post('/api/login')
                .send({
                    email: 'john@gmail.com',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });
        it('should login user successfully and generate auth token', function (done) {
            const testUser = {
                email: 'john@gmail.com',
                password: '123456',
            };
            chai.request(app)
                .post('/api/login')
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('token');
                    res.body.data.should.have.property('id');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('email');
                    res.body.data.should.have.property('token');
                    done();
                });
        });
    });

    describe('GET /api/users', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .get('/api/users')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('should return all users (token sent)', function (done) {
            chai.request(app)
                .post('/api/login')
                // send user login details
                .send({
                    email: 'john@gmail.com',
                    password: '123456',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                    const token = res.body.data.token;
                    chai.request(app)
                        .get('/api/users')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);
                            res.body.should.have.property('data');
                            res.body.data.should.be.a('array');
                            done();
                        });
                });
        });
    });

    describe('GET /api/users/:id', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .get('/api/users/1')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('should get single user by id (token sent)', function (done) {
            chai.request(app)
                .post('/api/login')
                // send user login details
                .send({
                    email: 'john@gmail.com',
                    password: '123456',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                    const token = res.body.data.token;
                    chai.request(app)
                        .get('/api/users/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('id');
                            res.body.data.should.have.property('name');
                            res.body.data.should.have.property('email');
                            res.body.data.should.have.property('amount');
                            done();
                        });
                });
        });
    });

    describe('PUT /api/users/:id', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .put('/api/users/1')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });
        it('should update user with id email (token sent)', function (done) {
            chai.request(app)
                .post('/api/login')
                // send user login details
                .send({
                    email: 'jane@gmail.com',
                    password: '123456',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                    const token = res.body.data.token;
                    chai.request(app)
                        .put('/api/users/3')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            name: 'Jane Mark Update',
                            email: 'janeupdate@gmail.com',
                        })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('name');
                            res.body.data.should.have.property('email');
                            res.body.data.email.should.equal(
                                'janeupdate@gmail.com'
                            );
                            res.body.data.name.should.equal('Jane Mark Update');
                            done();
                        });
                });
        });
    });
});
