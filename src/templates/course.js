import * as React from "react"
import { graphql } from "gatsby"
import { Layout } from "../components/layout"

function CourseTemplate({ data: { course, offerings } }) {

  return (
    <Layout>
      <h1>{ course.title }</h1>
      <pre>
        { JSON.stringify(course, null, 2) }
      </pre>
      <h2>offerings</h2>
      <pre>
        { JSON.stringify(offerings, null, 2) }
      </pre>
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
            course: { slug: { eq: "intro-to-r" } }
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
