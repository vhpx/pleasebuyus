import { supabase } from '../../../utils/supabase-client';

const handler = async (req, res) => {
    const authUser = await supabase.auth.api.getUserByCookie(req);
    const userId = authUser?.user?.id;

    if (!authUser || !userId)
        return res.status(401).redirect('/logout?redirectTo=/login');

    const { name, phoneNumber, birthday, gender } = req.body;

    switch (req.method) {
        case 'POST':
            try {
                const { data, error } = await supabase
                    .from('users')
                    .update({
                        name,
                        phone_number: phoneNumber,
                        birthday,
                        gender,
                    })
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                return res.json(data);
            } catch (e) {
                return res.status(500).send(e.message);
            }

        case 'GET':
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();

                if (error) throw error;
                return res.json(data);
            } catch (e) {
                return res.status(500).send(e.message);
            }
    }
};

export default handler;
