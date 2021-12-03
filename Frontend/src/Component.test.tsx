// @ts-ignore
import React, {useEffect} from 'react'
import {render, queryByTestId} from "@testing-library/react"
import {SettingsButton} from "./Settings";
import {SettingsTab} from "./Settings";
import {Settings} from "./Settings";

it("Renders and maps correctly", () => {
    const testSettings = ["test-1", "test-2", "test-3"]
    const testTitle = "test-title"
    const {queryByTestId} = render(<SettingsTab settings={testSettings} title={testTitle}/>)

    expect(queryByTestId("settings-tab-title").textContent).toBe(testTitle)
    expect((queryByTestId("settings-tab").children.length)).toBe((testSettings.length) + 1)
    expect(queryByTestId("settings-tab")).toBeTruthy()
})

it("Renders correctly", () => {
    const testTitle = "test-title"
    const {queryByTestId} = render(<SettingsButton title={testTitle} index={5}/>)
    expect(queryByTestId("settings-button-5")).toBeTruthy()
})

it("Renders and updates correctly", () => {
    let wrapper = render(<Settings/>)
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')

    useStateSpy.mockImplementation((init) => [init, setState]);

    expect(wrapper.queryByTestId("settings-tab-title")).toHaveTextContent("Generelt")
    //wrapper.queryByTestId("settings-button-4").click()
    //expect(wrapper.queryByTestId("settings-tab-title")).toHaveTextContent("Forbindelser")

})