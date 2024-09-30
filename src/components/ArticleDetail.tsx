import React, { useEffect, useState, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import AddComment from "./AddComment";
import {
  addReply,
  Comment,
  deleteArticle,
  deleteComment,
  editArticle,
  editComment,
  fetchArticles,
  fetchComments,
} from "../slices/articleSlice";
import { jwtDecode } from "jwt-decode";
import { RootState, useAppDispatch } from "../store";
interface DecodedToken {
  user_id: string;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const article = useSelector((state: RootState) =>
    state.articles.articles.find((a) => a.id === Number(id))
  );
  const comments = useSelector((state: RootState) => state.articles.comments);
  const token = useSelector((state: RootState) => state.auth.access);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [updatedCommentContent, setUpdatedCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>(
    {}
  );
  const [isArticleUpdated, setIsArticleUpdated] = useState(false);
  const [isCommentUpdated, setIsCommentUpdated] = useState(false);

  const getUserIdFromToken = (token: string | null): string | null => {
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      return decoded.user_id;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const currentUserId = getUserIdFromToken(token);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticles());
      setIsArticleUpdated(false);
    }
  }, [dispatch, id, isArticleUpdated]);

  useEffect(() => {
    if (id) {
      dispatch(fetchComments(Number(id)));
      setIsCommentUpdated(false);
    }
  }, [dispatch, id, isCommentUpdated]);

  const handleEdit = useCallback(() => {
    if (article) {
      setUpdatedTitle(article.title);
      setUpdatedContent(article.content);
      setIsEditing(true);
    }
  }, [article]);

  const handleUpdate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (article) {
        const formData = new FormData();
        formData.append("title", updatedTitle);
        formData.append("content", updatedContent);
        if (updatedImage) {
          formData.append("image", updatedImage);
        }

        dispatch(
          editArticle({
            id: article.id,
            articleData: formData,
          })
        );
        setIsEditing(false);
        setIsArticleUpdated(true);
      }
    },
    [dispatch, article, updatedTitle, updatedContent, updatedImage]
  );

  const handleDelete = useCallback(() => {
    if (article) {
      dispatch(deleteArticle(article.id));
      navigate("/");
    }
  }, [dispatch, article, navigate]);

  const startEditingComment = useCallback(
    (commentId: number, content: string) => {
      setEditingCommentId(commentId);
      setUpdatedCommentContent(content);
    },
    []
  );

  const handleCommentUpdate = useCallback(
    (commentId: number) => {
      if (id) {
        dispatch(
          editComment({
            articleId: Number(id),
            commentId,
            content: updatedCommentContent,
          })
        );
        setEditingCommentId(null);
        setIsCommentUpdated(true);
      }
    },
    [dispatch, id, updatedCommentContent]
  );

  const handleCommentDelete = useCallback(
    (commentId: number) => {
      if (id) {
        dispatch(deleteComment({ articleId: Number(id), commentId }));
        setIsCommentUpdated(true);
      }
    },
    [dispatch, id]
  );

  const handleReply = useCallback(
    (commentId: number) => {
      if (replyContent[commentId]) {
        dispatch(
          addReply({
            articleId: Number(id),
            commentId,
            content: replyContent[commentId],
          })
        );
        setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
        setIsCommentUpdated(true);
      }
    },
    [dispatch, id, replyContent]
  );

  if (!article) {
    return <p>Loading...</p>;
  }

  const renderComments = (commentList: Comment[]) => {
    return commentList.map((comment) => (
      <li key={comment.id}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {comment.author && comment.author.username && (
            <span>{comment.author.username}</span>
          )}
          {editingCommentId === comment.id ? (
            <div>
              <textarea
                value={updatedCommentContent}
                onChange={(e) => setUpdatedCommentContent(e.target.value)}
              />
              <button onClick={() => handleCommentUpdate(comment.id)}>
                Update Comment
              </button>
              <button
                onClick={() => setEditingCommentId(null)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <span>{comment.content}</span>
          )}
        </div>
        {currentUserId !== null &&
          comment.author &&
          comment.author.id === Number(currentUserId) && (
            <div>
              <button
                onClick={() => startEditingComment(comment.id, comment.content)}
              >
                Edit
              </button>
              <button onClick={() => handleCommentDelete(comment.id)}>
                Delete
              </button>
            </div>
          )}
        <div>
          <textarea
            value={replyContent[comment.id] || ""}
            onChange={(e) =>
              setReplyContent((prev) => ({
                ...prev,
                [comment.id]: e.target.value,
              }))
            }
            placeholder="Reply to this comment..."
          />
          <button onClick={() => handleReply(comment.id)}>Reply</button>
        </div>
        {Array.isArray(comment.children) && comment.children.length > 0 && (
          <ul>{renderComments(comment.children)}</ul>
        )}
      </li>
    ));
  };

  return (
    <div>
      <h2>{article.title}</h2>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setUpdatedImage(e.target.files[0]);
                }
              }}
            />
          </div>
          <button type="submit">Update Article</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <img
              src={article.image}
              alt={article.title}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
            <p>{article.content}</p>
          </div>
          {currentUserId !== null &&
            article.author.id === Number(currentUserId) && (
              <div>
                <button onClick={handleEdit}>Edit Article</button>
                <button onClick={handleDelete}>Delete Article</button>
              </div>
            )}
        </>
      )}
      <h3>Comments</h3>
      <AddComment
        articleId={article.id}
        setIsComentleUpdated={setIsCommentUpdated}
      />
      <ul>{renderComments(comments)}</ul>
    </div>
  );
};

export default memo(ArticleDetail);
