const path = require('path')

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions

  createFieldExtension({
    name: "full_name",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `${source.first_name} ${source.last_name}`
        },
      }
    },
  })
  createFieldExtension({
    name: "instructor_path",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `/instructors#${ source.slug }`
        },
      }
    },
  })
  createFieldExtension({
    name: "schedule_path",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `/offerings/${ source.slug }`
        },
      }
    },
  })
  createFieldExtension({
    name: "course_path",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `/courses/${ source.slug }`
        },
      }
    },
  })

  const typeDefs = [
    `type Class implements Node {
      course: CoursesYaml @link(by: "slug", from: "course")
      instructor: InstructorsYaml @link(by: "slug", from: "instructor")
    }`,
    `type Block implements Node {
      name: String!
      classes: [Class!]!
    }`,
    `type SchedulesYaml implements Node {
      blocks: [Block!]
      path: String @schedule_path(type: "schedule")
    }`,
    `type InstructorsYaml implements Node {
      fullName: String @full_name
      path: String @instructor_path
    }`,
    `type CoursesYaml implements Node {
      path: String @course_path
    }`,
  ]
  createTypes(typeDefs)
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    instructorYaml: {
      classes: {
        type: ["CoursesYaml"],
        resolve: async (source, args, context, info) => {
          const { entries } = await context.nodeModel.findAll({
            query: {
              filter: {
                blocks: {
                  classes: {
                    instructor: {
                      slug: {
                        eq: source.instructor,
                      },
                    },
                  },
                },
              },
            },
            type: "SchedulesYaml",
          })
          return entries
        },
      },
    },
  }
  createResolvers(resolvers)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  // page templates
  const courseTemplate = path.resolve(`src/templates/course.js`)
  const scheduleTemplate = path.resolve(`src/templates/offering.js`)

  // query content nodes necessary for page-creation.
  return graphql(`
    query ($limit: Int!) {
      courses: allCoursesYaml(limit: $limit) {
        nodes {
          path
          slug
        }
      }
      schedules: allSchedulesYaml(limit: $limit) {
        nodes {
          path
          slug
        }
      }
    }`, { limit: 25 }) // note: use second function parameter to pass in query variables.
    .then(result => {
      if (result.errors) {
        throw result.errors
      }
      // 🎉 no errors! proceed to create pages...
      // course pages
      result.data.courses.nodes.forEach(node => {
        createPage({
          path: node.path, // note: path is required
          component: courseTemplate,
          context: { slug: node.slug },
        })
      })
      // schedule pages
      result.data.schedules.nodes.forEach(node => {
        createPage({
          path: node.path, // note: path is required
          component: scheduleTemplate,
          context: { slug: node.slug },
        })
      })
    })
}