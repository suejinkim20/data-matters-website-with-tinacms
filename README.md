# data matters website

## 🚧 local development

- start dev server with real content as data source: `npm run start`

### test data

some test data exists in `src/test/content`, and it is tracked along with the code.
it should be upgraded as the ui demands.

- generate new test content: `npm run generate`
- start dev server with test content as data source: `npm run start!`

# data massaging & the build process

content starts as YAML. for example, here is the YAML definition for a single instructor.

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

data comes out of the build process (as a result of code residing in `gatsby-node.js`) as JavaScript object for consumption by the UI. some fields are added during this build time.

the above instructor comes out a 

```
# instructor object - post-build
{
  slug: 'selena-okon',
  path: '/instructors/selena-okon',
  firstName: 'Selena',
  lastName: 'O\'Kon',
  fullName: 'Selena O\'Kon'
  affiliation: 'Hartmann, Botsford and Swift',
  bio: 'Veritatis error nihil. Deleniti rem culpa commodi rerum dolores tenetur tempore. Sit vel ratione labore in minus maxime. Ea eos repellat consequatur dolorem. Illum enim laboriosam nisi facere rem itaque est quo quis.',
}
```

notice the object has its fieldname in camelCase, as well as a couple additional fields: `fullName` and `path`. 

- instructors
    + new fields: path, fullName
- courses
    + new fields: path
- schdules
    + new fields: path, startDate

additional fields whose values can be derived from the existing content fields should be added at this step.
that is, perform data massage at this step, during the build, in `gatsby-node.js`, not in the client, with React.
