process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app';
import db from '../db/database';

const should = chai.should();
chai.use(chaiHttp);

describe('Wallet API Routes', () => {
    before((done) => {
        db.migrate.rollback().then(() => {
            db.migrate.latest().then(() => {
                return db.seed.run().then(() => {
                    done();
                });
            });
        });
    });

    describe('GET /api/wallet/:id (GET WALLET DETAILS)', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .get('/api/wallet/1')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });
        it('fail to get wallet details with invalid user_id (id in token different from user_id sent)', function (done) {
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
                        .get('/api/wallet/2')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('should return wallet details (token sent)', function (done) {
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
                        .get('/api/wallet/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('user_id');
                            res.body.data.should.have.property('amount');
                            res.body.data.user_id.should.equal(1);
                            res.body.data.amount.should.equal(0);
                            done();
                        });
                });
        });
    });

    describe('PUT /api/wallet/fund/:id (FUND WALLET)', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .put('/api/wallet/fund/1')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });
        it('fail to fund wallet with invalid user_id (id in token different from user_id sent)', function (done) {
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
                        .put('/api/wallet/fund/2')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            amount: 1000,
                        })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('fail to fund wallet with invalid amount (token sent)', function (done) {
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
                        .put('/api/wallet/fund/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('should fund wallet with correct parameters (token sent)', function (done) {
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
                        .put('/api/wallet/fund/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            amount: 1000,
                        })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('user_id');
                            res.body.data.should.have.property('amount');
                            res.body.data.user_id.should.equal(1);
                            res.body.data.amount.should.equal(1000);
                            done();
                        });
                });
        });
    });

    describe('PUT /api/wallet/transfer/:id (WALLET TRANSFER)', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .put('/api/wallet/transfer/1')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('fail to transfer from wallet with invalid user_id (id in token different from user_id sent)', function (done) {
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
                        .put('/api/wallet/transfer/2')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('fail to transfer from wallet with invalid receiver (token sent)', function (done) {
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
                        .put('/api/wallet/transfer/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({ amount: 200, to: 'none@gmail.com' })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('fail to transfer from wallet with invalid amount (token sent)', function (done) {
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
                        .put('/api/wallet/transfer/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({ to: 'mike@gmail.com' })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('fail to transfer from wallet with insufficient balance amount in wallet (token sent)', function (done) {
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
                        .put('/api/wallet/transfer/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            amount: 3000,
                            to: 'mike@gmail.com',
                        })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });

        it('should transfer from wallet with correct parameters (token sent)', function (done) {
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
                        .put('/api/wallet/transfer/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            amount: 200,
                            to: 'mike@gmail.com',
                        })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('user_id');
                            res.body.data.should.have.property('amount');
                            res.body.data.user_id.should.equal(1);
                            res.body.data.amount.should.equal(800);
                            chai.request(app)
                                .get('/api/users/2')
                                .set({ Authorization: `Bearer ${token}` })
                                .end(function (err, res) {
                                    res.should.have.status(200);
                                    res.should.be.json;
                                    res.body.should.have.property('success');
                                    res.body.success.should.equal(true);
                                    res.body.should.have.property('data');
                                    res.body.data.should.have.property('id');
                                    res.body.data.should.have.property(
                                        'amount'
                                    );
                                    res.body.data.id.should.equal(2);
                                    res.body.data.amount.should.equal(200);
                                    done();
                                });
                        });
                });
        });
    });

    describe('PUT /api/wallet/withdraw/:id (WALLET WITHDRAWAL)', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .put('/api/wallet/withdraw/1')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('fail to withdraw from wallet with invalid user_id (id in token different from user_id sent)', function (done) {
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
                        .put('/api/wallet/withdraw/2')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            amount: 1000,
                        })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('fail to withdraw from wallet with invalid amount (token sent)', function (done) {
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
                        .put('/api/wallet/withdraw/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('fail to withdraw from wallet with insufficient balance amount in wallet (token sent)', function (done) {
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
                        .put('/api/wallet/withdraw/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            amount: 3000,
                        })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('should withdraw from wallet with correct parameters (token sent)', function (done) {
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
                        .put('/api/wallet/withdraw/1')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({
                            amount: 400,
                        })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('user_id');
                            res.body.data.should.have.property('amount');
                            res.body.data.user_id.should.equal(1);
                            res.body.data.amount.should.equal(400);
                            done();
                        });
                });
        });
    });
    describe('GET /api/wallet/transactions/:id (GET ALL TRANSACTIONS)', function () {
        it('should return error because no token is provided', function (done) {
            chai.request(app)
                .get('/api/wallet/transactions/1')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done();
                });
        });
        it('fail to get wallet transactions with invalid user_id (id in token different from user_id sent)', function (done) {
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
                        .get('/api/wallet/transactions/2')
                        .set({ Authorization: `Bearer ${token}` })
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.have.property('success');
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });
        it('should return wallet transactions (token sent)', function (done) {
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
                        .get('/api/wallet/transactions/1')
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
});
