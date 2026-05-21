const Project = require('./Project');

async function getUserProjectIds(userId) {
  const projects = await Project.find({
    $or: [{ admin: userId }, { members: userId }],
  });
  return projects.map((p) => p._id);
}

module.exports = getUserProjectIds;
