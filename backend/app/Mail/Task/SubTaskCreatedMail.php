<?php

namespace App\Mail\Task;

use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;

class SubTaskCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public $recipient,
        public $task,
        public $subTask,
        public $creator,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nueva subtarea creada - {$this->task->title} - CoWork",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.task.subtask-created',
            with: [
                'recipient' => $this->recipient,
                'task' => $this->task,
                'subTask' => $this->subTask,
                'creator' => $this->creator,
                'taskUrl' => config('app.frontend_url') . '/tasks/' . $this->task->id,
            ],
        );
    }
}
