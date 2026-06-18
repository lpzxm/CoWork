<?php

namespace App\Mail\Task;

use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;

class TaskDueReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public $recipient,
        public $tasks,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recordatorio de entrega de tareas - CoWork',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.task.due-reminder',
            with: [
                'tasks' => $this->tasks,
                'recipient' => $this->recipient
            ]
        );
    }
}
