import * as React from "react"
import { Layout } from "../components/layout"
import { graphql } from 'gatsby'
import Seo from "../components/seo"
import { Details } from "../components/details"

const InstructorsPage = ({ data }) => {
  const instructors = data.instructors.nodes

  return (
    <Layout>
      <h1>instructors</h1>

      {
        instructors.map(instructor => (
          <div id={ instructor.slug } key={ instructor.id }>
            <h2 style={{ margin: 0 }}>{ instructor.fullName }</h2>
            <div>({ instructor.affiliation })</div>
            <p>{ instructor.bio }</p>
          </div>
        ))
      }

      <Details title="data" data={ data } />
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
