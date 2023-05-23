import * as React from "react"
import { Layout } from "../components/layout"
import Seo from "../components/seo"
import { graphql, Link } from 'gatsby'

const CoursesPage = ({ data }) => {
  const courses = data.courses.nodes

  return (
    <Layout>
      <h1>course catalog</h1>
      <ul>
        {
          courses.map(course => (
            <li key={ course.id }>
              <Link to={ course.path }>{ course.title }</Link>
            </li>
          ))
        }
      </ul>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Courses" />

export default CoursesPage

export const query = graphql`{
  courses: allCoursesYaml {
    nodes {
      id
      path
      title
      description
      prereqs
    }
  }
}`
