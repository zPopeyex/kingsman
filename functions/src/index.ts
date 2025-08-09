import * as functions from 'firebase-functions'

export const helloWorld = functions.https.onRequest((_req, res) => {
  res.send('Hello from Firebase!')
})
