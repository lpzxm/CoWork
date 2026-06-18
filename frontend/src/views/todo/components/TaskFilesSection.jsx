import React from 'react'
import { Button } from 'components/custom'
import { HiPaperClip, HiEye, HiDownload, HiTrash, HiUpload } from 'react-icons/hi'

const TaskFilesSection = ({
    task,
    isAdmin,
    handlePreviewFile,
    handleDownloadFile,
    handleDeleteTaskFile,
    taskNewFiles,
    handleTaskFileSelect,
    handleUploadTaskFiles,
    removeTaskNewFile,
}) => {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h5 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                <HiPaperClip className="text-base" />
                Archivos de la tarea
            </h5>
            {(task.files || []).length > 0 && (
                <div className="mb-3 space-y-2">
                    {(task.files || []).map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800"
                        >
                            <div className="flex items-center gap-2.5 text-sm min-w-0">
                                <HiPaperClip className="text-slate-400 flex-shrink-0" />
                                <span className="truncate">{file.name}</span>
                                <span className="text-xs uppercase text-slate-400 flex-shrink-0">.{file.type}</span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                                <button
                                    type="button"
                                    onClick={() => handlePreviewFile(file.id, file.name)}
                                    className="text-blue-500 hover:text-blue-700 p-1"
                                    title="Vista previa"
                                >
                                    <HiEye />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDownloadFile(file.id, file.name)}
                                    className="text-blue-500 hover:text-blue-700 p-1"
                                    title="Descargar"
                                >
                                    <HiDownload />
                                </button>
                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTaskFile(file.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <HiTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAdmin ? (
                <>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            multiple
                            onChange={handleTaskFileSelect}
                            accept=".pdf,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                            className="block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-400 dark:file:bg-slate-700 dark:file:text-slate-200"
                        />
                        {taskNewFiles.length > 0 && (
                            <Button size="sm" variant="solid" onClick={handleUploadTaskFiles} icon={<HiUpload />}>
                                Subir ({taskNewFiles.length})
                            </Button>
                        )}
                    </div>
                    {taskNewFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {taskNewFiles.map((file, i) => (
                                <div key={i} className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <HiPaperClip className="text-slate-400" />
                                        <span>{file.name}</span>
                                        <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                    <button type="button" onClick={() => removeTaskNewFile(i)} className="text-red-500 hover:text-red-700">
                                        <HiTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : null}
        </div>
    )
}

export default TaskFilesSection
