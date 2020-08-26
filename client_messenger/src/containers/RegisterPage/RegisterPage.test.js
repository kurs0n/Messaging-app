import React from 'react';
import {configure,shallow} from 'enzyme';
import {Form,Button} from 'react-bootstrap';
import renderer from 'react-test-renderer';
import Register from './RegisterPage';
import Adapter from 'enzyme-adapter-react-16';


configure({adapter: new Adapter});

describe('<RegisterPage/>',()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper= shallow(<Register/>);
    });
    it('matches snapshot',()=>{
        wrapper = renderer.create(<Register/>);
        expect(wrapper).toMatchSnapshot();
    });
    it('render five inputs',()=>{
        expect(wrapper.find(Form.Control)).toHaveLength(5);
    })
    it('render button with register',()=>{
        expect(wrapper.find(Button).text()).toEqual('Register');
    });
}); 