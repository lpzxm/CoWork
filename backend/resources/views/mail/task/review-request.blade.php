<!DOCTYPE html>
<html>
<head>
    <title>Han hecho una solicitud de revisión</title>
</head>
<body>
    <h1>Hola {{ $user->name }},</h1>
    <p>${ $user->name } ha hecho una solicitud de revisión:</p>
    <ul>
        <li><strong>Título:</strong> {{ $task->title }}</li>
        <li><strong>Descripción:</strong> {{ $task->description ?? 'Sin descripción' }}</li>
        <li><strong>Fecha límite:</strong> {{ $task->dt_delivery_limit ?? 'Sin fecha' }}</li>
        <li><strong>Estado:</strong> {{ $task->status->name ?? 'Sin estado' }}</li>
    </ul>
    <p>Puedes revisarla en el sistema.</p>
</body>
</html>