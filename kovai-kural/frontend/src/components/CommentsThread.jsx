// src/components/CommentsThread.jsx
import React, { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

/**
 * CommentsThread
 * Props:
 * - postId: id of the post
 * - collapsed: optional boolean to initially collapse comments
 * - maxDepth: optional limit for nested recursion (default 6)
 */
export default function CommentsThread({ postId, collapsed = true, maxDepth = 6 }) {
  const [open, setOpen] = useState(!collapsed)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([]) // top-level roots (each may have children[])
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (open) fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, postId])

  async function fetchComments() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/posts/${postId}/comments`)
      setComments(res.data.comments || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = () => setOpen(s => !s)

  return (
    <div className="comments-root">
      <div className="comments-header">
        <button className="btn-link small" onClick={handleToggle}>
          {open ? 'Hide comments' : 'Show comments'}
        </button>
        <span className="muted small" style={{marginLeft:8}}>{comments.length} comments</span>
      </div>

      {open && (
        <div className="comments-body">
          {loading && <div className="muted">Loading comments…</div>}
          {error && <div className="error">{error}</div>}

          <CommentComposer postId={postId} onCreated={fetchComments} />

          <div className="comments-list">
            {comments.map(c => (
              <CommentNode key={c._id} node={c} postId={postId} depth={0} maxDepth={maxDepth} onReplyCreated={fetchComments} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* Composer for root-level comment */
function CommentComposer({ postId, parentId = null, onCreated, autoFocus = false }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const { user } = useAuth()
  const taRef = useRef(null)

  useEffect(() => {
    if (autoFocus && taRef.current) taRef.current.focus()
  }, [autoFocus])

  const submit = async (e) => {
    e?.preventDefault()
    setErr('')
    if (!user) { setErr('You must be logged in to comment'); return }
    if (!text.trim()) { setErr('Comment cannot be empty'); return }
    try {
      setSubmitting(true)
      await api.post(`/posts/${postId}/comments`, { body: text, parentComment: parentId || null })
      setText('')
      onCreated && onCreated()
    } catch (err) {
      setErr(err?.response?.data?.message || 'Failed to post comment')
    } finally { setSubmitting(false) }
  }

  return (
    <form className="comment-composer" onSubmit={submit}>
      <textarea
        ref={taRef}
        placeholder={user ? 'Write a comment…' : 'Log in to comment'}
        value={text}
        onChange={e => setText(e.target.value)}
        rows={2}
        disabled={!user}
      />
      <div className="composer-actions">
        {err && <div className="error tiny">{err}</div>}
        <div style={{marginLeft:'auto'}}>
          <button type="button" className="btn" onClick={() => { setText(''); setErr('') }} disabled={!text}>Clear</button>
          <button type="submit" className="btn btn-primary" disabled={submitting || !text.trim()}>
            {submitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </div>
    </form>
  )
}

/* Recursive comment node */
function CommentNode({ node, postId, depth = 0, maxDepth = 6, onReplyCreated }) {
  const [showReply, setShowReply] = useState(false)
  const [collapsedChildren, setCollapsedChildren] = useState(false)
  const { user } = useAuth()

  const toggleReply = () => setShowReply(s => !s)
  const toggleChildren = () => setCollapsedChildren(s => !s)

  return (
    <div className="comment-node" style={{ marginLeft: depth ? 20 : 0 }}>
      <div className="comment-main">
        <img className="comment-avatar" src={node.author?.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${node.author.avatarUrl}` : '/default-avatar.png'} alt={node.author?.name} />
        <div className="comment-body">
          <div className="comment-meta">
            <strong>{node.author?.name}</strong>
            <span className="muted small" style={{marginLeft:8}}>@{node.author?.handle}</span>
            <span className="muted small" style={{marginLeft:12}}>{new Date(node.createdAt).toLocaleString()}</span>
          </div>
          <div className="comment-text">{node.body}</div>

          <div className="comment-actions">
            <button className="btn-link small" onClick={toggleReply}>{showReply ? 'Cancel' : 'Reply'}</button>
            {/* placeholder for upvote/downvote on comments in future */}
            {node.children && node.children.length > 0 && depth + 1 < maxDepth && (
              <button className="btn-link small" onClick={toggleChildren}>
                {collapsedChildren ? `Show ${node.children.length} replies` : 'Hide replies'}
              </button>
            )}
          </div>

          {showReply && (
            <div style={{marginTop:8}}>
              <CommentComposer postId={postId} parentId={node._id} onCreated={() => { setShowReply(false); onReplyCreated && onReplyCreated() }} autoFocus />
            </div>
          )}
        </div>
      </div>

      {/* children */}
      {node.children && node.children.length > 0 && !collapsedChildren && (
        <div className="comment-children">
          {node.children.map(child => (
            <CommentNode key={child._id} node={child} postId={postId} depth={depth + 1} maxDepth={maxDepth} onReplyCreated={onReplyCreated} />
          ))}
        </div>
      )}
    </div>
  )
}
