const PORT = process.env.PORT || 8000 //this is for deployment on heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express");
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/enviroment/climate-change',
        base: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/science-environment-56837908',
        base: ''
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'un',
        address: 'https://www.un.org/en/climatechange/',
        base: ''
    },
    {
        name: 'telegram',
        address: 'https://www.telegram.co.uk/climate-change',
        base: 'https://www.telegram.co.uk'
    },
    {
        name: 'aljazeela',
        address: 'https://www.aljazeera.com/climate-crisis',
        base: ''
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/specials/world/cnn-climate',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspapers.name
                })
            })

        })
})

app.get('/', (req,res) => {
    res.json('welcome to my climate api')
})

app.get('/news', (req,res) => {
            res.json(articles)
         })

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name ==  newspaperId)[0].address

   const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})


app.listen(PORT, () => console.log('server running on PORT ${PORT}'))





