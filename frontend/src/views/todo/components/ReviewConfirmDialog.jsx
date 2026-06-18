import React from 'react'
import ConfirmDialog from 'components/custom/ConfirmDialog'

const ReviewConfirmDialog = ({ isOpen, action, observation, onObservationChange, onConfirm, onCancel }) => {
    return (
        <ConfirmDialog
            isOpen={isOpen}
            title={action === 'approved' ? 'Aprobar revisión' : 'Rechazar revisión'}
            type={action === 'approved' ? 'success' : 'danger'}
            cancelText="Cancelar"
            confirmText={action === 'approved' ? 'Aprobar' : 'Rechazar'}
            confirmButtonColor={action === 'approved' ? 'emerald' : 'red'}
            onCancel={onCancel}
            onConfirm={onConfirm}
        >
            <p className="mb-3">
                {action === 'approved'
                    ? '¿Estás seguro de aprobar esta tarea?'
                    : '¿Estás seguro de rechazar esta tarea?'}
            </p>
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Observación
                </label>
                <textarea
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    rows={3}
                    placeholder="Escribe una observación..."
                    value={observation}
                    onChange={(e) => onObservationChange(e.target.value)}
                />
            </div>
        </ConfirmDialog>
    )
}

export default ReviewConfirmDialog
