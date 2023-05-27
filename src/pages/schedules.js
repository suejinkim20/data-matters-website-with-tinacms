import React, { Fragment } from 'react'
import Seo from '../components/seo'
import { graphql } from 'gatsby'
import { Details } from '../components/details'
import { Link } from '../components/link'

const SchedulesPage = ({ data }) => {
  const schedules = data.schedules.nodes
  const today = new Date()
  const upcomingSchedules = schedules
    // select only the schedules starting in the future.
    .filter(schedule => today < new Date(schedule.start_date))
    .sort(schedule => schedule.start_date)

  return (
    <Fragment>
      <h1>schedules</h1>
      <ul>
        {upcomingSchedules.map(schedule => (
          <li key={schedule.id}>
            <Link to={schedule.path}>{schedule.name}</Link>
          </li>
        ))}
      </ul>

      <Details title="data" data={data} />
    </Fragment>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Schedules" />

export default SchedulesPage

export const query = graphql`
  {
    schedules: allSchedulesYaml {
      nodes {
        id
        name
        path
        start_date
      }
    }
  }
`
