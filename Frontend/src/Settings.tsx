// @ts-ignore
import React from 'react'


export const SettingsButton = (props) => {
    return(
        <button className="w-56 px-6 py-1.5 text-2xl font-bold text-white rounded-lg border-2 border-lightPrimary
                dark:border-primary bg-lightSecondary hover:bg-opacity-80 dark:bg-secondary dark:hover:bg-secondary filter
                dark:hover:brightness-50 shadow-lg transition duration-500 ease-in-out"
                onClick={() => props.customOnClickEvent(props.index)}
                data-testid={`settings-button-${props.index}`}>
                {props.title}
        </button>
    )
}

export const SettingsTab = (props) => {
    return(
        <div data-testid="settings-tab" className="flex flex-col mt-5 flex-1">
            <h1 data-testid="settings-tab-title" className="text-5xl text-black mb-5">{props.title}</h1>
                {props.settings.map(str =>
                    <p className="text-xl" key={str.id}>{str}</p>
                )}
        </div>
    )
}

export const Settings = () => {
    const settings = [["Tekst størrelse", "Teksttype"], ["Visninger"], ["Flade farve"], ["Database forbindelse"],["Medarbejde visning"]];
    const titles = ["Generelt", "Kalender", "Grænseflade", "Forbindelser", "Brugerflade"];
    let [content, setContent] = React.useState(settings[0]);
    let [title, setTitle] = React.useState(titles[0]);


    function update(index) {
        setContent(settings[index]);
        setTitle(titles[index]);
    }

    return (
        <div className="flex flex-row">
            <ul data-testid="settings-button-list" className="flex flex-col h-full mt-10 ml-5 p-2 gap-y-10">
                <li key={1}><SettingsButton index={0} customOnClickEvent={update} title='Generelt' /> </li>
                <li key={2}><SettingsButton index={1} customOnClickEvent={update} title='Kalender' /></li>
                <li key={3}><SettingsButton index={2} customOnClickEvent={update} title='Grænseflade'/></li>
                <li key={4}><SettingsButton index={3} customOnClickEvent={update} title='Forbindelser'/></li>
                <li key={5}><SettingsButton index={4} customOnClickEvent={update} title='Brugerflade'/></li>
            </ul>
            <div className="flex w-full mx-5 my-5 mr-5 border-2 border-lightgrey rounded-md ">
            </div>
            <div>
                <SettingsTab data-testid="settings-tab-content" title={title} settings={content}/>
            </div>
        </div>
    )
}

