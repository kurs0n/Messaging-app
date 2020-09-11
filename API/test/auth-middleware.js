const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const {isAuth} = require('../middleware/is-auth');

describe('Auth Middleware',()=>{
    it('should throw error if we not have token',()=>{
        const req = {
            get: function(){}
        };
        expect(isAuth.bind(this,req,{},()=>{})).to.throw('Not authenticated!');
    });
    it('should throw error if our verification of token is not passed',()=>{
        const req = {
            get: function(){
                return 'bearer example'
            }
        }
        sinon.stub(jwt,'verify');
        jwt.verify.returns(new Error('error'));
        expect(isAuth.bind(this,req,{},()=>{})).to.throw;
        jwt.verify.restore();
    });
    it('should set userId to request', ()=>{
        const req = {
            get: function(){
                return 'bearer example'
            }
        };
        sinon.stub(jwt,'verify');
        jwt.verify.returns({id: 'example'});
        isAuth(req,{},()=>{});
        expect(req).to.have.property('userId','example');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })
});