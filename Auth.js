// =====================================================
// VANTAGE X COMMUNITY
// Authentication and Session Management
// =====================================================

"use strict";

/**
 * Register a new Community member.
 */
async function registerCommunityUser(fullName, username, email, password) {
  const cleanName = String(fullName || "").trim();
  const cleanUsername = String(username || "").trim().toLowerCase();
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (cleanName.length < 2 || cleanName.length > 100) {
    return { error: { message: "Enter a valid full name." } };
  }

  if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
    return {
      error: {
        message: "Username must be 3–30 characters and contain only letters, numbers or underscores."
      }
    };
  }

  if (!cleanEmail || cleanEmail.length > 254) {
    return { error: { message: "Enter a valid email address." } };
  }

  if (typeof password !== "string" || password.length < 10 || password.length > 72) {
    return {
      error: {
        message: "Your password must contain at least 10 characters."
      }
    };
  }

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          username: cleanUsername
        }
      }
    });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Log in an existing member.
 */
async function loginCommunityUser(email, password) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanEmail || typeof password !== "string" || !password) {
    return {
      data: null,
      error: { message: "Enter your email address and password." }
    };
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Log out the current member.
 */
async function logoutCommunityUser() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}

/**
 * Retrieve the current authenticated session.
 */
async function getCommunitySession() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    return { session: data?.session || null, error };
  } catch (error) {
    return { session: null, error };
  }
}

/**
 * Retrieve the authenticated member.
 */
async function getCurrentCommunityUser() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    return { user: data?.user || null, error };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Listen for login, logout and session changes.
 */
function onCommunityAuthStateChange(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("A valid callback function is required.");
  }

  return supabaseClient.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Send a password reset email.
 */
async function sendCommunityPasswordReset(email, redirectTo) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanEmail) {
    return { error: { message: "Enter your email address." } };
  }

  try {
    const options = redirectTo ? { redirectTo } : undefined;

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      cleanEmail,
      options
    );

    return { error };
  } catch (error) {
    return { error };
  }
}
