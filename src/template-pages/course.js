import * as React from "react"
import { graphql, Link } from "gatsby"
import { Layout } from "../components/layout"
import { Details } from "../components/details"

function CourseTemplate({ data }) {
  const { course, schedules } = data
  const today = new Date()
  const scheduleBuckets = schedules.nodes
    .reduce((buckets, schedule) => {
      if (new Date(schedule.startDate) < today) {
        return {
          ...buckets,
          past: [...buckets.past, schedule]
            .sort((s, t) => new Date(s.startDate) - new Date(t.startDate))
        }
      }
      return {
        ...buckets,
        future: [...buckets.future, schedule]
          .sort((s, t) => new Date(s.startDate) - new Date(t.startDate))
      }
    }, { past: [], future: [] })

  return (
    <Layout>
      <h1>{ course.title }</h1>
      <p>description: { course.description }</p>
      <p>prerequisites: { course.prereqs }</p>

      <h2>upcoming course offerings</h2>
      <ul>
        {
          scheduleBuckets.future.map(({ name, path }) => (
            <li key={ `course-${ course.title }--${ name }` }>
              <Link to={ path }>{ name }</Link>
            </li>
          ))
        }
      </ul>
      
      <h2>past course offerings</h2>
      <ul>
        {
          scheduleBuckets.past.reverse().map(({ name, path }) => (
            <li key={ `course-${ course.title }--${ name }` }>
              <Link to={ path }>{ name }</Link>
            </li>
          ))
        }
      </ul>
      
      <Details title="data" data={ data } />
    </Layout>
  )
}

export default CourseTemplate

export const pageQuery = graphql`
  query ($slug: String) {
    course: coursesYaml(slug: { eq: $slug }) {
      id
      slug
      path
      title
      description
      prereqs
    }
      schedules: allSchedulesYaml(filter: {
        blocks: { elemMatch: {
          classes: { elemMatch: {
            course: { slug: { eq: $slug } }
          } }
        } }
      }) {
        nodes {
          name
          path
          startDate
        }
      }
  }
`
