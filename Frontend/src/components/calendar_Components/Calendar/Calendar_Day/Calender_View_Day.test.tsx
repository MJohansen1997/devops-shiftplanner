import React from 'react'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { CalendarDay } from './Calender_View_Day';
import ReactRouter, { useParams } from 'react-router'
import { UserDayShift, Shift } from '../../../../../../Backend/src/Types'
import axios from 'axios'
import '@testing-library/jest-dom';
import { format } from 'date-fns'
import MockAdapter from "axios-mock-adapter";
import {ObjectId} from 'mongodb'

afterEach(cleanup)

beforeEach(() => {
   
   
   // jest.mock('axios');
   // axios.get = jest.fn().mockResolvedValue({ data: '' });
   // axios.post = jest.fn().mockResolvedValue('');
 });

 
 // mocking useParams.. shit
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
   useParams: () => ({
     date: '2021-12-14',
   }),
   useRouteMatch: () => ({ url: '/calendarDay/2021-12-14' }),
 }));

 
 
const user: UserDayShift = {
   firstname: "mikkel",
   email: "123@123.com",
   shift: [{
      _id : new ObjectId("111111111111111111111113"),
      emp_id: new ObjectId("618f263390cf068ff0dc71e5"),
      date : new Date(),
      startTime : 8,
      endTime : 16
   }]
}
 
describe('calendar day view', () => {
   
   
   test('test', async () => {
      // jest.spyOn(ReactRouter, 'useParams').mockReturnValue({date: "2021-12-14"})
      
      // axiosMock.get.mockResolvedValueOnce( { data: { firstname: "test"}})
      const date = "2021-12-14"
      const mockAxios = new MockAdapter(axios)
      mockAxios.onPost(`${process.env.REACT_APP_URL}/api/fetchUsersShift`).reply(200, {date})
      
      const response = await waitFor(() => {
         
      })
      
      
      const { getByTestId } = render(<CalendarDay/>)
      expect(getByTestId("loading")).toHaveTextContent("Loading elements..")
      
      const test = await waitFor(() => {
         getByTestId("resolved")
      })
      
      expect(test).toHaveTextContent('test')
      expect(mockAxios.onGet).toHaveBeenCalledTimes(1);
      expect(mockAxios.onGet).toHaveBeenCalledWith()
      
   })
})