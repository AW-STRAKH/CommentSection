import React, { useState } from 'react';
//import it in the main


const Comment = ({ comment, onReplySubmit }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReplySubmit(replyText, comment.id);
      setReplyText('');
    }
    setShowReplyForm(false);
  };

  return (
    <div>
      <p>{comment.text}</p>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
      {showReplyForm && (
        <form onSubmit={handleReply}>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {comment.replies.map((reply) => (
        <Comment key={reply.id} comment={reply} onReplySubmit={onReplySubmit} />
      ))}
    </div>
  );
};




const CommentForm = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmit(commentText);
      setCommentText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};




const CommentSection = () => {
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = (text) => {
    const newComment = { id: Date.now(), text, replies: [] };
    setComments([...comments, newComment]);
  };

  const handleReplySubmit = (text, parentId) => {
    const newReply = { id: Date.now(), text, replies: [] };
    const updatedComments = addReplyToComments(comments, parentId, newReply);
    setComments(updatedComments);
  };

  const addReplyToComments = (comments, parentId, newReply) => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, newReply] };
      } else if (comment.replies.length > 0) {
        return { ...comment, replies: addReplyToComments(comment.replies, parentId, newReply) };
      }
      return comment;
    });
  };

  return (
    <div>
      <h2>Comment Section</h2>
      <CommentForm onSubmit={handleCommentSubmit} />
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} onReplySubmit={handleReplySubmit} />
      ))}
    </div>
  );
};

export default CommentSection;
