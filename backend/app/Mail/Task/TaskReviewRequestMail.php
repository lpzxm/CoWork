<?php

namespace App\Mail\Task;

use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;

class TaskReviewRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public $requester,
        public $recipient,
        public $task,
        public string $action
    ) {}

    public function envelope(): Envelope
    {
        $subject = [
            'requested' => 'Solicitud de revisión de tarea - CoWork',
            'approved' => 'Revisión de tarea aprobada - CoWork',
            'rejected' => 'Revisión de tarea rechazada - CoWork',
        ];

        if (!array_key_exists($this->action, $subject)) {
            $this->action = 'requested';
        }

        return new Envelope(
            subject: $subject[$this->action],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.task.task-review-request',
            with: [
                'requester' => $this->requester,
                'recipient' => $this->recipient,
                'task' => $this->task,
                'action' => $this->action
            ],
        );
    }

}