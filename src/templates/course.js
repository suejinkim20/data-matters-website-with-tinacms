import * as React from "react"
import { graphql, Link } from "gatsby"
import { Layout } from "../components/layout"

function CourseTemplate({ data: {
  course,
  offerings: { nodes: offerings }
} }) {

  return (
    <Layout>
      <h1>{ course.title }</h1>
      <p>description: { course.description }</p>
      <p>prerequisites: { course.prereqs }</p>

      <h2>offerings</h2>
      <ul>
        {
          offerings.map(({ name, path }) => (
            <li key={ `course-${ course.title }--${ name }` }>
              <Link to={ path }>{ name }</Link>
            </li>
          ))
        }
      </ul>
      
      <details>
        <summary>json</summary>
        <pre>{ JSON.stringify(course, null, 2) }</pre>
      </details>
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
      offerings: allSchedulesYaml(filter: {
        blocks: { elemMatch: {
          classes: { elemMatch: {
            course: { slug: { eq: $slug } }
          } }
        } }
      }) {
        nodes {
          name
          path
        }
      }
  }
`
