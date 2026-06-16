<!DOCTYPE html>
<html>
<head>
    <title>Estado de tarea actualizado - {{ $task->title }}</title>
</head>
<body>
    <h1>Hola {{ $recipient->name }},</h1>
    <p>{{ $changedBy->name }} ha cambiado el estado de la tarea:</p>
    <ul>
        <li><strong>Título:</strong> {{ $task->title }}</li>
        <li><strong>Estado anterior:</strong> {{ $oldStatus }}</li>
        <li><strong>Estado nuevo:</strong> {{ $newStatus }}</li>
        @if ($newStatus === 'En progreso')
            <li><strong>Puedes empezar a trabajar en ella y añadir tus avances.</strong></li>
        @endif
        <li><strong>Fecha límite:</strong> {{ $task->dt_delivery_limit ?? 'Sin fecha' }}</li>
    </ul>
    <p>Puedes revisarla en el sistema.</p>
</body>
</html>
