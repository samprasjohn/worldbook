import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';

export default function Post({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [comment, setComment] = useState('');

  useEffect(() => {
    socket.on('like', (updatedPost) => {
      if (updatedPost._id === post._id) {
        setLikes(updatedPost.likes);
      }
    });

    socket.on('comment', (updatedPost) => {
      if (updatedPost._id === post._id) {
        setComments(updatedPost.comments);
      }
    });
  }, [post._id]);

  const handleLike = async () => {
    await axios.post(`http://localhost:5000/api/posts/like/${post._id}`);
    socket.emit('like', post._id);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/api/posts/comment/${post._id}`, { text: comment });
    socket.emit('comment', { postId: post._id, text: comment });
    setComment('');
  };

  return (
    <div>
      <img src={post.imageUrl} alt="Post image" />
      <p>{post.description}</p>
      <button onClick={handleLike}>Like {likes}</button>
      <form onSubmit={handleComment}>
        <input 
          type="text" 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Comment</button>
      </form>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
}
