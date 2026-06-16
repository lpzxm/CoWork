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
            'dt_delivery_limit' => $this->dt_delivery_limit,
            'created_by' => $this->creator ? ['id' => $this->creator->id, 'name' => $this->creator->name] : null,
            'accepted_by' => $this->acceptor ? ['id' => $this->acceptor->id, 'name' => $this->acceptor->name] : null,
            'declined_by' => $this->decliner ? ['id' => $this->decliner->id, 'name' => $this->decliner->name] : null,
            'updated_by' => $this->updater ? ['id' => $this->updater->id, 'name' => $this->updater->name] : null,
            'coordinators' => $this->whenLoaded('coordinators', fn() =>
                $this->coordinators->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                ])
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
