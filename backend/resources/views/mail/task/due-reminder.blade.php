<!DOCTYPE html>
<html>
<head>
    <title>Tareas próximas a vencer - CoWork</title>
    <style>
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8fafc; font-weight: 600; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 500; }
        .badge-creado { background: #e0f2fe; color: #0369a1; }
        .badge-pendiente { background: #fef3c7; color: #92400e; }
        .badge-progreso { background: #dbeafe; color: #1e40af; }
        .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <h1>Hola {{ $recipient->name }},</h1>
    <p>Tienes las siguientes tareas próximas a vencer que aún no han sido marcadas como <strong>En Revisión</strong>:</p>
    <table>
        <thead>
            <tr>
                <th>Título</th>
                <th>Estado</th>
                <th>Creada por</th>
                <th>Trabajan</th>
                <th>Vence</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tasks as $task)
                <tr>
                    <td><strong>{{ $task->title }}</strong></td>
                    <td>
                        @php
                            $badgeClass = match ($task->status_id) {
                                1 => 'badge-creado',
                                2 => 'badge-pendiente',
                                3 => 'badge-progreso',
                                default => '',
                            };
                        @endphp
                        <span class="badge {{ $badgeClass }}">{{ $task->status?->name ?? 'Desconocido' }}</span>
                    </td>
                    <td>{{ $task->creator->name ?? '—' }}</td>
                    <td>{{ $task->coordinators->pluck('name')->implode(', ') ?: '—' }}</td>
                    <td>{{ \Carbon\Carbon::parse($task->dt_delivery_limit)->format('d/m/Y') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <p>Por favor, revisa cada tarea y, si es posible, finalízala o pásala a revisión para evitar retrasos.</p>
    <div class="footer">
        <p>Este es un recordatorio automático del sistema CoWork.</p>
    </div>
</body>
</html>