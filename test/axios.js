// --------------------------------------------------------------------------------------------------------------------

'use strict'

// npm
const test = require('tape')
const axios = require('axios')
const nock = require('nock')

// local
const feed2json = require('../')

// --------------------------------------------------------------------------------------------------------------------

test('axios fetching an RSS file', t => {
  nock('https://bulk.chilts.org')
    .get('/feed2json/rss.xml')
    .replyWithFile(200, __dirname + '/rss2-example.xml', {
      'Content-Type': 'text/xml',
    })
  t.plan(9)

  let url = 'https://bulk.chilts.org/feed2json/rss.xml'
  axios(url)
    .then(response => {
      feed2json.fromString(response.data, url, (err, json) => {
        t.ok(!err, 'no error reading the RSS Feed')

        t.ok(json, 'something appeared in the JSON')
        t.ok(typeof json === 'object', 'The JSON is an object as expected')

        t.equal(
          json.version,
          'https://jsonfeed.org/version/1',
          'JSONFeed version is correct'
        )
        t.equal(json.title, 'Scripting News', 'Title is correct')
        t.equal(
          json.home_page_url,
          'http://www.scripting.com/',
          'Home Page URL is correct'
        )
        t.equal(
          json.description,
          'A weblog about scripting and stuff like that.',
          'Description is correct'
        )
        t.equal(json.author.name, 'dave@userland.com', 'Author Name is correct')

        t.equal(json.items.length, 9, 'There are two items as expected.')

        t.end()
      })
    })
    .catch(err => {
      t.fail("Request shouldn't have failed")
    })
})

test('axios streaming an RSS file', t => {
  nock('https://bulk.chilts.org')
    .get('/feed2json/rss.xml')
    .replyWithFile(200, __dirname + '/rss2-example.xml', {
      'Content-Type': 'text/xml',
    })
  t.plan(9)

  let url = 'https://bulk.chilts.org/feed2json/rss.xml'
  axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  })
    .then(response => {
      feed2json.fromStream(response.data, url, (err, json) => {
        t.ok(!err, 'no error reading the RSS Feed')

        t.ok(json, 'something appeared in the JSON')
        t.ok(typeof json === 'object', 'The JSON is an object as expected')

        t.equal(
          json.version,
          'https://jsonfeed.org/version/1',
          'JSONFeed version is correct'
        )
        t.equal(json.title, 'Scripting News', 'Title is correct')
        t.equal(
          json.home_page_url,
          'http://www.scripting.com/',
          'Home Page URL is correct'
        )
        t.equal(
          json.description,
          'A weblog about scripting and stuff like that.',
          'Description is correct'
        )
        t.equal(json.author.name, 'dave@userland.com', 'Author Name is correct')

        t.equal(json.items.length, 9, 'There are two items as expected.')

        t.end()
      })
    })
    .catch(err => {
      t.fail("Request shouldn't have failed")
    })
})

// test('request stream an Atom file', (t) => {
//   t.plan(9)

//   let url = 'https://bulk.chilts.org/feed2json/atom.xml'
//   let stream = request(url)

//   feed2json.fromStream(stream, url, (err, json) => {
//     t.ok(!err, 'no error reading the RSS Feed')

//     t.ok(json, 'something appeared in the JSON')
//     t.ok(typeof json === 'object', 'The JSON is an object as expected')

//     t.equal(json.version, "https://jsonfeed.org/version/1", 'JSONFeed version is correct')
//     t.equal(json.title, "Andrew Chilton", "Title is correct")
//     t.equal(json.home_page_url, "https://chilts.org/", "Home Page URL is correct")
//     t.equal(json.description, "A blog about tech.", "Description is correct")
//     t.equal(json.author.name, "Andrew Chilton", "Author Name is correct")

//     t.equal(json.items.length, 2, "There are two items as expected.")

//     t.end()
//   })
// })

// test('request a 404', (t) => {
//   t.plan(1)

//   let url = 'https://bulk.chilts.org/feed2json/404.xml'
//   let stream = request(url)

//   feed2json.fromStream(stream, url, (err, json) => {
//     t.ok(!!err, 'error trying to request this file')
//     t.end()
//   })
// })

// test('invalid url', (t) => {
//   t.plan(1)

//   let url = 'https://org/rss.xml'
//   let stream = request(url)

//   feed2json.fromStream(stream, url, (err, json) => {
//     t.ok(!!err, 'error trying to request this file')
//     t.end()
//   })
// })

// test('invalid protocol', (t) => {
//   t.plan(1)

//   let url = 'ftp://example.org/rss.xml'
//   try {
//     let stream = request(url)
//   }
//   catch(err) {
//     t.ok(!!err, 'the error is thrown by request')
//     t.end()
//     return
//   }

//   t.fail("Should reach here since request throws with an invalid protocol")

//   t.end()
// })

// --------------------------------------------------------------------------------------------------------------------
