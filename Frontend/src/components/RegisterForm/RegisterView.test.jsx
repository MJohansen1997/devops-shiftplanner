import React, {useState} from 'react'
import {RegisterForm} from './RegisterView'
import { render, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('RegisterView', () => {
   test('That register pops up', () => {
      const Wrapper = () => {
         const [isOpen, setIsOpen] = useState(true)
         return <RegisterForm popValues={{isOpen, setIsOpen}}/>
      }

      
      const {getByTestId} = render(<Wrapper/>)
      
      expect(getByTestId("PopUp-frame")).toBeInTheDocument()
      
   })
   
   test('Thar register closes', () => {
      const Wrapper = () => {
         const [isOpen, setIsOpen] = useState(true)
         return <RegisterForm popValues={{isOpen, setIsOpen}}/>
      }

      const {getByTestId, queryByTestId} = render(<Wrapper/>)
      
      expect(getByTestId("PopUp-frame")).toBeInTheDocument()
      fireEvent.click(getByTestId("PopUp-close"))
      expect(queryByTestId("PopUp-frame")).not.toBeInTheDocument()
      
   })
})