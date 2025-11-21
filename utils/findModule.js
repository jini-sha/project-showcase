function findModule(timeline, moduleCode) {
  for (const year of timeline.years) {
    for (const semester of year.semesters) {
      for (const mod of semester.modules) {
        if (mod.code === moduleCode) {
          return {
            module: mod.name,
            moduleId: mod._id,   
            level: year.level,
            semester: semester.semesterNumber,
            year: year.academicYear,
          };
        }
      }
    }
  }
  return null;
}

module.exports = { findModule };