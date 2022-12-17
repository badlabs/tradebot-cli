import React, {useEffect, useState} from "react"
import {BotConfig} from "../models"
import {SocketLogs, initWSClient} from "../../src"
import {Newline, Text} from "ink";
import "websocket-polyfill";

export default (props: {
    botConfig: BotConfig
}) => {
    const [logs, setLogs] = useState<SocketLogs[]>([])
    const [status, setStatus] = useState('disconnected')
    useEffect(() => {
        const client = initWSClient({
            host: props.botConfig.host,
            port: props.botConfig.port
        })
        const subscription = client.log.onEvent.subscribe({
            auth: {
                token: props.botConfig.token
            }
        }, {
            onData: (log) => {
                logs.push(log)
                setLogs([...logs])
            },
            onStarted: () => {
                setStatus('started')
            },
            onStopped: () => {
                setStatus('stopped')
            },
            onComplete: () => {
                setStatus('completed')
            },
            onError: (err) => {
                setStatus(`error: ${JSON.stringify(err)}`)
                subscription.unsubscribe()
            }
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [])
    return <>
        <Text>{status}</Text>
        {logs.map(log => <Text key={log.timestamp}>
                <Text>{log.timestamp} </Text>
                <Text color="cyan">[{log.type}] </Text>
                { log.algorithm ? <Text color="yellow">({log.algorithm.name}:{log.algorithm.run_id}) </Text> : <Text/> }
                <Text>{log.message}</Text>
            </Text>)}
    </>
}