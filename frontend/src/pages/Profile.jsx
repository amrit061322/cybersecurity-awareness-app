
import { useEffect, useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import FeedList from "../components/FeedList";

// Utility to resolve avatar or image URL
export const getAvatarUrl = (profile_picture) => {
  if (!profile_picture) return "";
  if (profile_picture.startsWith("/uploads/")) {
    const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    const origin = apiUrl.replace(/\/api\/?$/, "");
    return `${origin}${profile_picture}`;
  }
  return profile_picture;
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingName, setEditingName] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [status, setStatus] = useState("idle");

  const fileRef = useRef();

  // LOAD PROFILE + POSTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/users/profile");
        const userData = userRes.data.user || userRes.data;

        setProfile(userData);
        setForm({ name: userData.name || "" });
        updateUser(userData); // CRITICAL: sync everywhere instantly

        const postRes = await api.get("/community/feed", { params: { limit: 20 } });
        const all = postRes.data.posts || [];

        // FILTER POSTS BY AUTHOR ID (robust, with debug)
        const userId = userData._id || userData.id;
        const userPosts = all.filter((p) => {
          if (!p.author) return false;
          const authorId = typeof p.author === "string"
            ? p.author
            : p.author._id || p.author.id;
          return authorId && userId && authorId.toString() === userId.toString();
        });

        setPosts(userPosts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  if (!profile) {
    return <p className="p-6 text-white">Loading profile...</p>;
  }

  const avatar = avatarPreview || getAvatarUrl(profile?.profile_picture);

  // XP SYSTEM (frontend-based but realistic)
  const xp =
    posts.length * 20 +
    (profile.quiz_attempts || 0) * 10 +
    (profile.average_score || 0);

  const getLevel = () => {
    if (xp > 500) return "Cyber Master";
    if (xp > 250) return "Security Expert";
    if (xp > 100) return "Advanced User";
    return "Beginner";
  };


  const handleUpdate = async (event) => {
    event?.preventDefault();
    const nextName = form.name.trim();

    if (nextName.length < 2) {
      setStatus("error");
      return;
    }

    try {
      setStatus("idle");
      const res = await api.put("/users/update", { name: nextName });
      const updatedUser = res.data.user || res.data;
      setProfile(updatedUser);
      setForm({ name: updatedUser.name || "" });
      updateUser(updatedUser); // CRITICAL: sync everywhere instantly
      setEditingName(false);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };


  const handleUpload = async () => {
    if (!avatarFile) return;

    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);

      const res = await api.post("/users/upload", fd);
      const updatedUser = res.data.user || res.data;
      setProfile(updatedUser);
      updateUser(updatedUser); // CRITICAL: sync everywhere instantly
      setAvatarFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 space-y-8">

      {/* HEADER */}
      <div className="bg-[#0f172a] rounded-xl overflow-hidden border border-white/5">

        <div className="h-32 bg-gradient-to-r from-cyan-500/30 to-blue-600/30" />

        <div className="px-6 pb-6 relative">

          {/* AVATAR */}
          <div className="absolute -top-10 left-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#111827]">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <div className="text-white flex items-center justify-center h-full text-2xl">
                  {profile.name?.charAt(0)}
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />

            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="text-xs mt-2 text-cyan-400"
            >
              Change photo
            </button>

            {avatarFile && (
              <button
                type="button"
                onClick={handleUpload}
                className="block text-xs mt-1 text-green-400"
              >
                Save
              </button>
            )}
          </div>

          {/* INFO */}
          <div className="ml-32 pt-4">
            <div className="flex items-center gap-2">
              {editingName ? (
                <form
                  onSubmit={handleUpdate}
                  className="flex items-center gap-2"
                >
                  <input
                    className="text-2xl font-bold text-white bg-transparent border-b border-cyan-400 focus:outline-none px-1 w-48"
                    value={form.name}
                    onChange={e => setForm({ name: e.target.value })}
                    autoFocus
                  />
                  <button type="submit" className="text-cyan-400 hover:text-cyan-300">
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-200"
                    onClick={() => {
                      setForm({ name: profile.name || "" });
                      setEditingName(false);
                    }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white">
                    {profile.name}
                  </h1>
                  <button
                    className="ml-1 text-cyan-400 hover:text-cyan-300"
                    title="Edit name"
                    onClick={() => {
                      setEditingName(true);
                      setForm({ name: profile.name });
                    }}
                  >
                    <Pencil size={20} />
                  </button>
                </>
              )}
            </div>
            <p className="text-slate-400">{profile.email}</p>

            {/* BADGES */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300">
                Level: {getLevel()}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                Badge: {profile.badge_level}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-300">
                Awareness: {profile.awareness_level}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300">
                XP: {xp}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
                Posts: {posts.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline name edit status */}
      {status === "success" && (
        <p className="text-green-400 mt-2">Updated!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 mt-2">Error updating</p>
      )}

      {/* USER POSTS */}
      <div className="space-y-4">
        <h2 className="text-white text-lg font-semibold">
          Your Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-slate-400">No posts yet.</p>
        ) : (
          <FeedList
            posts={posts}
            onToggleLike={() => {}}
            onDelete={() => {}}
            loadComments={() => []}
            addComment={() => {}}
            currentUserId={profile.id || profile._id}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
