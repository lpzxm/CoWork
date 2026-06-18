import React, { memo } from 'react'
import dayjs from 'dayjs'
import { Button } from 'components/custom'
import Tag from 'components/ui/Tag'
import { HiTrash, HiPencil, HiPaperClip, HiClock, HiEye, HiDownload } from 'react-icons/hi'

const SubtaskCard = memo(({ st, statusColorMap, openEditSubtask, onDelete, onDownloadFile, onPreviewFile, onDeleteFile, formatDate, canEdit = true }) => {
    const overdue = st.dt_delivery_limit && dayjs(st.dt_delivery_limit).isBefore(dayjs(), 'day') && st.status_id !== 4 && st.status_id !== 6 && st.status_id !== 7
    const dueToday = st.dt_delivery_limit && dayjs(st.dt_delivery_limit).isSame(dayjs(), 'day') && st.status_id !== 4 && st.status_id !== 6 && st.status_id !== 7
    const color = statusColorMap[st.status_id] || '#64748B'
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <h5 className="font-medium text-slate-800 dark:text-slate-100 truncate">{st.title}</h5>
                    </div>
                    {st.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{st.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {canEdit && (
                        <Button size="xs" variant="solid" onClick={() => openEditSubtask(st)} icon={<HiPencil />} />
                    )}
                    <Button size="xs" variant="solid" color="danger" onClick={() => onDelete(st.id)} icon={<HiTrash />} />
                </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <Tag prefix={<span className="tag-affix tag-prefix" style={{ backgroundColor: color }} />} className="!text-xs">
                    {st.status_name || '-'}
                </Tag>
                {st.dt_delivery_limit && (
                    <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-semibold' : dueToday ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>
                        <HiClock className="text-xs" />
                        {formatDate(st.dt_delivery_limit)}
                        {overdue && ' (Vencida)'}
                        {dueToday && ' (Hoy)'}
                    </span>
                )}
            </div>
            {(st.files || []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {(st.files || []).map((f) => (
                        <div key={f.id} className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-700 rounded-md px-2 py-1">
                            <HiPaperClip className="text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{f.name}</span>
                            <div className="flex items-center gap-0.5 ml-1">
                                <button type="button" onClick={() => onPreviewFile(f.id, f.name)} className="text-blue-500 hover:text-blue-700 p-0.5" title="Vista previa"><HiEye className="text-xs" /></button>
                                <button type="button" onClick={() => onDownloadFile(f.id, f.name)} className="text-blue-500 hover:text-blue-700 p-0.5" title="Descargar"><HiDownload className="text-xs" /></button>
                                <button type="button" onClick={() => onDeleteFile(st.id, f.id)} className="text-red-400 hover:text-red-600 p-0.5" title="Eliminar"><HiTrash className="text-xs" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
})

export default SubtaskCard
