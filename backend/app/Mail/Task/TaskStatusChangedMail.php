<?php

namespace App\Mail\Task;

use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;

class TaskStatusChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public $recipient,
        public $task,
        public $changedBy,
        public string $oldStatus,
        public string $newStatus,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Estado de tarea actualizado - {$this->task->title} - CoWork",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.task.status-changed',
            with: [
                'recipient' => $this->recipient,
                'task' => $this->task,
                'changedBy' => $this->changedBy,
                'oldStatus' => $this->oldStatus,
                'newStatus' => $this->newStatus,
                'taskUrl' => config('app.frontend_url') . '/tasks/' . $this->task->id,
            ],
        );
    }
}
