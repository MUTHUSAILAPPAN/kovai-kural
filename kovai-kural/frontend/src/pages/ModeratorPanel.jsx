import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function ModeratorPanel() {
  const { categoryId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('reports')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadData()
  }, [categoryId, user])

  async function loadData() {
    try {
      setLoading(true)
      const [reportsRes, postsRes] = await Promise.all([
        api.get(`/reports/category/${categoryId}`),
        api.get(`/posts?category=${categoryId}&limit=50`)
      ])
      setReports(reportsRes.data.reports || [])
      setPosts(postsRes.data.posts || [])
    } catch (err) {
      console.error('Load error', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleReportAction(reportId, status) {
    try {
      await api.put(`/reports/${reportId}`, { status })
      loadData()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update report')
    }
  }

  async function handleDeleteContent(reportId) {
    if (!window.confirm('Delete this content?')) return
    try {
      await api.delete(`/reports/${reportId}/content`)
      loadData()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete content')
    }
  }

  async function handleDeletePost(postId) {
    if (!window.confirm('Delete this post?')) return
    try {
      await api.delete(`/posts/${postId}`)
      loadData()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete post')
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container" style={{ maxWidth: '1200px', marginTop: '20px' }}>
      <h1>Moderator Panel</h1>
      
      <div className="tabs-row" style={{ marginBottom: '20px' }}>
        <button className={`tab ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>
          Reports ({reports.length})
        </button>
        <button className={`tab ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>
          All Posts ({posts.length})
        </button>
      </div>

      {tab === 'reports' && (
        <div>
          <h2>Reports</h2>
          {reports.length === 0 && <div className="muted">No pending reports</div>}
          {reports.map(report => (
            <div key={report._id} className="card" style={{ marginBottom: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div><strong>Type:</strong> {report.reportType}</div>
                  <div><strong>Reason:</strong> {report.reason}</div>
                  {report.customReason && <div><strong>Details:</strong> {report.customReason}</div>}
                  <div className="muted small">Reported by {report.reportedBy?.name} on {new Date(report.createdAt).toLocaleString()}</div>
                  <div><strong>Status:</strong> {report.status}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-ghost" onClick={() => handleReportAction(report._id, 'REVIEWED')}>
                    Mark Reviewed
                  </button>
                  <button className="btn btn-ghost" onClick={() => handleReportAction(report._id, 'DISMISSED')}>
                    Dismiss
                  </button>
                  <button 
                    className="btn btn-primary" 
                    style={{ background: 'var(--danger)' }}
                    onClick={() => handleDeleteContent(report._id)}
                  >
                    Delete Content
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'posts' && (
        <div>
          <h2>All Posts</h2>
          {posts.map(post => (
            <div key={post._id} className="card" style={{ marginBottom: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>{post.title}</h3>
                  <div className="muted small">By {post.author?.name} on {new Date(post.createdAt).toLocaleString()}</div>
                  <p>{post.body?.slice(0, 200)}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-ghost" onClick={() => navigate(`/post/${post._id}`)}>
                    View
                  </button>
                  <button 
                    className="btn btn-primary" 
                    style={{ background: 'var(--danger)' }}
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
