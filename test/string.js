// --------------------------------------------------------------------------------------------------------------------

'use strict'

// core
const fs = require('fs')
const path = require('path')

// npm
var test = require('tape')

// local
var feed2json = require('../')

// --------------------------------------------------------------------------------------------------------------------

test('read a small RSS file', (t) => {
	t.plan(11)

	let string = fs.readFileSync(path.join(__dirname, 'chilts-rss.xml'))
	let url = 'https://chilts.org/rss.xml'

	feed2json.fromString(string, url, (err, json) => {
		t.ok(!err, 'no error reading the RSS Feed')

		t.ok(json, 'something appeared in the JSON')
		t.ok(typeof json === 'object', 'The JSON is an object as expected')

		t.equal(json.version, "https://jsonfeed.org/version/1", 'JSONFeed version is correct')
		t.equal(json.title, "Andrew Chilton", "Title is correct")
		t.equal(json.home_page_url, "https://chilts.org/", "Home Page URL is correct")
		t.equal(json.description, "A blog about tech.", "Description is correct")
		t.equal(json.author.name, "Andrew Chilton", "Author Name is correct")

		t.equal(json.items.length, 2, "There are two items as expected.")

		json.items.forEach(item => {
			t.ok(item.id, 'Each item has an id field')
		})

		t.end()
	})
})

test('read a small Atom file', (t) => {
	t.plan(9)

	let string = fs.readFileSync(path.join(__dirname, 'chilts-atom.xml'))
	let url = 'https://chilts.org/atom.xml'

	feed2json.fromString(string, url, (err, json) => {
		t.ok(!err, 'no error reading the RSS Feed')

		t.ok(json, 'something appeared in the JSON')
		t.ok(typeof json === 'object', 'The JSON is an object as expected')

		t.equal(json.version, "https://jsonfeed.org/version/1", 'JSONFeed version is correct')
		t.equal(json.title, "Andrew Chilton", "Title is correct")
		t.equal(json.home_page_url, "https://chilts.org/", "Home Page URL is correct")
		t.equal(json.description, "A blog about tech.", "Description is correct")
		t.equal(json.author.name, "Andrew Chilton", "Author Name is correct")

		t.equal(json.items.length, 2, "There are two items as expected.")

		t.end()
	})
})

test('read a non-existant file', (t) => {
	t.plan(1)

	let stream = fs.createReadStream(path.join(__dirname, 'does-not-exist.xml'))
	let url = 'https://chilts.org/rss.xml'

	feed2json.fromStream(stream, url, (err, json) => {
		t.ok(!!err, 'error trying to read this file')
		t.end()
	})
})

test('read a file with attachments', (t) => {
	t.plan(4)

const str = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
<channel>
<title>Title of Podcast</title>
<link>http://www.example.com/<link>
<language>en-us</language>
<itunes:subtitle>Subtitle of podcast</itunes:subtitle>
<itunes:author>Author Name</itunes:author>
<itunes:summary>Description of podcast.</itunes:summary>
<description>Description of podcast.</description>
<itunes:owner>
    <itunes:name>Owner Name</itunes:name>
    <itunes:email>me@example.com</itunes:email>
</itunes:owner>
<itunes:explicit>no</itunes:explicit>
<itunes:image href="http://www.example.com/podcast-icon.jpg" />
<itunes:category text="Category Name"/></itunes:category>

<!--REPEAT THIS BLOCK FOR EACH EPISODE-->
<item>
    <title>Title of Podcast Episode</title>
    <itunes:summary>Description of podcast episode content</itunes:summary>
    <description>Description of podcast episode content</description>
    <link>http://example.com/podcast-1</link>
    <enclosure url="http://example.com/podcast-1/podcast.mp3" type="audio/mpeg" length="1024"></enclosure>
    <pubDate>Thu, 21 Dec 2016 16:01:07 +0000</pubDate>
    <itunes:author>Author Name</itunes:author>
    <itunes:duration>00:32:16</itunes:duration>
    <itunes:explicit>no</itunes:explicit>
    <guid>http://example.com/podcast-1</guid>
</item>
<!--END REPEAT-->

</channel>
</rss>`

	feed2json.fromString(str, 'https://example.com/podcast.rss', (err, json) => {
		t.ok(!err, 'no error reading the RSS Feed')

		t.ok(json, 'something appeared in the JSON')
		t.ok(typeof json === 'object', 'The JSON is an object as expected')

		json.items.forEach(item => {
			t.ok(item.attachments, 'Each item has an attachment')
		})
	})
})

// --------------------------------------------------------------------------------------------------------------------
