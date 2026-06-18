<!DOCTYPE html>
<html>
<head>
    <title>Nueva subtarea creada - {{ $task->title }} - CoWork</title>
</head>
<body>
    <h1>Hola {{ $recipient->name }},</h1>
    <p>{{ $creator->name }} ha creado una nueva subtarea en la tarea:</p>
    <ul>
        <li><strong>Tarea:</strong> {{ $task->title }}</li>
        <li><strong>Descripción:</strong> {{ $task->description ?? 'Sin descripción' }}</li>
        <li><strong>Estado:</strong> {{ $task->status->name ?? 'Sin estado' }}</li>
        <li><strong>Fecha límite:</strong> {{ $task->dt_delivery_limit ?? 'Sin fecha' }}</li>
    </ul>
    <h3>Nueva subtarea</h3>
    <ul>
        <li><strong>Título:</strong> {{ $subTask->title }}</li>
        <li><strong>Descripción:</strong> {{ $subTask->description ?? 'Sin descripción' }}</li>
        <li><strong>Estado:</strong> {{ $subTask->status->name ?? 'Sin estado' }}</li>
        <li><strong>Fecha límite:</strong> {{ $subTask->dt_delivery_limit ?? 'Sin fecha' }}</li>
    </ul>
    <p>
        <a href="{{ $taskUrl }}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px;">
            Ver tarea en el sistema
        </a>
    </p>
</body>
</html>
