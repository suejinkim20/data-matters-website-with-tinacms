# data matters website

## getting started

## 🚧 local development

- start development server with real content as data source: `npm run start`.

### test data

some test data exists in `src/test/content`, and it is tracked along with the code.
it should be upgraded as the ui demands.

- generate new test content: `npm run generate`.
  + pass `--- verbose` flag to dump the generated content to the console.
- start development server with test content as data source: `npm run start!`.

> note: test content is not tracked by version control, as the content generator should be sufficient for every developer to generate comparable content that meets the requirements of the UI.

> note: all scripts (as in, `npm run [script]`) that interface with content have test-content-focused counterparts that have the same command with a `!` appended. For example, to build a production bundle of the site with real content, run `npm run build`; to build the site with _test_ content, run `npm run build!`.

## Content Management

All content lives in the `src/content` directory in YAML files.
There are three core content types: Instructors, Courses, and Schedules.
See types for these fields below; a "!" indicates a field is required.

- **Courses**
  + slug, String!, unique
  + title, String
  + description, String
  + prereqs, String

- **Instructor**
  + slug String, unique
  + first_name String!
  + last_name String!
  + url String
  + affiliation String
  + bio String

- **Schedule**
  - name String!
  - slug String!, unique
  - location String!
  - registration_url String
  - blocks:
    * name: String!
      dates [Datestring (MM/DD/YYYY format)]!
      classes [Class]

where `Class` has this structure:

- **Class**
  + course String! ref course slug
  + instructor String! ref instructor slug
  + location: String
  + meeting_url: String

### Content & the build process

All content starts as YAML. as an example, consider the following YAML file that defines a single instructor.

```
# instructor YAML - pre-build
- slug: selena-okon
  first_name: Selena
  last_name: O'Kon
  affiliation: Hartmann, Botsford and Swift
  bio: Veritatis error nihil. Deleniti rem culpa commodi rerum dolores tenetur
    tempore. Sit vel ratione labore in minus maxime. Ea eos repellat consequatur
    dolorem. Illum enim laboriosam nisi facere rem itaque est quo quis.
```

```
                 ----------------
                |                |
YAML ""  --->   | gatsby-node.js |  --->  Object {}  --->   UI
                |                |
                 ----------------
````

Data comes out of the build process (as a result of code residing in `gatsby-node.js`) as JavaScript object for consumption by the UI. some fields are added during this build step. See Gatsby's documentation on [Customizing the GraphQL Schema](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/) for details on how this is done.

For example, consider again the above instructor YAML, which comes out with the following structure.

```
# instructor object - post-build

{
  slug: 'selena-okon',
  path: '/instructors/selena-okon',
  first_name: 'Selena',
  last_name: 'O\'Kon',
  full_name: 'Selena O\'Kon'
  affiliation: 'Hartmann, Botsford and Swift',
  bio: 'Veritatis error nihil. Deleniti rem culpa commodi rerum dolores tenetur tempore. Sit vel ratione labore in minus maxime. Ea eos repellat consequatur dolorem. Illum enim laboriosam nisi facere rem itaque est quo quis.',
}
```

Notice the object has a couple new fields: `full_name` and `path`. 
Here is a list of all new fields added at build time for each data type:

- **instructors**
    + new fields: path, full_name
- **courses**
    + new fields: path
- **schdules**
    + new fields: path, startDate

Additional fields whose values can be derived from the existing content fields should be added at this step. The goal is to reduce/eliminate redundancy, which help keep a clean code base. The benefit extends beyond the developer experience, though. We also want to minimize the effort required from content managers. To this end, most data massaging--especially computationally complex and reused derivations--should be done at this step, during the build, in `gatsby-node.js`, not in the client, with React.

## Feature Development

ensuring the UI stays predictable is key to it sustainability and success. to help increase the probability of producing a stable application, we'll adhere to a test-driven workflow.

### Workflow

test content generators should be kept up-to-date with the core code base.
in fact, it should be the first part of the code that gets touched.
this workflow should be followed when developing new features that involve data changes.

1. define feature and associated data alterations.
2. write tests (in `src/test/`) that will validate the desired data structure.
  + note that this test will fail at this point (with both real and test content) as the content remains untouched.
3. add functionality to `src/test/content-generator.js` to create content with the desired structure, *i.e.*, when `npm run generate` is executed.
4. test with newly generated test data (`npm run test!`).
5. build UI support for restructured test content.
6. modify real content to desired new structure.
7. verify / remediate UI.

adhering to this workflow means any developer can spin up a local instance of the application with realistic test data at any time. this provides a consistent way to test new UI features against a suite of edge cases and tests that satisfy the requirements of the UI, including edge cases.
