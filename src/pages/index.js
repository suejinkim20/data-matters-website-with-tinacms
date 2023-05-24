import * as React from "react"
import { Layout } from "../components/layout"
import Seo from "../components/seo"
import { graphql, Link } from 'gatsby'

const HomePage = ({ data }) => {
  return (
    <Layout>
      <h1>home</h1>

      <h2>upcoming</h2>

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
export const Head = () => <Seo title="Welcome!" />

export default HomePage

export const query = graphql`{
  schedules: allSchedulesYaml {
    nodes {
      id
      name
      path
    }
  }
}`
