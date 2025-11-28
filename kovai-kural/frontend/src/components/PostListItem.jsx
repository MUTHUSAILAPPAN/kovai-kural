// src/components/PostListItem.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * PostListItem
 * Props:
 *  - item: post object
 *  - compact: boolean, if true render small sidebar-style row
 */
export default function PostListItem({ item, compact = false }) {
  const nav = useNavigate()

  const handleClick = () => {
    if (!item?._id) return
    nav(`/post/${item._id}`)
  }

  if (!item) return null

  const firstImage =
    item.images && item.images.length > 0 ? item.images[0] : null

  // COMPACT: used in MyPostsSidebar, RecentPostsSidebar, etc.
  if (compact) {
    return (
      <button
        type="button"
        className="post-list-item compact"
        onClick={handleClick}
      >
        <div className="pli-body">
          <div className="pli-title" title={item.title}>
            {item.title}
          </div>
          <div className="pli-meta">
            {item.category?.title && (
              <span className="pli-category">{item.category.title}</span>
            )}
            {item.createdAt && (
              <span className="pli-dot">•</span>
            )}
            {item.createdAt && (
              <span className="pli-date">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {firstImage && (
          <div className="pli-thumb">
            <img src={firstImage} alt="" />
          </div>
        )}
      </button>
    )
  }

  // DEFAULT: a little larger, used wherever you want a simple row
  return (
    <button
      type="button"
      className="post-list-item"
      onClick={handleClick}
    >
      <div className="pli-body">
        <div className="pli-title" title={item.title}>
          {item.title}
        </div>
        <div className="pli-meta">
          {item.category?.title && (
            <span className="pli-category">{item.category.title}</span>
          )}
          {item.author?.handle && (
            <>
              <span className="pli-dot">•</span>
              <span className="pli-author">@{item.author.handle}</span>
            </>
          )}
          {item.createdAt && (
            <>
              <span className="pli-dot">•</span>
              <span className="pli-date">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  )
}
