import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { getDayShifts } from './CalendarUserFetches'
import { IFruitData, User, Shift, UserDayShift, } from 'devops-shiftplanner/Backend/src/Types'
import { ObjectId } from 'mongodb'
// import axiosMock from 'axios'
import axios from 'axios'

afterEach(cleanup)

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Calendar View Day testing', () => {
   test.only('testing axios get', async () => {
      const date = "2021-12-14";
      const data: UserDayShift = { 
         firstname: "mikkel" ,
         email: "123@123.com",
         shift: [{
            _id: new ObjectId("111111111111111111111113"),
            emp_id: new ObjectId("bonk"),
            date: new Date("2021-12-14"),
            startTime: 8,
            endTime: 16
         }]
      }

      // mockedAxios.get.mockResolvedValueOnce(data)
      
      await expect(getDayShifts(date)).resolves.toEqual(data)
      
   })
})