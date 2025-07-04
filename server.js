/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Nirajan Magrati Student ID: 142798230 Date: 2024-03-15
*
*  Published URL: https://web322-a4.onrender.com
*
********************************************************************************/

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Configure EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use('/data', express.static('data'));

// Load project data
let projectData = [];
try {
    projectData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'projectData.json'), 'utf-8'));
} catch (err) {
    console.error("Error loading project data:", err);
}

// Route handlers
app.get('/', (req, res) => {
    res.render('home', { page: '/' });
});

app.get('/about', (req, res) => {
    res.render('about', { page: '/about' });
});

// Projects route with sector filtering
app.get('/solutions/projects', (req, res) => {
    const sector = req.query.sector;
    let filteredProjects = projectData;
    
    if (sector) {
        filteredProjects = projectData.filter(p => 
            p.sector.toLowerCase() === sector.toLowerCase()
        );
        
        if (filteredProjects.length === 0) {
            return res.status(404).render('404', { 
                message: `No projects found for sector: ${sector}`,
                page: '' 
            });
        }
    }
    
    res.render('projects', { 
        projects: filteredProjects,
        page: '/solutions/projects'
    });
});

// Single project route
app.get('/solutions/projects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const project = projectData.find(p => p.id === id);
    
    if (project) {
        res.render('project', { 
            project: project,
            page: '' 
        });
    } else {
        res.status(404).render('404', { 
            message: `Project with ID ${id} not found`,
            page: '' 
        });
    }
});

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).render('404', { 
        message: "I'm sorry, we're unable to find what you're looking for",
        page: '' 
    });
});

// Start server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on: http://localhost:${HTTP_PORT}`);
    console.log("Available Routes:");
    console.log(` - Home: /`);
    console.log(` - About: /about`);
    console.log(` - Projects: /solutions/projects`);
    console.log(` - Projects by sector: /solutions/projects?sector=[sector]`);
    console.log(` - Single project: /solutions/projects/[id]`);
});