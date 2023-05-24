const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { hasDistinctElements } = require('./util')

// determine which content to build the ui against.
const shouldUseTestContent = process.env.TEST_CONTENT;
const realContentPath = path.join('./src', 'content');
const testContentPath = path.join('./src', 'test', 'content');
const contentPath = shouldUseTestContent ? testContentPath : realContentPath;

// paths with content
const coursesFilePath = path.join(contentPath, 'courses.yaml');
const instructorsFilePath = path.join(contentPath, 'instructors.yaml');
const schedulesDirPath = path.join(contentPath, 'schedules');

// the content
const coursesYaml = fs.readFileSync(coursesFilePath, 'utf8');
const instructorsYaml = fs.readFileSync(instructorsFilePath, 'utf8');
const schedulesYaml = fs.readdirSync(schedulesDirPath)
  .map(file => fs.readFileSync(path.join(schedulesDirPath, file), 'utf8'))

/*
 * tests
**/

test('course slugs should be unique', () => {
  const courseSlugs = YAML.parse(coursesYaml).map(course => course.slug);
  expect(hasDistinctElements(courseSlugs)).toBe(true);
});

test('instructor slugs should be unique', () => {
  const instructorSlugs = YAML.parse(instructorsYaml).map(instructor => instructor.slug);
  expect(hasDistinctElements(instructorSlugs)).toBe(true);
});

test('schedule slugs should be unique', () => {
  const scheduleSlugs = schedulesYaml.map(scheduleYaml => {
    return YAML.parse(scheduleYaml).slug;
  }, [])
  expect(hasDistinctElements(scheduleSlugs)).toBe(true);
});
