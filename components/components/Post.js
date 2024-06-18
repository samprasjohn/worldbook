// C:\Users\CUTECH000\worldbook\frontend\components\Post.js
export default function Post({ post }) {
    return (
      <div>
        <img src={`http://localhost:5000/${post.image}`} alt="Post image" style={{ maxWidth: '100%' }} />
        <p>{post.description}</p>
        <p>Likes: {post.likes.length}</p>
        <div>
          {post.comments.map((comment, index) => (
            <p key={index}>{comment.text}</p>
          ))}
        </div>
      </div>
    );
  }
  