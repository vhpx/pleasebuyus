import { supabase } from '../../utils/supabase-client';

const handler = async (req, res) => {
    const authUser = await supabase.auth.api.getUserByCookie(req);
    const userId = authUser?.user?.id || req.query.id;

    if (!userId) return res.status(401).send('Unauthorized');

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (adminError) throw error;

        return res.json({ ...(data || {}), isAdmin: !!adminData });
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

export default handler;
