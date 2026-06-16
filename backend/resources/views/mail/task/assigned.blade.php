<!DOCTYPE html>
<html>
<head>
    <title>Te han asignado una tarea</title>
</head>
<body>
    <h1>Hola {{ $user->name }},</h1>
    <p>Te han asignado una nueva tarea:</p>
    <ul>
        <li><strong>Título:</strong> {{ $task->title }}</li>
        <li><strong>Descripción:</strong> {{ $task->description ?? 'Sin descripción' }}</li>
        <li><strong>Fecha límite:</strong> {{ $task->dt_delivery_limit ?? 'Sin fecha' }}</li>
    </ul>
    <p>Puedes revisarla en el sistema.</p>
</body>
</html>