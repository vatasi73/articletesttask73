import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Article, fetchArticles } from "../slices/articleSlice";
import { Link } from "react-router-dom";
import AddArticle from "./AddArticle";

import { RootState, useAppDispatch } from "../store";

const ArticleList: React.FC = () => {
  const [expandedArticleIds, setExpandedArticleIds] = useState<number[]>([]);

  const dispatch = useAppDispatch();

  const articles = useSelector((state: RootState) => state.articles.articles);
  const error = useSelector((state: RootState) => state.articles.error);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const toggleExpand = (id: number) => {
    setExpandedArticleIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((articleId) => articleId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  return (
    <div>
      <AddArticle />
      <h1>Articles</h1>
      {error && <p>{error}</p>}
      <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
        {articles.map((article: Article) => {
          const isExpanded = expandedArticleIds.includes(article.id);
          return (
            <div
              key={article.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                width: "600px",
                height: isExpanded ? "100%" : "140px",
                display: "flex",
                overflowY: isExpanded ? "visible" : "hidden",
                padding: "0 10px 10px 0",
                position: "relative",
              }}
            >
              <div style={{ flexGrow: 1 }}>
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: "200px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px 0 0 0",
                      float: "left",
                      marginRight: "10px",
                    }}
                  />
                )}
                <Link
                  to={`/articles/${article.id}`}
                  style={{ textAlign: "center", marginTop: "8px" }}
                >
                  {article.title}
                </Link>
                <p style={{ margin: 0 }}>{article.content}</p>
              </div>
              <button
                style={{ position: "absolute", bottom: 4, right: 4 }}
                onClick={() => toggleExpand(article.id)}
              >
                {isExpanded ? "Cover" : "Read more"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleList;
