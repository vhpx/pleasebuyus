import { supabase } from '../../utils/supabase-client';

const handler = async (req, res) => {
    const authUser = await supabase.auth.api.getUserByCookie(req);
    const userEmail = authUser?.user?.email;

    if (!userEmail) return res.status(401).send('Unauthorized');

    const secretKey = process.env.VHP_SECRET_KEY;
    if (!secretKey)
        return res
            .status(500)
            .send('Internal server error, invalid secret key');

    try {
        const response = await fetch('https://www.vohoangphuc.com/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secretKey,
                email: userEmail,
            }),
        });

        const userData = await response.json();

        return res.json(userData);
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

export default handler;
