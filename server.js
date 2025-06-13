/********************************************************************************
*  WEB322 – Assignment 03
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
*  Name: Your Name   Student ID: 123456789   Date: 2025-06-12
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require('express');
const path = require("path");
const app = express();
const fs = require("fs");

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use('/data', express.static("data"));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});


app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});


const projectData = JSON.parse(fs.readFileSync("./data/projectData.json", "utf-8"));


app.get('/solutions/projects', (req, res) => {
    const sector = req.query.sector;
    try {
        let result = projectData;
        if (sector) {
            result = projectData.filter(p => p.sector.toLowerCase() === sector.toLowerCase());
        }
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: "Unable to fetch projects" });
    }
});


app.get('/solutions/projects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const project = projectData.find(p => p.id === id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: "Project not found" });
        }
    } catch (err) {
        res.status(404).json({ error: "Error fetching project" });
    }
});


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});


app.listen(HTTP_PORT, () => {
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});