<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desasignado de tarea - CoWork</title>
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
                                    <td align="right" style="font-size:13px;color:#64748b;">Desasignación</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom:20px;">
                                        <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:600;color:#0f172a;">Hola {{ $user->name }},</h2>
                                        <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">Te han desasignado de la siguiente tarea en CoWork:</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background:#fef2f2;border-radius:8px;padding:20px;border:1px solid #fecaca;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-bottom:8px;">
                                                    <h3 style="margin:0;font-size:16px;font-weight:600;color:#dc2626;">{{ $task->title }}</h3>
                                                </td>
                                            </tr>
                                            @if ($task->description)
                                                <tr>
                                                    <td style="font-size:14px;color:#475569;line-height:1.5;">
                                                        {{ $task->description }}
                                                    </td>
                                                </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top:20px;">
                                        <p style="margin:0;font-size:14px;color:#64748b;line-height:1.5;">Ya no tienes acceso a esta tarea. Si crees que se trata de un error, contacta con tu coordinador.</p>
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
