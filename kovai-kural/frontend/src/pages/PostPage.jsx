// src/pages/PostPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import CommentsThread from '../components/CommentsThread'

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/posts/${id}`)
        // backend might return { post: {...} } or the doc directly
        setPost(res.data.post || res.data)
      } catch (e) {
        console.error('Post load error', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="container">Loading post…</div>
  if (!post) return <div className="container">Post not found</div>

  return (
    <div className="container post-page">
      {/* Post card */}
      <article className="card" style={{ marginBottom: 16 }}>
        <div className="muted xsmall">
          {post.author?.name} @{post.author?.handle} •{' '}
          {post.category?.title || 'General'} •{' '}
          {new Date(post.createdAt).toLocaleString()}
        </div>

        <h1 style={{ marginTop: 6, marginBottom: 4 }}>{post.title}</h1>

        {post.body && (
          <p style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{post.body}</p>
        )}

        {post.images && post.images.length > 0 && (
          <div className="post-images" style={{ marginTop: 10 }}>
            {post.images.map(src => (
              <img key={src} src={src} alt="" />
            ))}
          </div>
        )}
      </article>

      {/* 🔽 Fully threaded comments UI */}
      <CommentsThread postId={id} collapsed={false} />
    </div>
  )
}
