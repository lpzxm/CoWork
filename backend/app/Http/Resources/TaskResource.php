<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => [
                'id' => $this->status_id,
                'name' => $this->status->name ?? null,
            ],
            'files' => $this->relationLoaded('files')
                ? $this->files->map(fn($file) => [
                    'id' => $file->id,
                    'name' => $file->file_name,
                    'path' => $file->url,
                    'type' => $file->file_type,
                    'uploaded_by' => $file->uploader ? ['id' => $file->uploader->id, 'name' => $file->uploader->name] : null,
                    'created_at' => $file->created_at,
                ])
                : null,
            'subtasks' => $this->whenLoaded(
                'subtasks',
                fn() =>
                $this->subtasks->map(fn($subtask) => [
                    'id' => $subtask->id,
                    'title' => $subtask->title,
                    'description' => $subtask->description,
                ])
            ),
            'dt_delivery_limit' => $this->dt_delivery_limit,
            'created_by' => $this->creator ? ['id' => $this->creator->id, 'name' => $this->creator->name] : null,
            'accepted_by' => $this->acceptor ? ['id' => $this->acceptor->id, 'name' => $this->acceptor->name] : null,
            'declined_by' => $this->decliner ? ['id' => $this->decliner->id, 'name' => $this->decliner->name] : null,
            'updated_by' => $this->updater ? ['id' => $this->updater->id, 'name' => $this->updater->name] : null,
            'coordinators_assigned' => $this->relationLoaded('coordinators')
                ? $this->coordinators->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                ])
                : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
