import React from 'react';

import {Provider} from 'react-redux';
import {Form,Image} from 'react-bootstrap';
import Messenger from './Messenger';
import Message from '../../components/Message/Message';
import Adapter from 'enzyme-adapter-react-16';
import {configure,mount} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

let store = configureMockStore()({    messages: [{
    _id: 'dummy',
    person: {
        name: 'siema',
        surname: 'elo'
    },
    message: 'elooooooo'
}]});
configure({adapter: new Adapter});

describe('<Messenger />', ()=>{
    let wrapper;
    beforeEach(()=>{
        window.HTMLElement.prototype.scrollIntoView = function() {};
        wrapper = mount(
        <Provider store={store}>
            <Messenger/>
        </Provider>
        );
    });
    it('matches snapshot',()=>{
        wrapper = renderer.create(
            <Provider store={store}>
            <Messenger/>
        </Provider>
        ).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render message',()=>{
        expect(wrapper.find(Message)).toHaveLength(1);
    });
    it('should render Form.Control',()=>{
        expect(wrapper.find(Form.Control)).toHaveLength(1);
    });
    it('should render image which means sending message',()=>{
        expect(wrapper.find(Image)).toHaveLength(1);
    }); 
    it("should render paragraph if we don't have messages",()=>{
        store = configureMockStore()({messages: []});
        wrapper = mount(
            <Provider store={store}>
            <Messenger/>
        </Provider>
        );
        expect(wrapper.find('p').text()).toEqual('Type something !✋');
    });
});