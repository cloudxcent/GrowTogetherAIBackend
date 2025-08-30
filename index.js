const app = require('./app')

app.get('/', (req, res) => {
    res.json({ message: 'Admin API response' })
})

app.listen(6000, () => {
    console.log('Server is running on http://localhost:6000');
});
