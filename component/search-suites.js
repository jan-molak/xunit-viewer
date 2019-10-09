import clone from 'clone'
import fuzzysearch from 'fuzzysearch'

const matches = (str, match) => {
  return fuzzysearch(str.toLowerCase(), match.toLowerCase())
}

export default (suites, search) => {
  suites = clone(suites)
  suites = suites.filter(suite => {
    return matches(search.suites, suite.name)
  })

  suites.forEach(suite => {
    if (suite.tests) {
      suite.tests = suite.tests.filter(test => {
        return matches(search.tests, test.name) | matches(search.tests, test.message)
      })
    }

    if (suite.properties) {
      const properties = {}
      properties._uuid = suite.properties._uuid
      Object.keys(suite.properties).forEach(key => {
        const value = suite.properties[key]
        if (matches(search.properties, key) || matches(search.properties, value)) properties[key] = value
      })

      suite.properties = properties
    }
  })

  return suites
}
