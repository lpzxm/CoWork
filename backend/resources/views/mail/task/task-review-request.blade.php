<!DOCTYPE html>
<html>

<head>
    <title>
        @switch($action)
            @case('approved')
                Revisión de tarea aprobada - CoWork
            @break

            @case('rejected')
                Revisión de tarea rechazada - CoWork
            @break

            @default
                Solicitud de revisión de tarea - CoWork
        @endswitch
    </title>
</head>

<body>
    <h1>Hola {{ $recipient->name }},</h1>

    @switch($action)
        @case('requested')
            <p>{{ $requester->name }} ha solicitado la revisión de la tarea:</p>
        @break

        @case('approved')
            <p>{{ $requester->name }} ha <strong>aprobado</strong> la revisión de la tarea:</p>
        @break

        @case('rejected')
            <p>{{ $requester->name }} ha <strong>rechazado</strong> la revisión de la tarea:</p>
        @break
    @endswitch

    <ul>
        <li><strong>Título:</strong> {{ $task->title }}</li>
        <li><strong>Descripción:</strong> {{ $task->description ?? 'Sin descripción' }}</li>
        <li><strong>Fecha límite:</strong> {{ $task->dt_delivery_limit ?? 'Sin fecha' }}</li>
        <li><strong>Estado actual:</strong> {{ $task->status->name ?? 'Sin estado' }}</li>
    </ul>

    @if ($action === 'requested')
        <p>Ingresa al sistema para aprobarla o rechazarla.</p>
    @elseif($action === 'approved')
        <p>La tarea ha sido aprobada. Puedes revisarla en el sistema.</p>
    @elseif($action === 'rejected')
        <p>La tarea ha sido rechazada. Revisa los detalles en el sistema.</p>
    @endif
</body>

</html>
