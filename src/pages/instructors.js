import * as React from "react"
import { Layout } from "../components/layout"
import Seo from "../components/seo"
import { graphql } from 'gatsby'

const InstructorsPage = ({ data }) => {
  const instructors = data.instructors.nodes

  return (
    <Layout>
      <h1>instructors</h1>
      <details>
        <summary>json</summary>
        <pre>{ JSON.stringify(data, null, 2) }</pre>
      </details>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Instructors" />

export default InstructorsPage

export const query = graphql`{
  instructors: allInstructorsYaml {
    nodes {
      id
      slug
      fullName
      bio
      affiliation
    }
  }
}`
