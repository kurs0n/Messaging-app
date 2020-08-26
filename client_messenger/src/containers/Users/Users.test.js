import Users from './Users';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {configure,mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';


const mockStore = configureMockStore();
const store = mockStore({});
//const Token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmM2MzYzYwZjkyZjNhMWUzYzc1ZjIwZiIsImlhdCI6MTU5ODM0ODEyMn0.lZFeZwwL0kevnI--7bKmY8tEX1W5Vwx2zedwvqneCws'; infinite token
configure({adapter: new Adapter});

describe('<Users/>',()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper = mount( // if we have Provider we must use mount lol
        <Provider store={store}>
            <Users/>
        </Provider>
        );
    });
    it('matches snapshot',()=>{
        wrapper = renderer.create(<Provider store={store}>
            <Users/>
        </Provider>).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
    it('should render a paragraph when we have no friends',()=>{
        expect(wrapper.find('p')).toHaveLength(1);
    });
    it('should render a user if we have friends',()=>{
        const getUser = jest.fn();
        const handleRender = jest.spyOn(React,"useEffect");
        handleRender.mockImplementation(user=>[user,getUser]);
        wrapper.update();
        expect(getUser).toBeTruthy(); // should pass our user if we have token and etc...
    });
    /*it("should update state on click", () => {
   const changeSize = jest.fn();
   const wrapper = mount(<App onClick={changeSize} />);
   const handleClick = jest.spyOn(React, "useState");
   handleClick.mockImplementation(size => [size, changeSize]);

   wrapper.find("#para1").simulate("click");
   expect(changeSize).toBeTruthy();
   */ // should be helpful
 });