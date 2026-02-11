import { Resend } from 'resend'
import 'server-only'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(params: {
	to: string
	resetUrl: string
}) {
	const from = process.env.EMAIL_FROM
	if (!from) throw new Error('EMAIL_FROM is not configured')

	const html = `
<!doctype html>
<html lang="ru">
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Сброс пароля</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;color:#111827;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background:#f6f7fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="max-width:600px;">
            <tr>
              <td style="padding:0 0 12px 0;text-align:center;">
                <span style="display:inline-block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4f46e5;">trim.ly</span>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:28px 24px;box-shadow:0 10px 24px rgba(15,23,42,.06);">
                <h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.25;color:#111827;">Сброс пароля</h1>
                <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#4b5563;">
                  Мы получили запрос на смену пароля. Нажмите кнопку ниже, чтобы создать новый пароль для аккаунта.
                </p>
                <table role="presentation" cellPadding="0" cellSpacing="0" style="margin:0 0 20px 0;">
                  <tr>
                    <td>
                      <a href="${params.resetUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 18px;border-radius:10px;">
                        Сбросить пароль
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 10px 0;font-size:13px;line-height:1.6;color:#6b7280;">
                  Если кнопка не работает, скопируйте ссылку и откройте в браузере:
                </p>
                <p style="margin:0 0 20px 0;font-size:13px;line-height:1.6;word-break:break-all;">
                  <a href="${params.resetUrl}" style="color:#4f46e5;text-decoration:underline;">${params.resetUrl}</a>
                </p>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;">
                  <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
                    Если вы не запрашивали смену пароля, просто проигнорируйте это письмо. Ссылка истечет автоматически.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 4px 0 4px;text-align:center;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
                  © ${new Date().getFullYear()} trim.ly. Все права защищены.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

	await resend.emails.send({
		from,
		to: params.to,
		subject: 'Сброс пароля',
		html
	})
}
