require('dotenv').config();
const { Sequelize, DataTypes, Op } = require('sequelize');

// Setup Sequelize connection with SSL support for Render.com
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

// Define the Sector model
const Sector = sequelize.define('Sector', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sector_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Sectors',
  timestamps: false,
});

// Define the Project model
const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  feature_img_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary_short: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  intro_short: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  impact: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  original_source_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sector_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Projects',
  timestamps: false,
});

// Define association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// CRUD operations
function getAllProjects() {
  return Project.findAll({ include: Sector });
}

function getProjectById(id) {
  return Project.findOne({ where: { id }, include: Sector });
}

function addProject(projectData) {
  return Project.create(projectData);
}

function updateProject(id, updatedData) {
  return Project.update(updatedData, { where: { id } });
}

function deleteProject(id) {
  return Project.destroy({ where: { id } });
}

function getAllSectors() {
  return Sector.findAll();
}

// Initialize DB
function initDB() {
  return sequelize.sync(); // won't drop tables
}

module.exports = {
  initDB,
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
  getAllSectors,
};
