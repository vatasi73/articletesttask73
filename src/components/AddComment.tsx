import React, { memo, useState } from "react";
import { addComment } from "../slices/articleSlice";
import { useAppDispatch } from "../store";

const AddComment: React.FC<{
  articleId: number;
  setIsComentleUpdated: (value: boolean) => void;
}> = ({ articleId, setIsComentleUpdated }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addComment({ articleId, content, parent: null }));
    setContent("");
    setIsComentleUpdated(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add a Comment</h4>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default memo(AddComment);
