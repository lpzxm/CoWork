<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva subtarea - {{ $task->title }} - CoWork</title>
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
                                    <td align="right" style="font-size:13px;color:#64748b;">Nueva subtarea</td>
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
                                        <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">{{ $creator->name }} ha creado una nueva subtarea.</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-bottom:16px;">
                                        <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Tarea padre</h3>
                                        <div style="background:#f8fafc;border-radius:8px;padding:16px;border:1px solid #e2e8f0;">
                                            <p style="margin:0 0 4px 0;font-size:15px;font-weight:600;color:#019de1;">{{ $task->title }}</p>
                                            @if ($task->description)
                                                <p style="margin:0 0 8px 0;font-size:13px;color:#64748b;">{{ $task->description }}</p>
                                            @endif
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="font-size:12px;color:#64748b;width:100px;">Estado</td>
                                                    <td style="font-size:12px;color:#0f172a;font-weight:500;">{{ $task->status->name ?? 'Sin estado' }}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size:12px;color:#64748b;padding-top:4px;">Vence</td>
                                                    <td style="font-size:12px;color:#0f172a;font-weight:500;padding-top:4px;">{{ $task->dt_delivery_limit ? \Carbon\Carbon::parse($task->dt_delivery_limit)->format('d/m/Y') : 'Sin fecha' }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-bottom:24px;">
                                        <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Subtarea creada</h3>
                                        <div style="background:#f0f9ff;border-radius:8px;padding:16px;border:1px solid #bae6fd;">
                                            <p style="margin:0 0 4px 0;font-size:15px;font-weight:600;color:#0369a1;">{{ $subTask->title }}</p>
                                            @if ($subTask->description)
                                                <p style="margin:0 0 8px 0;font-size:13px;color:#64748b;">{{ $subTask->description }}</p>
                                            @endif
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="font-size:12px;color:#64748b;width:100px;">Estado</td>
                                                    <td style="font-size:12px;color:#0f172a;font-weight:500;">{{ $subTask->status->name ?? 'Sin estado' }}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size:12px;color:#64748b;padding-top:4px;">Vence</td>
                                                    <td style="font-size:12px;color:#0f172a;font-weight:500;padding-top:4px;">{{ $subTask->dt_delivery_limit ? \Carbon\Carbon::parse($subTask->dt_delivery_limit)->format('d/m/Y') : 'Sin fecha' }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <a href="{{ $taskUrl }}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;background:#019de1;border-radius:8px;text-decoration:none;">
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
