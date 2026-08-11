import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return jsonResponse({ error: 'Invalid or expired session' }, 401);
    }

    const body = await req.json();
    const { action } = body;

    // start: create verification challenge
    if (action === 'start') {
      const { roblox_username } = body;
      if (!roblox_username || typeof roblox_username !== 'string') {
        return jsonResponse({ error: 'Roblox username is required' }, 400);
      }

      const thumbRes = await fetch('https://users.roblox.com/v1/usernames/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernames: [roblox_username],
          excludeBannedUsers: true,
        }),
      });

      if (!thumbRes.ok) {
        return jsonResponse({ error: 'Failed to reach Roblox API' }, 502);
      }

      const thumbData = await thumbRes.json();
      if (!thumbData.data || thumbData.data.length === 0) {
        return jsonResponse({ error: 'Roblox user not found' }, 404);
      }

      const robloxUser = thumbData.data[0];
      const code = generateCode();

      const { error: upsertError } = await supabase
        .from('roblox_verifications')
        .upsert(
          {
            user_id: user.id,
            roblox_username: robloxUser.name,
            roblox_user_id: String(robloxUser.id),
            verification_code: code,
            status: 'pending',
            verified_at: null,
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) {
        return jsonResponse({ error: 'Failed to create verification' }, 500);
      }

      return jsonResponse({
        roblox_username: robloxUser.name,
        roblox_user_id: String(robloxUser.id),
        verification_code: code,
      });
    }

    // check: read the user's Roblox bio for the code
    if (action === 'check') {
      const { data: verification } = await supabase
        .from('roblox_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!verification || verification.status !== 'pending') {
        return jsonResponse({ error: 'No pending verification found' }, 404);
      }

      const profileRes = await fetch(
        `https://users.roblox.com/v1/users/${verification.roblox_user_id}`
      );

      if (!profileRes.ok) {
        return jsonResponse({ error: 'Failed to fetch Roblox profile' }, 502);
      }

      const profile = await profileRes.json();
      const bio: string = profile.description || '';

      if (bio.includes(verification.verification_code)) {
        const { error: updateError } = await supabase
          .from('roblox_verifications')
          .update({ status: 'verified', verified_at: new Date().toISOString() })
          .eq('user_id', user.id);

        if (updateError) {
          return jsonResponse({ error: 'Failed to update verification' }, 500);
        }

        return jsonResponse({
          verified: true,
          roblox_username: verification.roblox_username,
          roblox_user_id: verification.roblox_user_id,
        });
      }

      return jsonResponse({
        verified: false,
        message: 'Verification code not found in your Roblox bio. Make sure you saved your profile and try again.',
      });
    }

    // status: get current verification state
    if (action === 'status') {
      const { data: verification } = await supabase
        .from('roblox_verifications')
        .select('status, roblox_username, roblox_user_id, verification_code')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!verification) {
        return jsonResponse({ status: 'none' });
      }

      return jsonResponse(verification);
    }

    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: (err as Error).message ?? 'Internal server error' }, 500);
  }
});
