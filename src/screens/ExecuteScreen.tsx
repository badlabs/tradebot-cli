import React, {useState} from "react";
import {BotConfig} from "../models";
import { TRPCRouterHTTP } from "../../src";
import {TRPCClientError, TRPCLink, createTRPCProxyClient} from '@trpc/client';
import { observable } from '@trpc/server/observable';
import axios from "axios";
import {Box, Text, Newline} from "ink";
import SelectInput from "ink-select-input";
import {AnyRouter} from "@trpc/server";

const createAxiosLink: <TRouter extends AnyRouter>(opts: {url: string, token?: string}) => TRPCLink<TRouter> =
    ({ url, token }) => () => {
    // here we just got initialized in the app - this happens once per app
    // useful for storing cache for instance
    return ({ next, op }) => {
        // this is when passing the result to the next link
        // each link needs to return an observable which propagates results
        return observable((observer) => {
            console.log('performing operation:', op);
            axios.request({
                method: op.type === 'query' ? 'GET' : 'POST',
                url: `${url}/${op.path}`,
                params: op.type === 'query' ? op.input : {},
                data: op.type === 'query' ? undefined : op.input,
                headers: {
                    Authorization: token ? `Bearer ${token}` : token
                }
            }).then(res => {
                observer.next(res.data)
                observer.complete()
            }).catch(cause => observer.error(TRPCClientError.from(cause)))
            return () => {};
        });
    };
};

export default (props: {
    botConfig: BotConfig
}) => {
    const client = createTRPCProxyClient<TRPCRouterHTTP>({
        links: [
            createAxiosLink({
                url: `http://${props.botConfig.host}:${props.botConfig.port}/api/trpc`,
                token: props.botConfig.token
            })
        ]
    })
    const [response, setResponse] = useState<any>()
    function handleSelect(item: {label: string, value: string}) {
        const processPromise = (promise: Promise<any>) => {
            promise
                .then(res => setResponse(res))
                .catch(err => setResponse(err))
        }
        switch (item.value) {
            case 'portfolio.get':
                processPromise(client.portfolio.get.query())
                break
            case 'portfolio.update':
                processPromise(client.portfolio.update.mutate())
                break
            case 'portfolio.clear':
                processPromise(client.portfolio.clear.mutate())
                break
            case 'algorithms.list':
                processPromise(client.algorithms.list.query())
                break
            case 'currencies.list':
                processPromise(client.currencies.list.query())
                break
            case 'currencies.update':
                processPromise(client.currencies.update.mutate())
                break
            case 'currencies.listBalances':
                processPromise(client.currencies.listBalances.query())
                break
            case 'currencies.updateBalances':
                processPromise(client.currencies.updateBalances.mutate())
                break
            case 'securities.list':
                processPromise(client.securities.list.query())
                break
            case 'securities.update':
                processPromise(client.securities.update.mutate())
                break
            case 'securities.listFollowed':
                processPromise(client.securities.listFollowed.query())
                break
        }
    }
    return <>
        <SelectInput
            onSelect={handleSelect}
            items={[
                {label: 'portfolio.get()', value: 'portfolio.get'},
                {label: 'portfolio.update()', value: 'portfolio.update'},
                {label: 'portfolio.clear()', value: 'portfolio.clear'},
                {label: 'algorithms.list()', value: 'algorithms.list'},
                {label: 'currencies.list()', value: 'currencies.list'},
                {label: 'currencies.update()', value: 'currencies.update'},
                {label: 'currencies.listBalances()', value: 'currencies.listBalances'},
                {label: 'currencies.updateBalances()', value: 'currencies.updateBalances'},
                {label: 'securities.list()', value: 'securities.list'},
                {label: 'securities.update()', value: 'securities.update'},
                {label: 'securities.listFollowed()', value: 'securities.listFollowed'}
            ]} />
        <Box flexDirection="column" justifyContent="flex-start">
            {
                !response ? <Text>No response</Text> :
                JSON.stringify(response, null, 2)
                .split('\n')
                .map((line, index) => (<Text key={index}>{line}</Text> ))
            }
        </Box>
    </>
}