const express = require('express')
const app = express()
const port = 3000

const ethUtil = require('ethereumjs-util')
const sortObject = require('sortobject')

let receivedRequests

app.post('/auth', async (req, res) => {
  try {
    if (typeof req.body.bloom_id !== 'number') {
      throw Error('Missing expected `bloom_id` of type `number` field in request.')
    }
    if (!(req.body.data instanceof Array)) {
      throw Error(
        'Missing expected `data` field of type `Array` field in request.'
      )
    }
    if (typeof req.body.token !== 'string') {
      throw Error(
        'Missing expected `token` field of type `string` field in request.'
      )
    }
    if (typeof req.body.signature !== 'string') {
      throw Error(
        'Missing expected `signature` field of type `string` field in request.'
      )
    }
    // console.log(req.body.bloom_id, req.body.data, req.body.token, req.body.signature, req.body.signerEthAddress)
    receivedRequests.push(req.body)

    // // Recover address of wallet that signed the payload
    // const qrToken = (String(req.body.token)).trim();
    // const signature: string = req.body.signature
    // // const parsedData: IShareData[] = req.body.data
    // const sortedData = req.body.data.map(d => sortObject(d))
    // const sortedDataJSON = JSON.stringify(
    //   sortObject({
    //     data: sortedData,
    //     token: qrToken,
    //   })
    // )
    // console.log(`sortedDataJSON = ${sortedDataJSON}`)

    // const packedData: string = ethUtil.addHexPrefix(ethUtil.keccak256(sortedDataJSON))
    // console.log(`Previously computed packedData = ${req.body.packedData}`)
    // console.log(`Newly computed packedData = ${packedData}`)
    // if (req.body.packedData !== packedData) {
    //   throw Error(
    //     "Previously computed packedData doesn't match the newly computed " +
    //       `packedData for the following data: ${sortedDataJSON}`
    //   )
    // }

    // const signerEthAddress = ethUtil.recoverHashSigner(
    //   ethUtil.toBuffer(packedData),
    //   signature
    // )
    // console.log(`signerEthAddress = '${signerEthAddress}'`)
    // Check that the recovered address matches the subject of the attestation
    // ...
    // ...

    // Validate parsedData using the embedded Merkle Proof
    // ...
    // ...

    return res.status(200).json({
      success: true,
      token: req.body.token,
    })
  } catch (error) {
    console.log(
      'Encountered an error while receiving data',
      JSON.stringify({
        error,
      })
    )

  }
})


app.get('/requests', (req, res) => 

  res.send(receivedRequests)

)

app.get('/', (req, res) => 

  res.send('Welcome, nothing to show here. <br> Paths are : requests & auth')

)

app.listen(port, function () {
  console.log('Dev app listening on port ', port);
});