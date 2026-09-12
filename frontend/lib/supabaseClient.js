import api from "./api";

let authListeners = [];

const notifyListeners = (event, session) => {
  authListeners.forEach(listener => listener(event, session));
};

export const mockAuth = {
  signInWithPassword: async ({ email, password }) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const session = { user: response.user };
      if (typeof window !== "undefined") {
        sessionStorage.setItem("bg_session", JSON.stringify(session));
      }
      notifyListeners("SIGNED_IN", session);
      return { data: { session }, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Invalid email or password." } };
    }
  },

  signUp: async ({ email, password }) => {
    try {
      const response = await api.post("/api/auth/signup", { email, password });
      const session = { user: response.user };
      if (typeof window !== "undefined") {
        sessionStorage.setItem("bg_session", JSON.stringify(session));
      }
      notifyListeners("SIGNED_IN", session);
      return { data: { session }, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "User already exists." } };
    }
  },

  signOut: async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("bg_session");
    }
    notifyListeners("SIGNED_OUT", null);
    return { error: null };
  },

  getSession: async () => {
    if (typeof window === "undefined") return { data: { session: null } };
    const sessionStr = sessionStorage.getItem("bg_session");
    return { data: { session: sessionStr ? JSON.parse(sessionStr) : null } };
  },

  onAuthStateChange: (callback) => {
    authListeners.push(callback);
    return { 
      data: { 
        subscription: { 
          unsubscribe: () => {
            authListeners = authListeners.filter(l => l !== callback);
          } 
        } 
      } 
    };
  }
};

export const supabase = { auth: mockAuth };
