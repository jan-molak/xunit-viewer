const fs = require('fs')
const path = require('path')
const parser = require('./')

const data = path.resolve(__dirname, '../data')
const output = require(path.join(data, 'output.json'))

const getInput = (name) => {
  return fs.readFileSync(path.join(data, `${name}.xml`)).toString()
}

describe('parser', () => {
  const input = getInput('special_chars_suite')
  const parsed = parser.parse(input)

  it('works', () => {
    expect(removeUUIDs(parsed)).toEqual(removeUUIDs(output))
  })

  it('works for special chars in suite name', () => {
    expect(parsed[1].name).toEqual('@release2017.1.0,, @Mcc272151_10: Display List of Records')
  })
})

function removeUUIDs (output) {
  if (Array.isArray(output)) {
    output.forEach(removeUUIDs)
  } else {
    for (const key in output) {
      if (key === '_uuid') {
        delete output['_uuid']
      } else if (typeof output[key] === 'object') {
        removeUUIDs(output[key])
      }
    }
  }
}
