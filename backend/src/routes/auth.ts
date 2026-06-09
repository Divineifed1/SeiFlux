import { Router, Request, Response } from 'express';

const router = Router();

router.get('/github/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/?error=no_code`);
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const userData = await userResponse.json();

    const user = {
      login: userData.login,
      avatar_url: userData.avatar_url,
      name: userData.name || userData.login,
    };

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?user=${encodeURIComponent(JSON.stringify(user))}`
    );
  } catch (error) {
    console.error('Auth callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/?error=callback_failed`);
  }
});

export default router;
