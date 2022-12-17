import {Newline, Text} from "ink";
import React from "react";
import {BotConfig} from "../models";

export const BotConnectScreen = (props: {
    botConfig: BotConfig
}) => {
    return (<>
        <Text>To connect to bot</Text><Newline />
        <Text>ID: {props.botConfig.id}</Text><Newline />
        <Text>Host: {props.botConfig.host}</Text><Newline />
        <Text>Port: {props.botConfig.port}</Text><Newline />
        <Text>Token: {props.botConfig.token}</Text><Newline />
    </>)
}