import React from 'react'; 

import LandingPage from './LandingPage';
import {BrowserRouter as Router} from 'react-router-dom';
import Adapter from 'enzyme-adapter-react-16';
import {configure} from 'enzyme';
import renderer from 'react-test-renderer';

configure({adapter: new Adapter});

describe('<LandingPage/>',()=>{
    it('matches snapshot',()=>{
        const wrapper = renderer.create(<Router>
            <LandingPage/>
        </Router>).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});