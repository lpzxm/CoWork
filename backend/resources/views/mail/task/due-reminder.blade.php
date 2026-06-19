<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tareas próximas a vencer - CoWork</title>
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
                                    <td align="right" style="font-size:13px;color:#64748b;">Recordatorio</td>
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
                                        <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">Tienes las siguientes tareas próximas a vencer que aún no han sido marcadas como <strong style="color:#d97706;">En Revisión</strong>:</p>
                                    </td>
                                </tr>

                                @forelse ($tasks as $task)
                                    <tr>
                                        <td style="padding-bottom:12px;">
                                            <div style="background:#f8fafc;border-radius:8px;padding:16px;border:1px solid #e2e8f0;">
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="padding-bottom:8px;">
                                                            <h4 style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">{{ $task->title }}</h4>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td style="padding:6px 0;font-size:13px;color:#64748b;width:100px;">Estado</td>
                                                                    <td style="padding:6px 0;font-size:13px;">
                                                                        @php
                                                                            $badgeBg = match ($task->status_id) {
                                                                                1 => '#e0f2fe',
                                                                                2 => '#fef3c7',
                                                                                3 => '#dbeafe',
                                                                                default => '#f1f5f9',
                                                                            };
                                                                            $badgeColor = match ($task->status_id) {
                                                                                1 => '#0369a1',
                                                                                2 => '#92400e',
                                                                                3 => '#1e40af',
                                                                                default => '#64748b',
                                                                            };
                                                                        @endphp
                                                                        <span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:500;background:{{ $badgeBg }};color:{{ $badgeColor }};">{{ $task->status?->name ?? 'Desconocido' }}</span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:6px 0;font-size:13px;color:#64748b;">Creada por</td>
                                                                    <td style="padding:6px 0;font-size:13px;color:#0f172a;">{{ $task->creator->name ?? '—' }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:6px 0;font-size:13px;color:#64748b;">Coordinadores</td>
                                                                    <td style="padding:6px 0;font-size:13px;color:#0f172a;">{{ $task->coordinators->pluck('name')->implode(', ') ?: '—' }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:6px 0;font-size:13px;color:#64748b;">Vence</td>
                                                                    <td style="padding:6px 0;font-size:13px;color:#dc2626;font-weight:600;">{{ \Carbon\Carbon::parse($task->dt_delivery_limit)->format('d/m/Y') }}</td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td style="padding:20px 0;text-align:center;font-size:14px;color:#64748b;">No tienes tareas próximas a vencer.</td>
                                    </tr>
                                @endforelse

                                <tr>
                                    <td style="padding-top:16px;">
                                        <p style="margin:0;font-size:14px;color:#64748b;line-height:1.5;">Por favor, revisa cada tarea y, si es posible, finalízala o pásala a revisión para evitar retrasos.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:24px 0 0 0;text-align:center;font-size:13px;color:#94a3b8;line-height:1.6;">
                            <p style="margin:0;">CoWork &mdash; Sistema de gestión de tareas</p>
                            <p style="margin:4px 0 0 0;">Este es un recordatorio automático del sistema CoWork.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
