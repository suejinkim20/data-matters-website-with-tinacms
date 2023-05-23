import * as React from "react"
import { Layout } from "../components/layout"
import Seo from "../components/seo"
import { graphql, Link } from 'gatsby'

const SchedulesPage = ({ data }) => {
  const schedules = data.schedules.nodes

  return (
    <Layout>
      <h1>schedules</h1>
      <ul>
        {
          schedules.map(schedule => (
            <li key={ schedule.id }>
              <Link to={ schedule.path }>{ schedule.name }</Link>
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
export const Head = () => <Seo title="Schedules" />

export default SchedulesPage

export const query = graphql`{
  schedules: allSchedulesYaml {
    nodes {
      id
      name
      path
    }
  }
}`