import { supabase } from '../../utils/supabase-client';

const handler = async (req, res) => {
    supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
