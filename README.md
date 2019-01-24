# egain-config
JavaScript library for interfacing with eGain back-end systems.

## Usage
```js
const Egain = require('egain-config')
// create eGain interface object
const egain = new Egain({
  fqdn: 'cceece.dcloud.cisco.com',
  username: 'sa',
  password: 'C1sco12345'
})

// connect to egain database
egain.connect()
.then(egain => {
  // then list agents
  egain.agent.changeAttribute(5002, 'FIRST_NAME', 'Jimothy')
  .then(function () {
    console.log(`agent 5002 first name changed to 'Jimothy'`)
    process.exit(0)
  })
  .catch(e => {
    // error changing attribute
    console.log(e.message)
  })
})
.catch(e => {
  // error connecting to egain database
  console.log(e.message)
})
```
