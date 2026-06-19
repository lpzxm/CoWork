<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        @switch($action)
            @case('approved') Revisión aprobada - CoWork @break
            @case('rejected') Revisión rechazada - CoWork @break
            @default Solicitud de revisión - CoWork
        @endswitch
    </title>
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
                                    <td align="right" style="font-size:13px;color:#64748b;">
                                        @switch($action)
                                            @case('approved') Aprobada @break
                                            @case('rejected') Rechazada @break
                                            @default Solicitud
                                        @endswitch
                                    </td>
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
                                        @switch($action)
                                            @case('requested')
                                                <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">{{ $requester->name }} ha solicitado la revisión de la tarea:</p>
                                            @break
                                            @case('approved')
                                                <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">{{ $requester->name }} ha <strong style="color:#059669;">aprobado</strong> la revisión de la tarea:</p>
                                            @break
                                            @case('rejected')
                                                <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">{{ $requester->name }} ha <strong style="color:#dc2626;">rechazado</strong> la revisión de la tarea:</p>
                                            @break
                                        @endswitch
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
                                                            <td style="padding:8px 0;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;width:120px;">Fecha límite</td>
                                                            <td style="padding:8px 0;font-size:13px;color:#0f172a;font-weight:500;border-top:1px solid #e2e8f0;">{{ $task->dt_delivery_limit ? \Carbon\Carbon::parse($task->dt_delivery_limit)->format('d/m/Y') : 'Sin fecha' }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:8px 0;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;width:120px;">Estado</td>
                                                            <td style="padding:8px 0;font-size:13px;color:#0f172a;font-weight:500;border-top:1px solid #e2e8f0;">{{ $task->status->name ?? 'Sin estado' }}</td>
                                                        </tr>
                                                        @if ($task->observations)
                                                            <tr>
                                                                <td style="padding:8px 0;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;width:120px;">Observación</td>
                                                                <td style="padding:8px 0;font-size:13px;color:#0f172a;font-weight:500;border-top:1px solid #e2e8f0;">{{ $task->observations }}</td>
                                                            </tr>
                                                        @endif
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-top:24px;">
                                        @if ($action === 'requested')
                                            <p style="margin:0 0 16px 0;font-size:14px;color:#64748b;">Ingresa al sistema para aprobarla o rechazarla.</p>
                                            <a href="{{ $taskUrl ?? (config('app.frontend_url') . '/tasks/' . $task->id) }}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;background:#019de1;border-radius:8px;text-decoration:none;">
                                                Ir a la tarea
                                            </a>
                                        @elseif($action === 'approved')
                                            <div style="text-align:center;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                                                <p style="margin:0;font-size:14px;color:#059669;font-weight:500;">La tarea ha sido aprobada correctamente.</p>
                                            </div>
                                        @elseif($action === 'rejected')
                                            <div style="text-align:center;padding:16px;background:#fef2f2;border-radius:8px;border:1px solid #fecaca;">
                                                <p style="margin:0;font-size:14px;color:#dc2626;font-weight:500;">La tarea ha sido rechazada. Revisa los detalles en el sistema.</p>
                                            </div>
                                        @endif
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
