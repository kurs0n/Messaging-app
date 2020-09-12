const expect = require('chai').expect;
const sinon = require('sinon');
const Account = require('../models/account');
const Conversation = require('../models/conversation');
const mongoose = require('mongoose');
const {addFriend,sendMessage, getFriends,getConversation,getMe, getUsers,acceptFriend} = require('../controllers/user');
require('dotenv').config();

describe('User controller',()=>{
     describe('AddFriend',()=>{

        beforeEach(()=>{
            sinon.stub(Account,'findOne');
        })

        it("should fire error when we can't find user",(done)=>{
            const req = {
                userId: '12345',
                body: {
                    _id: '12345'
                }
            };
            Account.findOne.returns(null);
            addFriend(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.be.property('statusCode',500);
                expect(result).to.be.property('message',"Can't find this account");
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        it('should fire error when we have the same user and friend id',(done)=>{
            const req = {
                userId: '12345',
                body: {
                    _id: '12345'
                }
            }
            Account.findOne.returns({
                _id: '1235'
            });
            addFriend(req,{},()=>{})
            .then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.be.property('statusCode',500);
                expect(result).to.be.property('message',"You can't add yourself to friends xD");
                done();
            })
            .catch(err=>{
                done(err);
            })
        });

        it('should return a response',(done)=>{
            const req = {
                body: {
                    id: '123456789'
                },
                userId: '50600060'
            }
            const res = {
                statusCode: 0,
                message: '',
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.message = data.message;
                }
            };
            Account.findOne.onCall(0).returns({_id: '1',friends: [],save: ()=>{}});
            Account.findOne.onCall(1).returns({_id: '2',friends: [],save: ()=>{}});
            addFriend(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal('Succesfully added friend :)');
                done();
            })
            .catch(err=>{
                done(err);
            });
        });

        afterEach(()=>{
            Account.findOne.restore();
        })
    });

    describe('sendMessage',()=>{
        before((done)=>{
            mongoose.connect(process.env.DB_URL_TEST,{useNewUrlParser: true,useUnifiedTopology: true})
            .then(()=>{
                done();
            })
            .catch(err=>{
                done(err);
            })
        })

        it("should create conversation if we don't have",(done)=>{
            const account1 = new Account({
                email: 'dummy',
                name: 'dummy',
                surname: 'dummy',
                login: 'dummy',
                password: 'dummy',
                friends: []
            });
            const account2 = new Account({
                email: 'dummy1',
                name: 'dummy1',
                surname: 'dummy1',
                login: 'dummy1',
                password: 'dummy1',
                friends: []
            })
            const req = {
                body:{ 
                    id: account1._id.toString(),
                    message: 'dummy'
                },
                userId: account2._id.toString()
            };
            const res ={
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                }
            }
            sinon.stub(Conversation,'findOne');
            sinon.stub(require('../utils/socket'),'getIo');
            require('../utils/socket').getIo.returns({emit: (first,second)=>{return null;}});
            Conversation.findOne.returns(null);
            sendMessage(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(201);
                expect(res.message).to.be.equal('Created conversation and send message');
                Conversation.findOne.restore();
                done();
            })
            .catch(err=>{
                console.log(err);
                Conversation.findOne.restore();
                done(err);
            })
        })
        it('should add message if we have conversation',(done)=>{
            const account1 = new Account({
                email: 'dummy',
                name: 'dummy',
                surname: 'dummy',
                login: 'dummy',
                password: 'dummy',
                friends: []
            });

            const account2 = new Account({
                email: 'dummy1',
                name: 'dummy1',
                surname: 'dummy1',
                login: 'dummy1',
                password: 'dummy1',
                friends: []
            });

            const conversation = new Conversation({
                person1: account1._id,
                person2: account2._id,
                messages: []
            });

            const req = {
                body:{ 
                    id: account1._id.toString(),
                    message: 'dummy'
                },
                userId: account2._id.toString()
            };

            const res = {
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(res){
                    this.message = res.message
                }
            };

            conversation.save().then(()=>{
                return sendMessage(req,res,()=>{});
            })
            .then(()=>{
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.not.equal('');
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        })

        after((done)=>{
            Conversation.deleteMany({})
            .then(()=>{
                return mongoose.disconnect();
            })
            .then(()=>{
                done()
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        })
    })

    describe('getFriends',()=>{
        beforeEach(()=>{
            sinon.stub(Account,'findOne');
            sinon.stub(Account,'populate');
        });

        it("should throw an error if we don't find user",(done)=>{
            const req = {
                userId: '34789645'
            };
            Account.findOne.returns(Account);
            Account.populate.returns({friends: []});
            getFriends(req,{},()=>{})
            .then(res=>{
                expect(res).to.be.an('error');
                expect(res).to.be.property('statusCode',500);
                expect(res).to.be.property('message',"You don't have friends :(");
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            });
        });
        it('should send response with friends array',(done)=>{
            const req = {
                userId: '34789645'
            };
            const res = {
                friends: [],
                statusCode: 0,
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.friends = response.friends
                }
            }
            Account.findOne.returns(Account);
            Account.populate.returns({friends: [{name: 'dummy'}]});
            getFriends(req,res,()=>{})
            .then(()=>{
                expect(res.statusCode).to.be.equal(200);
                expect(res.friends.length).to.be.not.equal(0);
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        afterEach(()=>{
            Account.findOne.restore();
            Account.populate.restore();
        });
    });
    describe('getConversation',()=>{
        beforeEach(()=>{
            sinon.stub(Conversation,'findOne');
            sinon.stub(Conversation,'populate');
        });

        it('should return empty messages conversation',(done)=>{
            const req = {
                get: function(something){
                    return 'dummy_id'
                }
            };
            const res = {
                statusCode: 0,
                messages: [],
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(res){
                    this.messages = res.messages
                }
            }
            Conversation.findOne.returns(Conversation);
            Conversation.populate.returns(null);
            getConversation(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.messages.length).to.be.equal(0);
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });
        it('should return a messages',(done)=>{
            const req = {
                get: function(something){
                    return '1234576'
                }
            };
            const res = {
                statusCode: 0,
                messages: [],
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(res){
                    this.messages = res.messages;
                }
            };
            Conversation.findOne.returns(Conversation);
            Conversation.populate.returns({messages: [{body: 'dummy'}]});
            getConversation(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.messages.length).to.be.not.equal(0);
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        })

        afterEach(()=>{
            Conversation.findOne.restore();
            Conversation.populate.restore();
        });
    });
    describe('getMe',()=>{
        before(()=>{
            sinon.stub(Account,'findOne');
        })
        it('should return response',(done)=>{
            const req = {
                 userId: '3145475'
            };
            const res = {
                statusCode: 0,
                user: {},
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(res){
                    this.user = res;
                }
            }
            Account.findOne.returns({name: 'dummy',surname: 'dummy',select: function(){return this;}});
            getMe(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.user.name).to.be.equal('dummy');
                done();
            })
            .catch(err=>{
                console.log(err);

                done(err);
            })
        });

        after(()=>{
            Account.findOne.restore();
        });
    });
    
    describe('getUsers',()=>{
        beforeEach(()=>{
            sinon.stub(Account,'find');
        })

        it('should return empty accounts array',(done)=>{
            const req = {
                get: function(something){
                    return 'something'
                }
            };
            const res = {
                statusCode: 0,
                accounts: [],
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.accounts = response.accounts;
                }
            };
            Account.find.returns([{name: ''}]);
            getUsers(req,res,()=>{})
            .then(()=>{
                //console.log(res); 
                expect(res.accounts.length).to.be.equal(0);
                expect(res.statusCode).to.be.equal(200);
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });
        it('should return a filtered accounts array',(done)=>{
            const req = {
                get: function(something){
                    return 'something'
                }
            };
            const res = {
                statusCode: 0,
                accounts: [],
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.accounts = response.accounts;
                }
            };
            Account.find.returns([{name: 'something'}]);
            getUsers(req,res,()=>{})
            .then(()=>{
                //console.log(res); 
                expect(res.accounts.length).to.be.not.equal(0);
                expect(res. accounts[0].name).to.be.equal('something');
                expect(res.statusCode).to.be.equal(200);
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        afterEach(()=>{
            Account.find.restore();
        })
    });

    describe('acceptFriend',()=>{
        beforeEach(()=>{
            sinon.stub(Account,'findOne');
        });

        it("should return response with message You can't do like that",(done)=>{
            const req = {
                body:{
                    id: '12345'
                },
                userId: '32156'
            };
            const res = {
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                    return true;
                }
            }
            Account.findOne.onCall(0).returns({friends: [{friend: '12345',send: true}]});
            Account.findOne.onCall(1).returns({_id: '12345'});
            acceptFriend(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal( "You can't do like that");
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        it('should return, that we are friends already',(done)=>{
            const req = {
                body:{
                    id: '12345'
                },
                userId: '32156'
            };
            const res = {
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                    return true;
                }
            }
            Account.findOne.onCall(0).returns({friends: [{friend: '12345',send: false,accepted: true}]});
            Account.findOne.onCall(1).returns({_id: '12345'});
            acceptFriend(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal('You are already friends :)');
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        it('should return, that we are friends but to another person to be added',(done)=>{
            const req = {
                body:{
                    id: '12345'
                },
                userId: '32156'
            };
            const res = {
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                    return true;
                }
            }
            Account.findOne.onCall(0).returns({_id: '12345',friends: []});
            Account.findOne.onCall(1).returns({friends: [{friend: '12345',send: false}]});
            acceptFriend(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal("You can't do like that");
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        it('should return, that we are friends already but to another person to be added',(done)=>{
            const req = {
                body:{
                    id: '12345'
                },
                userId: '32156'
            };
            const res = {
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                    return true;
                }
            }
            Account.findOne.onCall(0).returns({_id: '12345',friends: []});
            Account.findOne.onCall(1).returns({friends: [{friend: '12345',send: true,accepted: true}]});
            acceptFriend(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal('You are already friends :)');
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        it('should return response if we try accept yourself to friends',(done)=>{
            const req = {
                body:{
                    id: '12345'
                },
                userId: '32156'
            };
            const res = {
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                    return;
                }
            }
            Account.findOne.onCall(0).returns({_id: '12345',friends: [],save: function(){return;}});
            Account.findOne.onCall(1).returns({_id: '12345',friends: [],save: function(){return;}});
            acceptFriend(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal('Try accept yourself?');
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        it('should accept friends if everything is fine',(done)=>{
            const req = {
                body:{
                    id: '12345'
                },
                userId: '32156'
            };
            const res = {
                statusCode: 0,
                message: '',
                status: function(code){
                    this.statusCode = code;
                    return this;
                },
                json: function(response){
                    this.message = response.message;
                    return;
                }
            }
            Account.findOne.onCall(0).returns({_id: '56456',friends: [],save: function(){return;}});
            Account.findOne.onCall(1).returns({_id: '12345',friends: [],save: function(){return;}});
            acceptFriend(req,res,()=>{})
            .then(()=>{
                //console.log(res);
                expect(res.statusCode).to.be.equal(200);
                expect(res.message).to.be.equal('Accepted friends :)');
                done();
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        });

        afterEach(()=>{
            Account.findOne.restore();
        });
    });
});