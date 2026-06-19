<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a CoWork</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <tr>
                        <td style="padding:0 0 24px 0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-size:22px;font-weight:700;color:#0f172a;">CoWork</td>
                                    <td align="right" style="font-size:13px;color:#64748b;">Credenciales de acceso</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom:20px;">
                                        <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:600;color:#0f172a;">Bienvenido, {{ $name }}!</h2>
                                        <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">Se ha creado tu cuenta en CoWork. Estas son tus credenciales de acceso:</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="background:#f8fafc;border-radius:8px;padding:20px;border:1px solid #e2e8f0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;width:100px;">Correo</td>
                                                <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;border-bottom:1px solid #e2e8f0;">{{ $email }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;width:100px;">Contraseña</td>
                                                <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;border-bottom:1px solid #e2e8f0;font-family:ui-monospace,monospace;">{{ $plainPassword }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-top:20px;">
                                        <div style="padding:12px 16px;background:#fef3c7;border-radius:8px;border:1px solid #fde68a;">
                                            <p style="margin:0;font-size:14px;color:#92400e;font-weight:500;">Recomendamos cambiar la contraseña al iniciar sesión.</p>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-top:20px;">
                                        <a href="{{ config('app.frontend_url') }}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;background:#019de1;border-radius:8px;text-decoration:none;">
                                            Ir a CoWork
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:24px 0 0 0;text-align:center;font-size:13px;color:#94a3b8;line-height:1.6;">
                            <p style="margin:0;">CoWork &mdash; Sistema de gestión de tareas</p>
                            <p style="margin:4px 0 0 0;">Este es un mensaje automático, por favor no respondas a este correo.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
