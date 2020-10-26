import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components';
import './index.css'

const App = ()=>{
    return (
        <Container>
            <h1>Changes</h1>
        </Container>
    )
}
const Container = styled.div`
color: red;
`


ReactDOM.render(<App />,document.getElementById('root'))