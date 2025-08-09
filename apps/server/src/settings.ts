

const getCorsConfig = () => { 
    if (process.env.NODE_ENV === 'dev') { 
        return {
            origin : ['http://localhost:5173'], 
            credentials : true 
        }
    }
}

export default () => ({
    getCorsConfig : () => getCorsConfig()
})