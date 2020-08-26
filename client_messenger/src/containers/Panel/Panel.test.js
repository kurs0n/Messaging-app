import React from 'react';

import {Provider} from 'react-redux';
import {Button} from 'react-bootstrap';
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import {configure,shallow,mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Panel from './Panel';
import Messenger from '../Messenger/Messenger';
import InformationUser from '../../components/InformationUser/InformationUser';
import Users from '../Users/Users';

let store = configureMockStore()({
    messages: [{
        _id: 'dummy',
        person: {
            name: 'siema',
            surname: 'elo'
        },
        message: 'elooooooo'
    }],
    personId: '456784567',
    meId: '6987546546'
});
configure({adapter: new Adapter});

describe('<Panel/>',()=>{
    let wrapper;
    beforeEach(()=>{
        window.HTMLElement.prototype.scrollIntoView = function() {};
        wrapper = mount(<Provider store={store}>
            <Panel/>
        </Provider>);
    });
    it('matches snapshot',()=>{
        wrapper = renderer.create(
        <Provider store={store}>
            <Panel/>
        </Provider>
        ).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
    it('should render button logout',()=>{
        expect(wrapper.find(Button).text()).toEqual('logout');
    });
    it('should render InformationPanel',()=>{
        expect(wrapper.find(InformationUser)).toHaveLength(1);
    })
    it('should render messenger component',()=>{
        expect(wrapper.find(Messenger)).toHaveLength(1);
    });
    it('should render Users component',()=>{
        expect(wrapper.find(Users)).toHaveLength(1);
    });
    it('should render h1 tag if we have no friends',()=>{
        store = configureMockStore()({});
        wrapper = mount(<Provider store={store}>
            <Panel/>
        </Provider>);
        expect(wrapper.find('h1').at(2).text()).toEqual('Choose friend or Add him 🧔');
    })
})
