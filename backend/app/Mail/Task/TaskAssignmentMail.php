<?php

namespace App\Mail\Task;

use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;

class TaskAssignmentMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public $user,
        public $task,
        public string $action,
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->action === 'assigned' ? 'Asignación de tarea - CoWork' : 'Desasignación de tarea - CoWork';
        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: $this->action === 'assigned' ? 'mail.task.assigned' : 'mail.task.unassigned',
        );
    }
}
