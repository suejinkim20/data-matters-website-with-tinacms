const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');
const YAML = require('yaml');
const { emptyDirectory, formatDate, slugify } = require('./util')

// setting OVERWRITE to `true` will overwrite existing test data
const OVERWRITE = true;
const LOG_GENERATED_CONTENT = true;

// paths of interest
const testContentPath = path.join('./src', 'test', 'content')
const coursesFilePath = path.join(testContentPath, 'courses.yaml')
const instructorsFilePath = path.join(testContentPath, 'instructors.yaml')
const schedulesDirPath = path.join(testContentPath, 'schedules')

//

// instructors
function generateInstructor() {
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  const slug = slugify(`${ first_name } ${ last_name }`);

  return {
    slug,
    first_name,
    last_name,
    affiliation: faker.company.name(),
    bio: faker.lorem.paragraph(5),
  };
}

// courses
function generateCourse() {
  const title = faker.lorem.words(3);
  const slug = slugify(title);

  return {
    slug,
    title,
    description: faker.lorem.paragraph(5),
    prereqs: faker.lorem.paragraph(1),
  };
}

// schedules-class
function generateClass() {
  return {
    course: faker.helpers.arrayElement(courses).slug,
    instructor: faker.helpers.arrayElement(instructors).slug,
    location: `Room ${ faker.location.buildingNumber() }`,
    zoom_url: faker.internet.url(),
  };
}

// schedules
function generateSchedule(startDate) {
  const name = `${ faker.lorem.word() } ${ startDate.getFullYear() }`;
  const slug = slugify(name);
  const dates = [...Array(5).keys()].map(i => {
    let _date = new Date(startDate);
    _date.setDate(_date.getDate() + i);
    return _date
  })

  return {
    name: name,
    slug: slug,
    location: faker.location.streetAddress(),
    // this implementation is restricted to the usual
    // two-day, one-day, two-day, consecutive block structure.
    // it will take a bit of effort to mix up the block schedules.
    blocks: [
      {
        name: faker.lorem.words(2),
        dates: [formatDate(dates[0]), formatDate(dates[1])],
        classes: faker.helpers.multiple(generateClass, { count: 5 }),
      },
      {
        name: faker.lorem.words(2),
        dates: [formatDate(dates[2])],
        classes: faker.helpers.multiple(generateClass, { count: 5 }),
      },
      {
        name: faker.lorem.words(2),
        dates: [formatDate(dates[3]), formatDate(dates[4])],
        classes: faker.helpers.multiple(generateClass, { count: 5 }),
      },
    ]
  };
}

// generate instructors.
const instructors = faker.helpers.multiple(generateInstructor, { count: 10 });
// generate courses.
const courses = faker.helpers.multiple(generateCourse, { count: 12 });
// generate schedules.
// first, we'll want to guarantee a few things about the dates
// that get generated to align with expectations client-side.
const futureDates = [
  // we'll want one in the _near_ future...
  faker.date.soon({ days: 60 }),
  // ...and some more a bit farther out.
  ...[...Array(2).keys()].map(_ => faker.date.future({ years: 1 })),
]
// we'll do the analogous thing for past dates:
const pastDates = [
  // one in the recent past...
  faker.date.past({ days: 60 }),
  // ...and a few more father back.
  ...[...Array(4).keys()].map(_ => faker.date.past({ years: 2 })),
]
// finally, we generate schedules with our predetermined dates.
const schedules = [
  ...futureDates.map(date => generateSchedule(date)),
  ...pastDates.map(date => generateSchedule(date)),
]

console.log(JSON.stringify(schedules, null, 2))
// console.log(schedules)

LOG_GENERATED_CONTENT && console.log(
  JSON.stringify({
    instructors,
    courses,
    schedules,
  }, null, 2)
);

if (OVERWRITE) {
  // cleanout
  emptyDirectory(testContentPath);
  // write new content
  fs.writeFileSync(coursesFilePath, YAML.stringify(courses, null, 2));
  fs.writeFileSync(instructorsFilePath, YAML.stringify(instructors, null, 2));
  schedules.forEach(schedule => {
    scheduleFilePath = path.join(schedulesDirPath, `${ schedule.slug }.yaml`);
    fs.writeFileSync(scheduleFilePath, YAML.stringify(schedule, null, 2));
  })
} else {
  console.log('OVERWRITE=false: existing test data is preserved.')
}
