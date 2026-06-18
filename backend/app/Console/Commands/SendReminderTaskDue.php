<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

// models y mailer
use App\Models\Task;
use App\Models\Status;
use App\Mail\Task\TaskDueReminderMail;

#[Signature('app:send-reminder-task-due')]
#[Description('Command description')]
class SendReminderTaskDue extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tasks = Task::with(['status', 'creator', 'coordinators'])
            ->whereBetween('dt_delivery_limit', [now()->startOfDay(), now()->addDays(7)->endOfDay()])
            ->whereNotIn('status_id', [
                Status::COMPLETED,
                Status::IN_REVIEW,
                Status::APPROVED,
                Status::REJECTED,
            ])
            ->get();

        if ($tasks->isEmpty()) {
            $this->info('No existen tareas por vencer proximas a 7 dias.');
            return Command::SUCCESS;
        }

        $grouped = [];
        foreach ($tasks as $task) {
            foreach ($task->coordinators as $coordinator) {
                $grouped[$coordinator->id]['user'] = $coordinator;
                $grouped[$coordinator->id]['tasks'][] = $task;
            }
        }

        foreach ($grouped as $group) {
            Mail::to($group['user']->email)->send(
                new TaskDueReminderMail(recipient: $group['user'], tasks: collect($group['tasks']))
            );
        }

        $this->info('Enviados ' . count($grouped) . ' correos de recordatorio.');
        return Command::SUCCESS;
    }
}
