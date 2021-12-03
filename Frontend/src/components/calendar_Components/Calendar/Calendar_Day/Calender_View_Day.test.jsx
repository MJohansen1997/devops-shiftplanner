import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { CalendarDay } from './Calender_View_Day';
import ReactRouter, { useParams } from 'react-router'
import { UserDayShift, Shift } from '../../../../../../Backend/src/Types'
import axios from 'axios'
import '@testing-library/jest-dom';
import { format } from 'date-fns'
import mock from "./mock";

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
     date: "2021-12-14",
   }),
   useRouteMatch: () => ({ url: '/calendarDay/2021-12-14' }),
 }));

 
//  Mocking data
const user = [{
   firstname: "mikkel",
   email: "123@123.com",
   shift: [{
      startTime : 8,
      endTime : 16
   }]
}]



describe('calendar day view', () => {
   
   beforeEach(() => {
      mock.reset();
   })
   
   it('test when data havent fetched', async () => {
      mock.onPost('http://localhost:8080/api/fetchUsersShift').networkError();
      
      const {getByTestId}= render(<CalendarDay/>)   
         
      // await waitForComponentToPaint(rendered)
   
      // await waitFor(test).toHaveBeenCalledTimes(1)
      await waitFor(() => 
         expect(getByTestId("loading")).toHaveTextContent("Loading elements..")
      )
      
   });
   
   it(('test when shift data has loaded'), async () => {
      const date = "2021-12-14"

      mock.onPost('http://localhost:8080/api/fetchUsersShift').reply(200, user)
      
      const {getByTestId, getByText} = render(<CalendarDay/>)
      const grid = getByTestId("grid")  
      
      
      const div = await waitFor(() => {
         getByTestId("resolvedshifts")
      })
      
      await waitFor(() => expect(getByTestId("resolvedshifts")).toHaveTextContent("mikkel"))
      
   });
});