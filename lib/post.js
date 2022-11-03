import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

// mdファイルのデータを取り出す
export function getPostsData() {
  // SSRの場合
  // 外部用のAPIやDBからデータを取得する
  // const fetchData = await fetch("endpoint")

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, ""); // ファイル名(id).mdを除く

    // マークダウンファイルの内容を文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    // idとデータを返す
    return {
      id, 
      ...matterResult.data,
    };
  });
  return allPostsData;
}

// getStaticPathのreturnで使うpathを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
  /* returnの内容
    [
      {params: {id: "ssg-ssr"}},
      {params: {id: "react-next"}}
      {params: {id: "pre-rendering"}}
      {params: {id: "prerendering-about"}}
    ]
   */
}

// idに基づいてブログ投稿データを返す
export async function getPostData(id) {
  // マークダウンファイルの内容を文字列として読み取る
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  
  // matterResult.content ->文字列型
  // HTML型に変換する
  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  };
}