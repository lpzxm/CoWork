import React from 'react'
import Tag from 'components/ui/Tag'

const TaskInfoCard = ({ task, statusColorMap, formatDate }) => {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-5 flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                    <h4 className="text-xl font-semibold mb-1">{task.title}</h4>
                    {task.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                    )}
                </div>
                <Tag
                    prefix={
                        <span
                            className="tag-affix tag-prefix"
                            style={{ backgroundColor: statusColorMap[task.status?.id] || '#64748B' }}
                        />
                    }
                >
                    {task.status?.name || '-'}
                </Tag>
            </div>

            <div className="grid grid-cols-3 gap-5 text-sm border-t border-slate-100 dark:border-slate-700 pt-5">
                <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Creada por</span>
                    <span className="text-slate-700 dark:text-slate-200">{task.created_by?.name || '-'}</span>
                </div>
                <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Vencimiento</span>
                    <span className="text-slate-700 dark:text-slate-200">{formatDate(task.dt_delivery_limit)}</span>
                </div>
                <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Coordinadores</span>
                    {task.coordinators_assigned?.length > 0 ? (
                        <span className="text-slate-700 dark:text-slate-200">
                            {task.coordinators_assigned.map((c) => c.name).join(', ')}
                        </span>
                    ) : (
                        <span className="text-slate-400">-</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskInfoCard
