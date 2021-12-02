import { useContext, useState, useEffect } from 'react'


const SettingsButton = (props) => {
    return(
        <button className="w-56 px-6 py-1.5 text-2xl font-bold text-white rounded-lg border-2 border-lightPrimary dark:border-primary bg-lightSecondary hover:bg-opacity-80 dark:bg-secondary dark:hover:bg-secondary filter dark:hover:brightness-50 shadow-lg transition duration-500 ease-in-out">{props.title}</button>
    )
}

const SettingsTab = (props) => {
    return(
        <div className="flex flex-col mt-5 flex-1">
            <h1 className="text-5xl text-black mb-5">{props.title}</h1>
            <div className="text-xl">
                {props.settings.map(str =>
                    <p>{str}</p>
                )}
            </div>
        </div>
    )
}

export const Settings = () => {
    const settings = [["Tekst størrelse", "Teksttype"], ["Visninger"], ["Flade farve"], ["Database forbindelse"],["Medarbejde visning"]];
    const titles = ["Generelt", "Kalender", "Grænseflade", "Forbindelser", "Brugerflade"];
    let [content, setContent] = useState(settings[0]);
    let [title, setTitle] = useState(titles[0]);

    useEffect(() => {
        console.log(content + " " + title)
    }, [content, title])

    function update(index) {
        setContent(settings[index]);
        setTitle(titles[index]);
        console.log("updated")
    }

    return (
        <div className="flex flex-row">
            <ul className="flex flex-col h-full mt-10 ml-5 p-2 gap-y-10">
                <li onClick={() => update(0)}><SettingsButton  title='Generelt' /> </li>
                <li onClick={() => update(1)}><SettingsButton  title='Kalender' /></li>
                <li onClick={() => update(2)}><SettingsButton  title='Grænseflade'/></li>
                <li onClick={() => update(3)}><SettingsButton  title='Forbindelser'/></li>
                <li onClick={() => update(4)}><SettingsButton  title='Brugerflade'/></li>

            </ul>
            <div className="flex w-full mx-5 my-5 mr-5 border-2 border-lightgrey rounded-md ">
            </div>
            <div >
                <SettingsTab title={title} settings={content}/>
            </div>
        </div>
    )
}
