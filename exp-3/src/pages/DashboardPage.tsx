import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeHeader } from '../lib/jwt';
import type { JWTPayload } from '../types/auth';

interface TokenState {
  raw: string | null;
  header: { alg: string; typ: string } | null;
  payload: JWTPayload | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
}

const defaultPosts: Post[] = [
  { id: '1', title: 'Introduction to JWT', content: 'JSON Web Tokens are an open standard for stateless session handling.', authorId: 'usr_admin', authorName: 'Admin User' },
  { id: '2', title: 'Stateless Architecture', content: 'Stateless backends scale easily because they do not track session databases.', authorId: 'usr_admin', authorName: 'Admin User' }
];

export const DashboardPage = () => {
  const { user, logout, getDecodedToken, getRawToken } = useAuth();
  const navigate = useNavigate();
  const [tokenState, setTokenState] = useState<TokenState>({
    raw: null,
    header: null,
    payload: null,
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const raw = getRawToken();
    const payload = getDecodedToken();
    const header = raw ? decodeHeader(raw) : null;
    setTokenState({ raw, header, payload });

    const stored = localStorage.getItem('exp3_posts');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      localStorage.setItem('exp3_posts', JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    }
  }, [getRawToken, getDecodedToken]);

  const savePosts = (newPosts: Post[]) => {
    localStorage.setItem('exp3_posts', JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      authorId: user?.id || 'unknown',
      authorName: user?.name || user?.username || 'Anonymous',
    };

    savePosts([...posts, newPost]);
    setNewTitle('');
    setNewContent('');
  };

  const handleStartEdit = (post: Post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleSaveEdit = (postId: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, title: editTitle.trim(), content: editContent.trim() };
      }
      return p;
    });
    savePosts(updated);
    setEditingId(null);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const filtered = posts.filter(p => p.id !== postId);
      savePosts(filtered);
    }
  };

  const tokenParts = tokenState.raw ? tokenState.raw.split('.') : [];

  const canAdd = user?.role === 'poster';
  const canEdit = (post: Post) => user?.role === 'admin' || (user?.role === 'poster' && post.authorId === user?.id);
  const canDelete = user?.role === 'admin';

  return (
    <div className="bg-hybrid min-h-screen p-6 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Dashboard</h1>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Welcome, <span className="font-bold">{user?.name}</span> ({user?.email}) 
              <span className="neo-pill text-[10px] uppercase font-bold text-indigo-700 px-3 py-1 ml-3 align-middle tracking-widest">
                {user?.role}
              </span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="neo-button text-red-600 text-xs uppercase tracking-widest px-6 py-2.5"
          >
            Logout
          </button>
        </div>

        {/* Post Management Section */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Post Creation (Visible only to Poster role) */}
          <div className={`glass-panel p-6 space-y-6 ${canAdd ? '' : 'hidden'}`}>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Create New Post
            </h2>
            <form onSubmit={handleCreatePost} className="space-y-5">
              <div>
                <label htmlFor="new-title" className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-1">
                  Post Title
                </label>
                <input
                  id="new-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter title"
                  className="neo-input w-full px-4 py-2.5 text-sm text-slate-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-content" className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-1">
                  Post Content
                </label>
                <textarea
                  id="new-content"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter content description"
                  rows={4}
                  className="neo-input w-full px-4 py-2.5 text-sm text-slate-800 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="neo-button neo-button-primary w-full py-3 text-xs uppercase tracking-widest"
              >
                Publish Post
              </button>
            </form>
          </div>

          {/* Posts List */}
          <div className={`glass-panel p-6 space-y-6 ${canAdd ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Platform Feed
            </h2>
            {posts.length === 0 ? (
              <p className="text-sm font-medium text-slate-500 text-center py-8">No posts available</p>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="p-5 bg-white/20 rounded-2xl border border-white/30 shadow-sm space-y-3 transition hover:bg-white/30">
                    {editingId === post.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="neo-input w-full px-4 py-2 text-sm font-bold text-slate-800"
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="neo-input w-full px-4 py-2 text-sm text-slate-700 resize-none"
                        />
                        <div className="flex gap-3 justify-end pt-1">
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="neo-button text-emerald-600 text-[10px] uppercase tracking-widest px-4 py-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="neo-button text-slate-500 text-[10px] uppercase tracking-widest px-4 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-bold text-slate-800 leading-tight">{post.title}</h3>
                          <div className="flex gap-2 shrink-0">
                            {canEdit(post) && (
                              <button
                                onClick={() => handleStartEdit(post)}
                                className="neo-button text-indigo-600 text-[9px] uppercase tracking-widest px-3 py-1.5"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="neo-button text-red-600 text-[9px] uppercase tracking-widest px-3 py-1.5"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{post.content}</p>
                        <div className="text-[11px] font-bold text-slate-500 tracking-wide mt-2">
                          Author: <span className="text-slate-800">{post.authorName}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security / JWT Information */}
        <div className="grid md:grid-cols-3 gap-8 pb-8">
          
          {/* Decoded JWT Claims */}
          <div className="md:col-span-1 glass-panel p-6 space-y-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Decoded Claims
            </h2>
            <div className="neo-input p-4 overflow-x-auto">
              <pre className="text-[11px] font-mono font-medium text-slate-700">
                {JSON.stringify(tokenState.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Raw Encoded JWT Token */}
          <div className="md:col-span-2 glass-panel p-6 space-y-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Stateless Architecture Token
            </h2>
            <div className="neo-input p-5 break-all leading-loose select-all font-mono text-[11px] font-semibold text-slate-700">
              {tokenParts.length === 3 ? (
                <>
                  <span className="text-purple-600 drop-shadow-sm">{tokenParts[0]}</span>
                  <span className="text-slate-400 font-bold px-1">.</span>
                  <span className="text-cyan-700 drop-shadow-sm">{tokenParts[1]}</span>
                  <span className="text-slate-400 font-bold px-1">.</span>
                  <span className="text-rose-600 drop-shadow-sm">{tokenParts[2]}</span>
                </>
              ) : (
                <span className="text-slate-400">No token active</span>
              )}
            </div>
            
            {/* Legend Pill style */}
            <div className="grid grid-cols-3 gap-4 text-[10px] text-center font-bold uppercase tracking-widest">
              <span className="neo-pill text-purple-600 py-2">Header</span>
              <span className="neo-pill text-cyan-700 py-2">Payload</span>
              <span className="neo-pill text-rose-600 py-2">Signature</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
