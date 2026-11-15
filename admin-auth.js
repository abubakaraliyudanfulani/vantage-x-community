
// VANTAGE X COMMUNITY
// Administrator Authentication Module

async function verifyCommunityAdmin() {
  try {
    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) throw sessionError;

    const session = sessionData.session;

    if (!session) {
      return {
        authorized: false,
        reason: "not_logged_in"
      };
    }

    const user = session.user;

    const { data: adminRecord, error: adminError } =
      await supabaseClient
        .from("community_admins")
        .select("user_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

    if (adminError) throw adminError;

    if (!adminRecord) {
      return {
        authorized: false,
        reason: "not_an_admin"
      };
    }

    return {
      authorized: true,
      user: user,
      role: adminRecord.role
    };

  } catch (error) {
    console.error("Admin verification failed:", error);

    return {
      authorized: false,
      reason: "verification_error"
    };
  }
}

async function communityAdminLogout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Admin logout failed:", error);
    throw error;
  }

  window.location.href = "login.html";
}
