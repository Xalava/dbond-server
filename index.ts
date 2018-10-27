const express = require('express')
const app = express()
const port = 3000


// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// export default (app: express.Application) => {
//   // NOTE: This endpoint is public

// app.post('/api/receiveData', async (req, res) => {
//   try {
//     console.log(`Received data for request token ${req.body.token}`)
//     const parsedData: IVerifiedData[] = req.body.data
//     parsedData.forEach(dataToVerify => {
//       console.log(`Attempting to verify ${JSON.stringify(dataToVerify)}`)
//       // Perform addition verifications on the data
//     })
//     return res.status(200).json({
//       success: true,
//       token: req.body.token,
//     })
//   } catch (error) {
//     console.log('Encountered an error while receiving data', {
//       error,
//     })
//     return renderError(req, res)(new ClientFacingError('Encountered an error while receiving data'))
//   }
// }


//   })
// }



const ethUtil = require('ethereumjs-util')
const sortObject = require('sortobject')

export const recoverHashSigner = (hash: Buffer, sig: string): string => {
  const signature = ethUtil.toBuffer(sig)
  const sigParams = ethUtil.fromRpcSig(signature)
  const pubKey = ethUtil.ecrecover(hash, sigParams.v, sigParams.r, sigParams.s)
  const sender = ethUtil.publicToAddress(pubKey)
  return ethUtil.bufferToHex(sender)
}

app.post('/api/receiveData', async (req, res) => {
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

    // Recover address of wallet that signed the payload
    const qrToken = (req.body.token as string).trim()
    const signature: string = req.body.signature
    const parsedData: IShareData[] = req.body.data
    const sortedData = parsedData.map(d => sortObject(d))
    const sortedDataJSON = JSON.stringify(
      sortObject({
        data: sortedData,
        token: qrToken,
      })
    )
    console.log(`sortedDataJSON = ${sortedDataJSON}`)

    const packedData: string = ethUtil.addHexPrefix(keccak256(sortedDataJSON))
    console.log(`Previously computed packedData = ${req.body.packedData}`)
    console.log(`Newly computed packedData = ${packedData}`)
    if (req.body.packedData !== packedData) {
      throw Error(
        "Previously computed packedData doesn't match the newly computed " +
          `packedData for the following data: ${sortedDataJSON}`
      )
    }

    const signerEthAddress = recoverHashSigner(
      ethUtil.toBuffer(packedData),
      signature
    )
    console.log(`signerEthAddress = '${signerEthAddress}'`)
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
    return renderError(req, res)(
      new ClientFacingError('Encountered an error while receiving data')
    )
  }
})
