import React, {useState} from 'react';
import SelectInput from 'ink-select-input';
import Layout from "./Layout";
import {HomeScreen} from "./screens/HomeScreen";
import {BotConnectScreen} from "./screens/BotConnectScreen";
import LogsScreen from "./screens/LogsScreen";
import ExecuteScreen from "./screens/ExecuteScreen";

export default () => {
    const [botConfig, setBotConfig] = useState({
        id: 'Test',
        host: 'localhost',
        port: 4268,
        token: 'qwerty123',
    })
    const [screen, setScreen] = useState('')

    let CurrentScreen: JSX.Element = <HomeScreen/>
    if (!botConfig?.id)
        CurrentScreen = <BotConnectScreen botConfig={botConfig} />
    else {
        switch (screen) {
            case 'logs':
                CurrentScreen = <LogsScreen botConfig={botConfig} />
                break
            case 'exec':
                CurrentScreen = <ExecuteScreen botConfig={botConfig} />
                break
            default:
                function handleSelect(item: { label: string, value: string }){
                    setScreen(item.value)
                }
                CurrentScreen = <SelectInput items={[
                    { label: 'View Logs', value: 'logs' },
                    { label: 'Execute Command', value: 'exec' },
                ]} onSelect={handleSelect} />
                break
        }
    }


    return (<>
        <Layout>
            { CurrentScreen }
        </Layout>
    </>)
}