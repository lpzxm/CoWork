<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estado actualizado - {{ $task->title }} - CoWork</title>
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
                                    <td align="right" style="font-size:13px;color:#64748b;">Cambio de estado</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom:20px;">
                                        <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:600;color:#0f172a;">Hola {{ $recipient->name }},</h2>
                                        <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">{{ $changedBy->name }} ha cambiado el estado de la tarea:</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="background:#f8fafc;border-radius:8px;padding:20px;border:1px solid #e2e8f0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-bottom:8px;">
                                                    <h3 style="margin:0;font-size:16px;font-weight:600;color:#019de1;">{{ $task->title }}</h3>
                                                </td>
                                            </tr>
                                            @if ($task->description)
                                                <tr>
                                                    <td style="padding-bottom:12px;font-size:14px;color:#475569;line-height:1.5;">
                                                        {{ $task->description }}
                                                    </td>
                                                </tr>
                                            @endif
                                            <tr>
                                                <td>
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:10px 0;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;width:120px;">Estado anterior</td>
                                                            <td style="padding:10px 0;font-size:13px;color:#0f172a;border-top:1px solid #e2e8f0;">
                                                                <span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:500;background:#f1f5f9;color:#64748b;">{{ $oldStatus }}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;width:120px;">Estado nuevo</td>
                                                            <td style="padding:10px 0;font-size:13px;color:#0f172a;border-top:1px solid #e2e8f0;">
                                                                <span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:500;background:#dbeafe;color:#1e40af;">{{ $newStatus }}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;width:120px;">Fecha límite</td>
                                                            <td style="padding:10px 0;font-size:13px;color:#0f172a;font-weight:500;border-top:1px solid #e2e8f0;">{{ $task->dt_delivery_limit ? \Carbon\Carbon::parse($task->dt_delivery_limit)->format('d/m/Y') : 'Sin fecha' }}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                @if ($newStatus === 'En progreso')
                                    <tr>
                                        <td style="padding-top:16px;">
                                            <div style="padding:12px 16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                                                <p style="margin:0;font-size:14px;color:#059669;font-weight:500;">Puedes empezar a trabajar en ella y añadir tus avances.</p>
                                            </div>
                                        </td>
                                    </tr>
                                @endif

                                <tr>
                                    <td style="padding-top:20px;">
                                        <a href="{{ $taskUrl ?? (config('app.frontend_url') . '/tasks/' . $task->id) }}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;background:#019de1;border-radius:8px;text-decoration:none;">
                                            Ver tarea en el sistema
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
