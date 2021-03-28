import React, { useEffect } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import "./style/index.scss"
import observer from "../utils/intersectOb"
import BookOrMovie from "../components/bookmovie"
import myMovies from "../watching/mymovie"
import mybooks from "../watching/mybook"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    {
      allBlog: allMarkdownRemark(
        filter: { frontmatter: { path: { regex: "//blog/" } } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
            }
          }
        }
        totalCount
      }
      allNote: allMarkdownRemark(
        filter: { frontmatter: { path: { regex: "//note/" } } }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              lastTime
              words
            }
          }
        }
        totalCount
      }
    }
  `)
  useEffect(() => {
    observer(".program-category", target =>
      target.classList.add("category--hinge")
    )
    observer(".banner", target => target.classList.add("animate--active"))
  }, [])
  return (
    <Layout>
      <SEO title="Home" />
      <div className="banner">
        <Image path="Mbatdy 1920.jpg" />
        <div className="animate-text-wrapper">
          <div className="at__inner">
            <div className="at__content">hi! I am steve</div>
            <div className="at__block"></div>
          </div>
          <div className="at__inner at__inner-2">
            <div className="at__content">welcome to my blog</div>
            <div className="at__block "></div>
          </div>
        </div>
      </div>
      <div className="poster">
        {" "}
        <div className="div"> record life</div>
      </div>
      <section>
        <Link to="/blog" className="category-tec program-category">
          {/* <div className="icon-pin"> */}
          <svg
            t="1563061400245"
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="10040"
            width="40"
            height="40"
          >
            <path
              d="M619.497472 69.246976c-7.548928 0.248832-14.564352 3.955712-18.960384 10.090496l-63.316992 87.972864c-2.981888 4.12672-4.568064 9.097216-4.568064 14.180352l0 77.202432c-60.338176 102.688768-146.646016 72.5504-156.565504 68.688896-9.02144-3.708928-19.417088-1.604608-26.317824 5.312512l-77.38368 77.345792c-5.561344 5.562368-8.083456 13.548544-6.687744 21.347328 14.697472 83.82464 46.99648 145.880064 86.347776 192.094208L96.04096 873.580544c-0.764928 0.726016-1.432576 1.54624-1.948672 2.482176l-39.428096 66.719744c-2.847744 4.799488-2.064384 10.87488 1.854464 14.775296 2.388992 2.312192 5.446656 3.534848 8.580096 3.534848 2.121728 0 4.282368-0.591872 6.249472-1.72032l60.66176-36.371456c0.859136-0.533504 1.624064-1.127424 2.292736-1.813504l259.349504-256.34816c101.293056 85.182464 222.231552 91.413504 224.105472 91.488256 0.325632 0.02048 0.651264 0.02048 0.93696 0.02048 6.44096 0 12.594176-2.581504 17.142784-7.0912l68.287488-68.286464c5.696512-5.6576 8.163328-13.704192 6.689792-21.59616-17.678336-95.00672 54.0672-149.149696 77.478912-164.057088l86.368256 17.831936c8.08448 1.642496 16.338944-0.785408 22.091776-6.593536l68.248576-68.288512c5.141504-5.100544 7.719936-12.268544 6.99392-19.51232C936.792064 63.570944 622.706688 69.419008 619.497472 69.246976zM921.00608 402.070528C755.495936 354.367488 670.715904 186.46016 642.640896 118.65088 706.188288 123.94496 887.081984 160.582656 921.00608 402.070528zM118.28736 902.897664l-18.4064 11.02848 14.29504-24.137728 251.761664-245.9904 5.408768 8.981504L118.28736 902.897664zM609.480704 707.019776c-48.198656-5.045248-246.465536-39.733248-293.653504-271.731712l42.027008-42.085376c11.542528 73.276416 63.661056 217.035776 290.940928 274.408448L609.480704 707.019776zM660.374528 645.556224c-235.686912-56.9344-274.789376-205.28128-280.63744-267.20256 42.274816 8.448 136.286208 11.505664 199.107584-103.358464 28.266496 52.729856 79.732736 121.094144 172.292096 186.742784C707.584 493.0816 653.707264 556.704768 660.374528 645.556224zM871.698432 462.961664l-82.737152-17.067008c-5.180416-0.994304-10.491904-0.248832-15.193088 1.949696C651.357184 363.541504 600.920064 272.549888 581.177344 221.21472l0-31.926272 40.766464-56.609792c30.615552 73.962496 117.17632 240.589824 288.415744 291.638272L871.698432 462.961664z"
              p-id="10041"
            ></path>
          </svg>
          {/* </div> */}
          <div className="category-head" style={{ backgroundColor: "#fdeb01" }}>
            <div className="category-head-title"> technical post</div>
            <div className="category-info-content">
              <div className="category-info-content-item">
                <span>最近更新 :</span>
                <span>{data.allBlog.edges[0].node.frontmatter.date}</span>
              </div>
              <div className="category-info-content-item">
                <span>文章数量 :</span>
                <span>{data.allBlog.totalCount}</span>
              </div>
            </div>
          </div>
          <div className="category-info" style={{ backgroundColor: "#7f2116" }}>
            <span>技术难点的一些总结</span>
          </div>
        </Link>
        <Link to="/notes" className="category-note program-category">
          <svg
            t="1563061400245"
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="10040"
            width="40"
            height="40"
          >
            <path
              d="M619.497472 69.246976c-7.548928 0.248832-14.564352 3.955712-18.960384 10.090496l-63.316992 87.972864c-2.981888 4.12672-4.568064 9.097216-4.568064 14.180352l0 77.202432c-60.338176 102.688768-146.646016 72.5504-156.565504 68.688896-9.02144-3.708928-19.417088-1.604608-26.317824 5.312512l-77.38368 77.345792c-5.561344 5.562368-8.083456 13.548544-6.687744 21.347328 14.697472 83.82464 46.99648 145.880064 86.347776 192.094208L96.04096 873.580544c-0.764928 0.726016-1.432576 1.54624-1.948672 2.482176l-39.428096 66.719744c-2.847744 4.799488-2.064384 10.87488 1.854464 14.775296 2.388992 2.312192 5.446656 3.534848 8.580096 3.534848 2.121728 0 4.282368-0.591872 6.249472-1.72032l60.66176-36.371456c0.859136-0.533504 1.624064-1.127424 2.292736-1.813504l259.349504-256.34816c101.293056 85.182464 222.231552 91.413504 224.105472 91.488256 0.325632 0.02048 0.651264 0.02048 0.93696 0.02048 6.44096 0 12.594176-2.581504 17.142784-7.0912l68.287488-68.286464c5.696512-5.6576 8.163328-13.704192 6.689792-21.59616-17.678336-95.00672 54.0672-149.149696 77.478912-164.057088l86.368256 17.831936c8.08448 1.642496 16.338944-0.785408 22.091776-6.593536l68.248576-68.288512c5.141504-5.100544 7.719936-12.268544 6.99392-19.51232C936.792064 63.570944 622.706688 69.419008 619.497472 69.246976zM921.00608 402.070528C755.495936 354.367488 670.715904 186.46016 642.640896 118.65088 706.188288 123.94496 887.081984 160.582656 921.00608 402.070528zM118.28736 902.897664l-18.4064 11.02848 14.29504-24.137728 251.761664-245.9904 5.408768 8.981504L118.28736 902.897664zM609.480704 707.019776c-48.198656-5.045248-246.465536-39.733248-293.653504-271.731712l42.027008-42.085376c11.542528 73.276416 63.661056 217.035776 290.940928 274.408448L609.480704 707.019776zM660.374528 645.556224c-235.686912-56.9344-274.789376-205.28128-280.63744-267.20256 42.274816 8.448 136.286208 11.505664 199.107584-103.358464 28.266496 52.729856 79.732736 121.094144 172.292096 186.742784C707.584 493.0816 653.707264 556.704768 660.374528 645.556224zM871.698432 462.961664l-82.737152-17.067008c-5.180416-0.994304-10.491904-0.248832-15.193088 1.949696C651.357184 363.541504 600.920064 272.549888 581.177344 221.21472l0-31.926272 40.766464-56.609792c30.615552 73.962496 117.17632 240.589824 288.415744 291.638272L871.698432 462.961664z"
              p-id="10041"
            ></path>
          </svg>
          <div className="category-head" style={{ backgroundColor: "#ff69b4" }}>
            <div className="category-head-title">notebook</div>
            <div className="category-info-content">
              <div className="category-info-content-item">
                <span> 最近更新 : </span>{" "}
                <span>{data.allNote.edges[0].node.frontmatter.lastTime}</span>
              </div>
              <div className="category-info-content-item">
                <span>笔记字数 :</span>
                <span>{data.allNote.edges[0].node.frontmatter.words}</span>
              </div>
            </div>
          </div>
          <div
            className="category-info"
            style={{ backgroundColor: " #dbde30" }}
          >
            <span>纪录每周遇到的问题</span>
          </div>
        </Link>
      </section>
      <div className="poster">
        {" "}
        <div className="div"> share life</div>
      </div>
      <section>
        <div className="category-read life-category">
          {" "}
          <div
            className="category-head"
            style={{ backgroundColor: " #a9eedc" }}
          >
            {mybooks.map(book => (
              <BookOrMovie
                title={book.title}
                src={book.src}
                img={book.img}
                key={book.src}
              />
            )).reverse()}
          </div>
          <div
            className="category-info"
            style={{ backgroundColor: " #4a2165" }}
          >
            最近在读
          </div>
        </div>
        <div className="category-watch life-category">
          {" "}
          <div
            className="category-head"
            style={{ backgroundColor: " #84694e" }}
          >
            {myMovies.map(movie => (
              <BookOrMovie
                title={movie.title}
                src={movie.src}
                img={movie.img}
                key={movie.src}
              />
            )).reverse()}
          </div>
          <div
            className="category-info"
            style={{ backgroundColor: " #cde2cf" }}
          >
            最近在看
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage

// <div className="lastNew">
//   {/* <Image /> */}
//   {data.allMarkdownRemark.edges.map(({ node }) => {
//     return (
//       <div className="lastNew-item">
//         <div className="lastNew-item-post"></div>
//         <div className="lastNew-item-title">{node.frontmatter.title}</div>
//       </div>
//     )
//   })}
//   <div className="lastNew-item">
//     <iframe
//       title="music"
//       height="200px"
//       src="//music.163.com/outchain/player?type=2&id=458255740&auto=1&height=66"
//     ></iframe>
//   </div>
// </div>
