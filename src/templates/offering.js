import * as React from "react"
import { graphql, Link } from "gatsby"
import { Layout } from "../components/layout"

const Block = (block) => {
  return (
    <div>
      <h2>Block: { block.name }</h2>
      
      <p>
        { block.dates.join(', ') }
      </p>

      <ul>
        {
          block.classes.map((c, index) => (
            <li key={ `class-${ index }` }>
              <Link to={ c.course.path }>{ c.course.title }</Link>
              &nbsp;
              (<Link to={ c.instructor.path }>{ c.instructor.fullName }</Link>)
            </li>
          ))
        }
      </ul>
    </div>
  )
}

function ScheduleTemplate({ data: { schedule } }) {
  return (
    <Layout>
      <h1>{ schedule.name }</h1>
      
      <p>Location: { schedule.location }</p>

      {
        schedule.blocks.map((block, index) => (
          <Block key={ `block-${ index }` } { ...block } />
        ))
      }

      <details>
        <summary>json</summary>
        <pre>{ JSON.stringify(schedule, null, 2) }</pre>
      </details>
    </Layout>
  )
}

export default ScheduleTemplate

export const pageQuery = graphql`
  query ($slug: String) {
    schedule: schedulesYaml(slug: { eq: $slug }) {
      name
      location
      blocks {
        name
        dates
        classes {
          course {
            title
            path
          }
          instructor {
            fullName
            path
          }
        }
      }
    }
  }
`
