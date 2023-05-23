import * as React from "react"
import { Layout } from "../components/layout"
import Seo from "../components/seo"

const HomePage = () => (
  <Layout>
    home
  </Layout>
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Welcome!" />

export default HomePage
