import Head from 'next/head'
import { GetStaticProps } from 'next'
import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPostsForHome } from '../lib/api'
import { getGeneralSettings } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ allPosts: { edges }, preview, meta } ) {
  const heroPost = edges[0]?.node
  const morePosts = edges.slice(1)
  const siteTitle = meta.generalSettings.title
  const siteDescription = meta.generalSettings.description

  return (
    <Layout preview={preview}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Container>
        <Intro 
          siteTitle={siteTitle} 
          siteDescription={siteDescription} />
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.featuredImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview)
  const meta = await getGeneralSettings()
  
  const responses = await Promise.all([allPosts, meta])
  
  return {
    props: { 
      allPosts, 
      preview,
      meta, 
    },
    revalidate: 10,
  }
}
