import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export const FeedPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { logout } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['feed'],
    queryFn: postsApi.getFeed,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, caption }: { file: File; caption: string }) =>
      postsApi.upload(file, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      setToast({ message: 'Post uploaded successfully!', type: 'success' });
      setUploadFile(null);
      setCaption('');
    },
    onError: () => {
      setToast({ message: 'Upload failed. Please try again.', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      setToast({ message: 'Post deleted successfully!', type: 'success' });
      setDeleteConfirm(null);
    },
    onError: () => {
      setToast({ message: 'Delete failed. Please try again.', type: 'error' });
    },
  });

  const handleUpload = () => {
    if (uploadFile) uploadMutation.mutate({ file: uploadFile, caption });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Soft gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_55%)]" />

      {/* Subtle grain texture overlay (no extra CSS file needed) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative bg-white/70 backdrop-blur-xl border-b border-white/60 top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Feed
          </h1>

          <Button onClick={logout} variant="secondary">
            Logout
          </Button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Create Post */}
        <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/60 ring-1 ring-black/5 shadow-[0_10px_35px_-20px_rgba(0,0,0,0.35)]">
          {/* subtle highlight texture */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.09),transparent_55%)]" />

          <div className="relative flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                ✨ Create a post
              </h2>
              <p className="text-sm text-gray-500 mt-1">Share an image/video with a caption</p>
            </div>
          </div>

          <div className="relative space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Image or Video
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white/80 backdrop-blur"
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!uploadFile || uploadMutation.isPending}
              className="w-full"
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Post'}
            </Button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50/80 text-red-600 px-6 py-4 rounded-xl text-center border border-red-100">
            Failed to load feed. Please try again.
          </div>
        )}

        {/* Empty */}
        {data && data.posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500">Be the first to share something!</p>
          </div>
        )}

        {/* Feed */}
        {data && data.posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post) => (
              <div
                key={post.id}
                className="relative bg-white/75 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/60 ring-1 ring-black/5 shadow-[0_10px_35px_-20px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_55px_-25px_rgba(0,0,0,0.45)] transition-all duration-300"
              >
                {/* subtle highlight texture */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.07),transparent_55%)]" />

                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    {post.file_type === 'image' ? (
                      <img
                        src={post.url}
                        alt={post.caption}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <video src={post.url} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                <div className="relative p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold">
                        {post.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{post.email}</p>
                        <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                      </div>
                    </div>

                    {post.is_owner && (
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  {post.caption && (
                    <div className="mt-3">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                        {post.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                variant="danger"
                className="flex-1"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
