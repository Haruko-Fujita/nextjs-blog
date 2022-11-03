import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout, { siteTitle } from '../components/Layout';

import Link from 'next/link'
import utilStyle from '../styles/utils.module.css';
import { getPostsData } from '../lib/post';

// SSGの場合
// static site generator 1度だけrendering
export async function getStaticProps() {
  const allPostsData = getPostsData(); // id, title, date, thumbnail
  // console.log(allPostsData);

  return {
    props: {
      allPostsData,
    },
  };
}

// SSRの場合
// server side rendering 何度も更新する場合
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       // コンポーネントに渡すためのprops
//     },
//   };
// }


export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
        <p>
          私はバックエンドが好きなエンジニアです/Ms.EngineerのBoot Campを卒業しました/TypeScriptも学びました
        </p>
      </section>
      
      <section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
        <h2>📝エンジニアのブログ</h2>
        <div className={styles.grid}>
          {allPostsData.map(({id, title, date, thumbnail}) => (
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <img src={`${thumbnail}`} className={styles.thumbnailImage} />
              </Link>
              <Link href={`/posts/${id}`} className={utilStyle.boldText}>{title}</Link>
              <br />
              <small className={utilStyle.lightText}>{date}</small>
            </article>          
          ))}
        </div>
      </section>
    </Layout>
  );
}
