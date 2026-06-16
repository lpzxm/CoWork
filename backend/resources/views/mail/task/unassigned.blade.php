<!DOCTYPE html>
<html>
<head>
    <title>Te han desasignado de una tarea</title>
</head>
<body>
    <h1>Hola {{ $user->name }},</h1>
    <p>Te han desasignado de la siguiente tarea:</p>
    <ul>
        <li><strong>Título:</strong> {{ $task->title }}</li>
        <li><strong>Descripción:</strong> {{ $task->description ?? 'Sin descripción' }}</li>
    </ul>
    <p>Ya no tienes acceso a esta tarea.</p>
</body>
</html>