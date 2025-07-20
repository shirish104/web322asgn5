/******************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: [Your Name Here]   Student ID: [Your ID Here]   Date: 2025-07-20
*
*  Published URL: [Your Vercel URL will go here]
*
******************************************************************************/

const express = require('express');
const path = require('path');
const db = require('./modules/projects');
const app = express();
const PORT = process.env.PORT || 8080;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for static files and form parsing
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

// List all projects
app.get('/solutions/projects', async (req, res) => {
  try {
    const projects = await db.getAllProjects();
    res.render('projects', { projects });
  } catch (err) {
    res.render('500', { message: 'Error loading projects.' });
  }
});

// Show add project form
app.get('/solutions/addProject', async (req, res) => {
  try {
    const sectors = await db.getAllSectors();
    res.render('addProject', { sectors });
  } catch (err) {
    res.render('500', { message: 'Error loading add project form.' });
  }
});

// Handle add project form submission
app.post('/solutions/addProject', async (req, res) => {
  try {
    await db.addProject(req.body);
    res.redirect('/solutions/projects');
  } catch (err) {
    res.render('500', { message: `Failed to add project: ${err}` });
  }
});

// Show edit project form
app.get('/solutions/editProject/:id', async (req, res) => {
  try {
    const project = await db.getProjectById(req.params.id);
    const sectors = await db.getAllSectors();

    if (!project) {
      return res.status(404).render('404', { message: 'Project not found' });
    }

    res.render('editProject', { project, sectors });
  } catch (err) {
    res.status(500).render('500', { message: `Error loading edit form: ${err}` });
  }
});

// Handle edit project form submission
app.post('/solutions/editProject', async (req, res) => {
  try {
    const { id, ...projectData } = req.body;
    await db.updateProject(id, projectData);
    res.redirect('/solutions/projects');
  } catch (err) {
    res.render('500', { message: `Failed to update project: ${err}` });
  }
});

// Delete a project
app.get('/solutions/deleteProject/:id', async (req, res) => {
  try {
    await db.deleteProject(req.params.id);
    res.redirect('/solutions/projects');
  } catch (err) {
    res.render('500', { message: `Failed to delete project: ${err}` });
  }
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page Not Found' });
});

// Start server after DB initialization
db.initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to start server:', err);
  });
