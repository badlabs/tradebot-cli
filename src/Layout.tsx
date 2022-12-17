import React from 'react'
import {Box, Text} from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'

type LayoutProps = {
    children: JSX.Element | JSX.Element[]
}

type LayoutState = {}

export default class Layout extends React.Component<LayoutProps, LayoutState> {
    render() {
        return <>
            <Gradient name="teen">
                <BigText font="simple3d" align="center" text="tradebot CLI"/>
            </Gradient>
            <Box borderStyle="round" borderColor="cyan" justifyContent="center" flexDirection="column" padding={1}>
                {this.props.children}
            </Box>
        </>
    }
}