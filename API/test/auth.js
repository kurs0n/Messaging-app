const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const {signup,login} = require('../controllers/auth');
const Account = require('../models/account');
const bcrypt = require('bcrypt');

describe('Auth Controller',()=>{
    describe('signup',()=>{
        it('should fire an error if account already exist',done=>{
            const req = {
                body: {
                    email: 'dummyemail'
                }
            };
            sinon.stub(Account,'findOne');
            Account.findOne.returns({name: 'dummy'});
            signup(req,{},()=>{})
            .then(result=>{
                expect(result).to.be.an('error');
                expect(result.statusCode).to.be.equal(401);
                expect(result.message).to.be.equal('Account already exist');
                Account.findOne.restore();
                done();
            })
            .catch(err=>{
                done(err);
            })
        });

        it('should create an account and send a response',done=>{
            const req = {
                body: {
                    email: 'dummy',
                    login: 'dummy',
                    password: 'dummy'
                }
            };
            const res = {
                statusCode: 0,
                account: {},
                message: '',
                token: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.account = response.account;
                    this.message = response.message; 
                    this.token = response.token;
                }
            }; 
            sinon.stub(Account,'findOne');
            sinon.stub(Account,'create');
            sinon.stub(jwt,'sign');
            Account.findOne.returns(null);
            Account.create.returns({_id: '12345',name: 'dummy',save: function(){return;}});
            jwt.sign.returns('dummytoken');
            signup(req,res,()=>{})
            .then(()=>{
                expect(res.statusCode).to.be.equal(201);
                expect(res.account.name).to.be.equal('dummy');
                expect(res.message).to.be.equal('Succesfully created account');
                expect(res.token).to.be.equal('dummytoken');
                Account.findOne.restore();
                Account.create.restore();
                jwt.sign.restore();
                done();
            })
            .catch(err=>{
                Account.findOne.restore();
                Account.create.restore();
                jwt.sign.restore();
                done(err);
            });
        });
    });

    describe('login',()=>{
        beforeEach(()=>{
            sinon.stub(Account,'findOne');
        })
        it('should fire error when account not exist',done=>{
            const req={
                body:{
                    login: 'dummy',
                    password: 'dummy'
                }
            }
            Account.findOne.returns(null);
            login(req,{},()=>{})
            .then(result=>{
                expect(result).to.be.an('error');
                expect(result.statusCode).to.be.equal(400);
                expect(result.message).to.be.equal('Account not exist');
                done();
            })
            .catch(err=>{
                done(err); 
            })
        });
        it('should fire error with wrong password',done=>{
            const req={
                body:{
                    login: 'dummy',
                    password: 'dummy'
                }
            }
            sinon.stub(bcrypt,'compare');
            bcrypt.compare.returns(false);
            Account.findOne.returns({_id: 'dummy'});
            login(req,{},()=>{})
            .then(result=>{
                expect(result).to.be.an('error');
                expect(result.statusCode).to.be.equal(401);
                expect(result.message).to.be.equal('Wrong Password');
                bcrypt.compare.restore();
                done();
            })
            .catch(err=>{
                done(err);
            })
        });

        it('should fire response with token',done=>{
            const req={
                body:{
                    login: 'dummy',
                    password: 'dummy'
                }
            }
            const res ={
                statusCode: 0,
                message: '',
                token: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                    this.token = response.token;
                }
            }
            sinon.stub(bcrypt,'compare');
            sinon.stub(jwt,'sign');
            bcrypt.compare.returns(true);
            jwt.sign.returns('token');
            Account.findOne.returns({_id: 'dummy'});
            login(req,res,()=>{})
            .then(()=>{
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal('Logged'),
                expect(res.token).to.be.equal('token');
                bcrypt.compare.restore();
                jwt.sign.restore();
                done();
            })
            .catch(err=>{
                bcrypt.compare.restore();
                jwt.sign.restore();
                done(err);
            })
        });

        afterEach(()=>{
            Account.findOne.restore();
        })
    });
});