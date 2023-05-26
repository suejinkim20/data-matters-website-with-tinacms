# Data Matters Website

## Getting Started

With Node 18 installed on your system, clone this repo and install dependencies with `npm i`.

## 🚧 Local development

Start development server with `npm run start`.

### Test Data

There is a script to generate test content data, which will be dumped into the `src/test/content` directory.

To generate new test content, run `npm run generate`.
Pass the `--- verbose` flag to dump the generated content to the console for visual inspection.

> Note: Test content is not tracked by version control, as the content generator should be sufficient for every developer to generate comparable content that meets the requirements of the UI.

To start development server with test content as data source, run `npm run start!`.
This is the same a the above run command, but with a `!` appended.

> Note: The `start`, `test`, and `build` scripts all interface with content and have test-content-focused counterparts,
> which have the same command with an appended `!`. For example, to build a production bundle of the site with real
> content, run `npm run build`; to build the site with _test_ content, run `npm run build!`.

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
      dates [DateString (MM/DD/YYYY format)]!
      classes [Class]

where `Class` has this structure:

- **Class**
  + course String! ref course slug
  + instructor String! ref instructor slug
  + location: String
  + meeting_url: String

### Content & the Build Process

All content starts as YAML. As an example, consider the following YAML file that defines a single instructor.

```
# instructor YAML -- pre-build

slug: selena-okon
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

Data comes out of the build process (as a result of code residing in `gatsby-node.js`) as JavaScript object for consumption by the UI. Some fields are added during this build step.

For example, consider again the above instructor YAML, which comes out with the following structure.

```
# instructor object -- post-build

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
    + new fields: path, start_date

Additional fields whose values can be derived from the existing content fields should be added at this step. The goal is to reduce/eliminate redundancy, which help keep a clean code base. The benefit extends beyond the developer experience, though. We also want to minimize the effort required from content managers. To this end, most data massaging--especially computationally complex and reused derivations--should be done at this step, during the build, in `gatsby-node.js`, not in the client, with React.

See Gatsby's documentation on [Customizing the GraphQL Schema](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/) for details on how this is done.

## Feature Development

Ensuring the UI stays predictable is key to its sustainability and success. To help increase the probability of producing a stable application, we'll adhere to a test-driven workflow.

### Workflow

The test content generators should be kept up-to-date with the core code base.
In fact, this should be the first part of the code that gets touched when developing a new feature.
This workflow should be followed when developing new features that involve data changes.

1. Define feature and associated data alterations.
2. Write tests (in `src/test/`) that will validate the desired data structure.
  + Note: This test will fail at this point (with both real and test content) as the content remains untouched.
3. Add functionality to `src/test/content-generator.js` to create content with the desired structure, *i.e.*, when `npm run generate` is executed.
4. Test with newly generated test data (`npm run test!`).
5. Build UI support for restructured test content.
6. Modify real content to desired new structure.
7. Verify / remediate UI.

Adhering to this workflow means any developer can spin up a local instance of the application with realistic test data at any time. This provides a consistent way to test new features against a suite of content that satisfies the requirements of the UI, including edge cases.
The test suite will mature alongside the code base, helping to enforce structure requirements along the way.

# 🎁 Building for Production

Build a production bundle of this application with `npm run build`.
The bundle will reside in the `public` directory.

Test the built application with `npm run serve`, which will serve the application at http://localhost:9000/.

Deployment notes TBD.
