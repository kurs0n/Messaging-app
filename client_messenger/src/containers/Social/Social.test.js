import React from 'react';

import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {configure,mount, shallow, render} from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Navigation from '../../components/Navigation/Navigation';
import Social from './Social';
import {Spinner,Button} from 'react-bootstrap';

let store = configureMockStore()({});
configure({adapter: new Adapter});

describe('<Social/>',()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(
            <Provider store={store}>
                <Social />
            </Provider>
        );
    });
    it('matches snapshot',()=>{
        localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmM2MzYzYwZjkyZjNhMWUzYzc1ZjIwZiIsImlhdCI6MTU5ODM0ODEyMn0.lZFeZwwL0kevnI--7bKmY8tEX1W5Vwx2zedwvqneCws');
        wrapper = renderer.create(
            <Provider store={store}>
            <Social />
        </Provider>
        ).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
    it('should render Navigation', ()=>{
        expect(wrapper.find(Navigation)).toBeTruthy();
    });
    it('should render spinner and input if we are logged',()=>{
        expect(wrapper.find('input')).toBeTruthy();
        expect(wrapper.find(Spinner)).toBeTruthy();
        expect(wrapper.find('h1')).toHaveLength(0);
    }); 
    it('should render h1 if we are not logged',()=>{
        localStorage.removeItem('token'); //why? 
        wrapper = mount( // wrapper update not working lol
            <Provider store={store}>
            <Social />
        </Provider>
        );
        expect(wrapper.find('h1').at(0).text()).toEqual('Login first 📜');
        expect(wrapper.find('h1').at(1).text()).toEqual("And Start Messaging ✏️ ");
        expect(wrapper.find(Button).text()).toEqual('Login');
    });
    it('should fire function when we go to social',()=>{
        const getUsers = jest.fn(); 
        const handleRender = jest.spyOn(React,'useEffect');
        handleRender.mockImplementation(user=>[user,getUser]);
        expect(getUsers).toBeTruthy();
    });
});