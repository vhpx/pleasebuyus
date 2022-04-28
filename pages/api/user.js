import { supabase } from '../../utils/supabase-client';

const handler = async (req, res) => {
    const authUser = await supabase.auth.api.getUserByCookie(req);
    const userId = authUser?.user?.id;

    if (!userId) return res.status(401).send('Unauthorized');

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return res.json(data);
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

export default handler;
