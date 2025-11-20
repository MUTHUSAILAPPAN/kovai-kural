// frontend/src/components/SearchBar.jsx
import React, { useState, useRef } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(q, 300);
  const nav = useNavigate();

  React.useEffect(() => {
    if (!debounced) { setResults(null); return; }
    let mounted = true;
    api.get(`/search?q=${encodeURIComponent(debounced)}&limit=6`).then(r => {
      if (mounted) setResults(r.data);
    }).catch(()=>{/* silent */});
    return () => { mounted = false; }
  }, [debounced]);

  function onSubmit(e) {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <div className="searchbar">
      <form onSubmit={onSubmit}>
        <input value={q} onChange={e=>{ setQ(e.target.value); setOpen(true); }} placeholder="Search posts, people, categories..." />
      </form>

      {open && results && (
        <div className="search-dropdown">
          {results.posts?.length>0 && <div><strong>Posts</strong>{results.posts.slice(0,3).map(p=> <div key={p._id} onClick={()=>nav(`/post/${p._id}`)}>{p.title}</div>)}</div>}
          {results.users?.length>0 && <div><strong>People</strong>{results.users.slice(0,3).map(u=> <div key={u._id} onClick={()=>nav(`/profile/${u.handle}`)}>{u.name}</div>)}</div>}
          {results.categories?.length>0 && <div><strong>Categories</strong>{results.categories.slice(0,3).map(c=> <div key={c._id} onClick={()=>nav(`/category/${c.slug}`)}>{c.title}</div>)}</div>}
        </div>
      )}
    </div>
  );
}
